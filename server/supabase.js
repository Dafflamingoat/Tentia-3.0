const { createClient } = require('@supabase/supabase-js');

// Client avec service_role pour les opérations serveur (bypass RLS)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Client avec anon key pour vérifier les tokens utilisateurs
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = { supabase, supabaseAdmin };
