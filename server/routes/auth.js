const express  = require('express');
const router   = express.Router();
const { supabase, supabaseAdmin } = require('../supabase');

// ── POST /api/auth/register ──────────────────
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, mot de passe et pseudo requis' });
  }

  // 1. Créer le compte auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const userId = data.user?.id;

  // 2. Créer le profil manuellement avec supabaseAdmin (bypass RLS)
  if (userId) {
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({ user_id: userId, username })
      .single();

    if (profileError && profileError.code !== '23505') {
      // 23505 = duplicate key, profil déjà créé par trigger, pas grave
      console.error('Erreur création profil:', profileError);
    }
  }

  res.json({
    message: 'Compte créé ! Tu peux maintenant te connecter.',
    user: { id: userId, email: data.user?.email }
  });
});

// ── POST /api/auth/login ─────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  res.json({
    token:   data.session.access_token,
    refresh: data.session.refresh_token,
    user: {
      id:       data.user.id,
      email:    data.user.email,
      username: data.user.user_metadata?.username || 'Joueur'
    }
  });
});

// ── POST /api/auth/logout ────────────────────
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) await supabase.auth.admin.signOut(token);
  res.json({ message: 'Déconnecté' });
});

// ── POST /api/auth/refresh ───────────────────
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ error: 'Refresh token requis' });

  const { data, error } = await supabase.auth.refreshSession({ refresh_token });
  if (error) return res.status(401).json({ error: 'Session expirée' });

  res.json({
    token:   data.session.access_token,
    refresh: data.session.refresh_token
  });
});

module.exports = router;
