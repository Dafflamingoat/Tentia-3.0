const { supabase } = require('../supabase');

// Middleware : vérifie le token JWT Supabase dans le header Authorization
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Token invalide' });
  }

  req.user = user;
  next();
}

module.exports = { requireAuth };
