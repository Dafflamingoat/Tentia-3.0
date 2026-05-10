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
const STRAVA_DAILY_PV_CAP = 20;

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

function getActivityLabel(activityType = 'all') {
  const labels = {
    all: 'Toutes',
    Run: 'Course',
    Ride: 'Velo',
    Walk: 'Marche',
    Hike: 'Randonnee',
    Swim: 'Natation',
    Workout: 'Workout',
    WeightTraining: 'Muscu'
  };
  return labels[activityType] || activityType;
}

function activityMatchesType(activity, activityType = 'all') {
  if (!activityType || activityType === 'all') return true;
  if (activity.type === activityType || activity.sport_type === activityType) return true;

  const groups = {
    Ride: ['Ride', 'MountainBikeRide', 'GravelRide', 'VirtualRide', 'EBikeRide', 'EMountainBikeRide'],
    Run: ['Run', 'TrailRun', 'VirtualRun'],
    Walk: ['Walk'],
    Hike: ['Hike'],
    Swim: ['Swim'],
    WeightTraining: ['WeightTraining'],
    Workout: ['Workout', 'Crossfit', 'Elliptical', 'StairStepper', 'WeightTraining']
  };

  return (groups[activityType] || []).includes(activity.type)
    || (groups[activityType] || []).includes(activity.sport_type);
}

function buildSummary(activities, activityType = 'all') {
  const weekStart = getWeekStart();
  const weekActivities = activities
    .filter(activity => new Date(activity.start_date) >= weekStart)
    .filter(activity => activityMatchesType(activity, activityType));
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
    activityType,
    activityLabel: getActivityLabel(activityType),
    totals,
    lastActivity: weekActivities[0] || null
  };
}

async function getStravaProfile(userId) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('hp,strava_athlete,strava_access_token,strava_refresh_token,strava_token_expires_at,strava_rewarded_activities,strava_daily_pv')
    .eq('user_id', userId)
    .single();

  if (!error) return data;

  const missingRewardColumns = /strava_rewarded_activities|strava_daily_pv/i.test(error.message || '');
  if (!missingRewardColumns) throw error;

  const fallback = await supabaseAdmin
    .from('profiles')
    .select('hp,strava_athlete,strava_access_token,strava_refresh_token,strava_token_expires_at')
    .eq('user_id', userId)
    .single();

  if (fallback.error) throw fallback.error;
  return {
    ...fallback.data,
    strava_rewarded_activities: {},
    strava_daily_pv: {},
    _missingStravaRewardColumns: true
  };
}

function getActivityDayKey(activity) {
  const date = new Date(activity.start_date);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getActivityFamily(activity) {
  if (activityMatchesType(activity, 'Run')) return 'Run';
  if (activityMatchesType(activity, 'Ride')) return 'Ride';
  if (activityMatchesType(activity, 'Walk')) return 'Walk';
  if (activityMatchesType(activity, 'Hike')) return 'Hike';
  if (activityMatchesType(activity, 'Swim')) return 'Swim';
  if (activityMatchesType(activity, 'WeightTraining')) return 'WeightTraining';
  if (activityMatchesType(activity, 'Workout')) return 'Workout';
  return activity.sport_type || activity.type || 'Other';
}

function calculateActivityPv(activity) {
  const family = getActivityFamily(activity);
  const minutes = Math.floor((activity.moving_time || 0) / 60);
  const distanceKm = (activity.distance || 0) / 1000;
  const elevation = activity.total_elevation_gain || 0;

  if (minutes < 10) return 0;

  let pv = 0;
  if (family === 'Run') {
    pv = 2 + Math.floor(minutes / 15) + Math.floor(distanceKm / 3) + Math.floor(elevation / 150);
    return Math.min(pv, 15);
  }
  if (family === 'Ride') {
    pv = 2 + Math.floor(minutes / 20) + Math.floor(distanceKm / 10) + Math.floor(elevation / 250);
    return Math.min(pv, 12);
  }
  if (family === 'Walk') {
    pv = 1 + Math.floor(minutes / 25) + Math.floor(distanceKm / 4);
    return Math.min(pv, 8);
  }
  if (family === 'Hike') {
    pv = 2 + Math.floor(minutes / 25) + Math.floor(elevation / 150);
    return Math.min(pv, 12);
  }
  if (family === 'Swim') {
    pv = 2 + Math.floor(minutes / 15);
    return Math.min(pv, 12);
  }
  if (family === 'WeightTraining' || family === 'Workout') {
    pv = 2 + Math.floor(minutes / 20);
    return Math.min(pv, 10);
  }

  return Math.min(1 + Math.floor(minutes / 30), 6);
}

async function fetchRecentActivities(accessToken, afterSeconds) {
  const url = new URL(`${STRAVA_API_URL}/athlete/activities`);
  url.searchParams.set('after', String(afterSeconds));
  url.searchParams.set('per_page', '100');
  url.searchParams.set('page', '1');

  const activitiesResp = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const rawActivities = await activitiesResp.json();
  if (!activitiesResp.ok) {
    const error = new Error('Activites Strava indisponibles');
    error.status = activitiesResp.status;
    error.payload = rawActivities;
    throw error;
  }

  return rawActivities.map(simplifyActivity);
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
    const activityType = String(req.query.activity || 'all');

    const activitiesResp = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const rawActivities = await activitiesResp.json();
    if (!activitiesResp.ok) return res.status(activitiesResp.status).json(rawActivities);

    const activities = rawActivities
      .map(simplifyActivity)
      .filter(activity => activityMatchesType(activity, activityType));
    res.json({
      connected: true,
      athleteName: buildAthleteName(profile.strava_athlete),
      activities,
      summary: buildSummary(activities, activityType)
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
    const activityType = String(req.query.activity || 'all');

    const activitiesResp = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const rawActivities = await activitiesResp.json();
    if (!activitiesResp.ok) return res.status(activitiesResp.status).json(rawActivities);

    const activities = rawActivities.map(simplifyActivity);
    res.json({
      connected: true,
      athleteName: buildAthleteName(profile.strava_athlete),
      summary: buildSummary(activities, activityType),
      activities: activities.filter(activity => activityMatchesType(activity, activityType))
    });
  } catch (error) {
    console.error('Strava summary error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/claim-pv', requireAuth, async (req, res) => {
  try {
    const profile = await getStravaProfile(req.user.id);
    const accessToken = await getValidAccessToken(req.user.id, profile);
    if (!accessToken) return res.json({ connected: false, hpDelta: 0, claimed: [] });
    if (profile._missingStravaRewardColumns) {
      return res.status(409).json({
        error: 'Migration Strava PV manquante',
        sql: [
          "alter table profiles add column if not exists strava_rewarded_activities jsonb default '{}'::jsonb;",
          "alter table profiles add column if not exists strava_daily_pv jsonb default '{}'::jsonb;"
        ]
      });
    }

    const weekStart = Math.floor(getWeekStart().getTime() / 1000);
    const activities = await fetchRecentActivities(accessToken, weekStart);
    const rewarded = profile.strava_rewarded_activities || {};
    const dailyPv = profile.strava_daily_pv || {};
    const claimed = [];
    let totalDelta = 0;

    activities
      .slice()
      .reverse()
      .forEach((activity) => {
        const activityId = String(activity.id);
        if (rewarded[activityId]) return;

        const dayKey = getActivityDayKey(activity);
        const alreadyToday = Number(dailyPv[dayKey] || 0);
        const remainingToday = Math.max(0, STRAVA_DAILY_PV_CAP - alreadyToday);
        if (remainingToday <= 0) return;

        const basePv = calculateActivityPv(activity);
        const pvAwarded = Math.min(basePv, remainingToday);
        if (pvAwarded <= 0) return;

        rewarded[activityId] = {
          pv: pvAwarded,
          basePv,
          type: activity.type,
          sport_type: activity.sport_type,
          name: activity.name,
          start_date: activity.start_date,
          claimed_at: new Date().toISOString()
        };
        dailyPv[dayKey] = alreadyToday + pvAwarded;
        totalDelta += pvAwarded;
        claimed.push({ id: activity.id, name: activity.name, pv: pvAwarded });
      });

    const currentHp = Number(profile.hp || 0);
    const nextHp = Math.max(0, Math.min(currentHp + totalDelta, 100));

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        hp: nextHp,
        strava_rewarded_activities: rewarded,
        strava_daily_pv: dailyPv
      })
      .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({
      connected: true,
      hpBefore: currentHp,
      hpAfter: nextHp,
      hpDelta: nextHp - currentHp,
      rawPvDelta: totalDelta,
      claimed,
      dailyCap: STRAVA_DAILY_PV_CAP
    });
  } catch (error) {
    console.error('Strava claim PV error:', error);
    res.status(error.status || 500).json(error.payload || { error: error.message });
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
