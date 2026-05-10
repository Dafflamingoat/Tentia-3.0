const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../supabase');
const { requireAuth } = require('../middleware/auth');

const pendingStates = new Map();
const STRAVA_AUTHORIZE_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_URL = 'https://www.strava.com/api/v3';
const STRAVA_SCOPES = 'read,activity:read_all';

function getBaseUrl(req) {
  return process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
}

function buildAthleteName(athlete) {
  if (!athlete) return null;
  return [athlete.firstname, athlete.lastname].filter(Boolean).join(' ').trim()
    || athlete.username
    || `Athlete ${athlete.id}`;
}

function cleanExpiredStates() {
  const now = Date.now();
  for (const [state, value] of pendingStates.entries()) {
    if (value.expiresAt <= now) pendingStates.delete(state);
  }
}

function getWeekStart(date = new Date()) {
  const start = new Date(date);
  const day = start.getDay() || 7;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - day + 1);
  return start;
}

function simplifyActivity(activity) {
  return {
    id: activity.id,
    name: activity.name,
    type: activity.type,
    sport_type: activity.sport_type,
    start_date: activity.start_date,
    distance: activity.distance || 0,
    moving_time: activity.moving_time || 0,
    elapsed_time: activity.elapsed_time || 0,
    total_elevation_gain: activity.total_elevation_gain || 0,
    average_speed: activity.average_speed || 0,
    max_speed: activity.max_speed || 0,
    average_heartrate: activity.average_heartrate || null,
    max_heartrate: activity.max_heartrate || null,
    average_watts: activity.average_watts || null,
    kilojoules: activity.kilojoules || null,
    calories: activity.calories || null
  };
}

function buildSummary(activities) {
  const weekStart = getWeekStart();
  const weekActivities = activities.filter(activity => new Date(activity.start_date) >= weekStart);
  const totals = weekActivities.reduce((acc, activity) => {
    acc.activities += 1;
    acc.distance += activity.distance || 0;
    acc.moving_time += activity.moving_time || 0;
    acc.elevation_gain += activity.total_elevation_gain || 0;
    return acc;
  }, { activities: 0, distance: 0, moving_time: 0, elevation_gain: 0 });

  return {
    period: 'week',
    since: weekStart.toISOString(),
    totals,
    lastActivity: activities[0] || null
  };
}

async function getStravaProfile(userId) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('strava_athlete,strava_access_token,strava_refresh_token,strava_token_expires_at')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

async function getValidAccessToken(userId, profile) {
  if (!profile?.strava_access_token || !profile?.strava_refresh_token) return null;

  const expiresAtMs = Number(profile.strava_token_expires_at || 0) * 1000;
  if (expiresAtMs > Date.now() + 60000) return profile.strava_access_token;

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Configuration Strava incomplete.');

  const refreshResp = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: profile.strava_refresh_token
    })
  });

  const refreshData = await refreshResp.json();
  if (!refreshResp.ok) {
    console.error('Strava refresh error:', refreshData);
    throw new Error('Refresh Strava impossible.');
  }

  await supabaseAdmin
    .from('profiles')
    .update({
      strava_access_token: refreshData.access_token,
      strava_refresh_token: refreshData.refresh_token,
      strava_token_expires_at: refreshData.expires_at
    })
    .eq('user_id', userId);

  return refreshData.access_token;
}

router.post('/connect-url', requireAuth, (req, res) => {
  const clientId = process.env.STRAVA_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'STRAVA_CLIENT_ID manquant dans server/.env' });
  }

  cleanExpiredStates();
  const state = crypto.randomBytes(24).toString('hex');
  pendingStates.set(state, {
    userId: req.user.id,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  const url = new URL(STRAVA_AUTHORIZE_URL);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `${getBaseUrl(req)}/api/strava/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('approval_prompt', 'auto');
  url.searchParams.set('scope', STRAVA_SCOPES);
  url.searchParams.set('state', state);

  res.json({ url: url.toString() });
});

router.get('/status', requireAuth, async (req, res) => {
  try {
    const data = await getStravaProfile(req.user.id);
    const athlete = data.strava_athlete || null;
    res.json({
      connected: Boolean(data.strava_access_token && athlete),
      athlete,
      athleteName: buildAthleteName(athlete)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/activities', requireAuth, async (req, res) => {
  try {
    const profile = await getStravaProfile(req.user.id);
    const accessToken = await getValidAccessToken(req.user.id, profile);
    if (!accessToken) return res.status(401).json({ error: 'Compte Strava non connecte' });

    const perPage = Math.min(parseInt(req.query.per_page, 10) || 30, 100);
    const url = new URL(`${STRAVA_API_URL}/athlete/activities`);
    url.searchParams.set('per_page', perPage);
    url.searchParams.set('page', '1');
    if (req.query.after) url.searchParams.set('after', req.query.after);
    if (req.query.before) url.searchParams.set('before', req.query.before);

    const activitiesResp = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const rawActivities = await activitiesResp.json();
    if (!activitiesResp.ok) return res.status(activitiesResp.status).json(rawActivities);

    const activities = rawActivities.map(simplifyActivity);
    res.json({
      connected: true,
      athleteName: buildAthleteName(profile.strava_athlete),
      activities,
      summary: buildSummary(activities)
    });
  } catch (error) {
    console.error('Strava activities error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/summary', requireAuth, async (req, res) => {
  try {
    const profile = await getStravaProfile(req.user.id);
    const accessToken = await getValidAccessToken(req.user.id, profile);
    if (!accessToken) return res.json({ connected: false, summary: null });

    const weekStart = Math.floor(getWeekStart().getTime() / 1000);
    const url = new URL(`${STRAVA_API_URL}/athlete/activities`);
    url.searchParams.set('after', String(weekStart));
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', '1');

    const activitiesResp = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const rawActivities = await activitiesResp.json();
    if (!activitiesResp.ok) return res.status(activitiesResp.status).json(rawActivities);

    const activities = rawActivities.map(simplifyActivity);
    res.json({
      connected: true,
      athleteName: buildAthleteName(profile.strava_athlete),
      summary: buildSummary(activities),
      activities
    });
  } catch (error) {
    console.error('Strava summary error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/disconnect', requireAuth, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      strava_athlete: null,
      strava_access_token: null,
      strava_refresh_token: null,
      strava_token_expires_at: null
    })
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ connected: false });
});

router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;
  if (error) return res.redirect(`/?strava=denied`);
  if (!code || !state) return res.status(400).send('Code Strava manquant.');

  cleanExpiredStates();
  const pending = pendingStates.get(state);
  if (!pending) return res.status(400).send('Session Strava expiree. Relance la connexion.');
  pendingStates.delete(state);

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).send('STRAVA_CLIENT_ID ou STRAVA_CLIENT_SECRET manquant.');
  }

  try {
    const tokenResp = await fetch(STRAVA_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResp.json();
    if (!tokenResp.ok) {
      console.error('Strava token error:', tokenData);
      return res.redirect('/?strava=error');
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        strava_athlete: tokenData.athlete || null,
        strava_access_token: tokenData.access_token || null,
        strava_refresh_token: tokenData.refresh_token || null,
        strava_token_expires_at: tokenData.expires_at || null
      })
      .eq('user_id', pending.userId);

    if (updateError) {
      console.error('Strava save error:', updateError);
      return res.redirect('/?strava=save_error');
    }

    res.redirect('/?strava=connected');
  } catch (err) {
    console.error('Strava callback error:', err);
    res.redirect('/?strava=error');
  }
});

module.exports = router;
