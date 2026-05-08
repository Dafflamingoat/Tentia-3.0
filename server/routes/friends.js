const express = require('express');
const router  = express.Router();
const { supabaseAdmin } = require('../supabase');
const { requireAuth }   = require('../middleware/auth');

router.use(requireAuth);

// ── PUT /api/friends/lastseen ────────────────
// Met à jour last_seen (appelé toutes les 60s côté client)
router.put('/lastseen', async (req, res) => {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ last_seen: new Date().toISOString() })
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── GET /api/friends/list ────────────────────
// Retourne la liste d'amis avec statut en ligne
router.get('/list', async (req, res) => {
  const { data: friendRows, error } = await supabaseAdmin
    .from('friends')
    .select('friend_id')
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  if (!friendRows.length) return res.json([]);

  const friendIds = friendRows.map(r => r.friend_id);

  const { data: profiles, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('user_id, username, level, last_seen')
    .in('user_id', friendIds);

  if (profileError) return res.status(500).json({ error: profileError.message });

  const now = Date.now();
  const result = profiles.map(p => ({
    user_id:  p.user_id,
    username: p.username,
    level:    p.level,
    online:   p.last_seen && (now - new Date(p.last_seen).getTime()) < 2 * 60 * 1000
  }));

  res.json(result);
});

// ── GET /api/friends/requests ────────────────
// Retourne les demandes reçues en attente
router.get('/requests', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('friend_requests')
    .select('id, from_user_id, created_at')
    .eq('to_user_id', req.user.id)
    .eq('status', 'pending');

  if (error) return res.status(500).json({ error: error.message });

  if (!data.length) return res.json([]);

  const fromIds = data.map(r => r.from_user_id);
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('user_id, username')
    .in('user_id', fromIds);

  const result = data.map(r => ({
    request_id: r.id,
    from_user_id: r.from_user_id,
    username: profiles.find(p => p.user_id === r.from_user_id)?.username || '?',
    created_at: r.created_at
  }));

  res.json(result);
});

// ── POST /api/friends/request ────────────────
// Envoyer une demande d'ami par username
router.post('/request', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username requis' });

  // Trouver l'utilisateur cible
  const { data: target, error: targetError } = await supabaseAdmin
    .from('profiles')
    .select('user_id, username')
    .ilike('username', username)
    .single();

  if (targetError || !target) return res.status(404).json({ error: 'Utilisateur introuvable' });
  if (target.user_id === req.user.id) return res.status(400).json({ error: 'Tu ne peux pas t\'ajouter toi-même' });

  // Vérifier si déjà ami
  const { data: existing } = await supabaseAdmin
    .from('friends')
    .select('id')
    .eq('user_id', req.user.id)
    .eq('friend_id', target.user_id)
    .single();

  if (existing) return res.status(400).json({ error: 'Déjà ami avec cet utilisateur' });

  // Vérifier si demande déjà envoyée
  const { data: existingReq } = await supabaseAdmin
    .from('friend_requests')
    .select('id, status')
    .eq('from_user_id', req.user.id)
    .eq('to_user_id', target.user_id)
    .single();

  if (existingReq?.status === 'pending') return res.status(400).json({ error: 'Demande déjà envoyée' });

  // Créer la demande
  const { error: insertError } = await supabaseAdmin
    .from('friend_requests')
    .upsert({ from_user_id: req.user.id, to_user_id: target.user_id, status: 'pending' });

  if (insertError) return res.status(500).json({ error: insertError.message });

  res.json({ ok: true, message: `Demande envoyée à ${target.username}` });
});

// ── POST /api/friends/accept ─────────────────
// Accepter une demande d'ami
router.post('/accept', async (req, res) => {
  const { request_id } = req.body;
  if (!request_id) return res.status(400).json({ error: 'request_id requis' });

  // Récupérer la demande
  const { data: req_data, error } = await supabaseAdmin
    .from('friend_requests')
    .select('*')
    .eq('id', request_id)
    .eq('to_user_id', req.user.id)
    .eq('status', 'pending')
    .single();

  if (error || !req_data) return res.status(404).json({ error: 'Demande introuvable' });

  // Mettre à jour le statut
  await supabaseAdmin
    .from('friend_requests')
    .update({ status: 'accepted' })
    .eq('id', request_id);

  // Ajouter les deux sens dans friends
  await supabaseAdmin.from('friends').upsert([
    { user_id: req_data.from_user_id, friend_id: req_data.to_user_id },
    { user_id: req_data.to_user_id,   friend_id: req_data.from_user_id }
  ]);

  res.json({ ok: true });
});

// ── POST /api/friends/decline ────────────────
// Refuser une demande d'ami
router.post('/decline', async (req, res) => {
  const { request_id } = req.body;
  if (!request_id) return res.status(400).json({ error: 'request_id requis' });

  await supabaseAdmin
    .from('friend_requests')
    .update({ status: 'declined' })
    .eq('id', request_id)
    .eq('to_user_id', req.user.id);

  res.json({ ok: true });
});

// ── DELETE /api/friends/remove ───────────────
// Supprimer un ami
router.delete('/remove', async (req, res) => {
  const { friend_id } = req.body;
  if (!friend_id) return res.status(400).json({ error: 'friend_id requis' });

  await supabaseAdmin
    .from('friends')
    .delete()
    .or(`and(user_id.eq.${req.user.id},friend_id.eq.${friend_id}),and(user_id.eq.${friend_id},friend_id.eq.${req.user.id})`);

  res.json({ ok: true });
});

// ── GET /api/friends/profile/:username ───────
// Récupérer le profil public d'un ami
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('username, level, xp, force, intelligence, discipline, focus, selected_skin, equipped_avatar, equipped_title, badge_slots, last_seen, current_elo')
    .ilike('username', username)
    .single();

  if (error || !profile) return res.status(404).json({ error: 'Profil introuvable' });

  const now = Date.now();
  res.json({
    ...profile,
    online: profile.last_seen && (now - new Date(profile.last_seen).getTime()) < 2 * 60 * 1000
  });
});

module.exports = router;
