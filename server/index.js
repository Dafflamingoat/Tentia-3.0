require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// ── Servir le frontend statique ─────────────
// Le dossier parent du server/ contient index.html etc.
app.use(express.static(path.join(__dirname, '..')));

// ── Routes API ──────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// ── Fallback : toutes les routes non-API → index.html ──
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  }
});

// ── Démarrage ───────────────────────────────
app.listen(PORT, () => {
  console.log(`🎮 Tentia server running on http://localhost:${PORT}`);
});
