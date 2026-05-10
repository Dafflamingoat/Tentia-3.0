const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../supabase');
const { requireAuth } = require('../middleware/auth');

const pendingStates = new Map();
const STRAVA_AUTHORIZE_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
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
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('strava_athlete,strava_access_token')
    .eq('user_id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const athlete = data.strava_athlete || null;
  res.json({
    connected: Boolean(data.strava_access_token && athlete),
    athlete,
    athleteName: buildAthleteName(athlete)
  });
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
