-- ============================================
-- TENTIA — Schema Supabase
-- Coller dans Supabase > SQL Editor > New query
-- ============================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ── TABLE PROFILES ──────────────────────────
-- Une ligne par utilisateur, tout le jeu en JSON
create table if not exists profiles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  username    text default 'Joueur',
  created_at  timestamptz default now(),

  -- Progression principale
  xp          int default 0,
  level       int default 1,
  hp          int default 50,
  points_left int default 0,

  -- Stats RPG
  force       int default 0,
  intelligence int default 0,
  discipline  int default 0,
  focus       int default 0,

  -- Compétences (JSON)
  skills      jsonb default '{"mecanique":0,"anglais":0,"dev":0,"echec":0,"argent":0}'::jsonb,

  -- Équipement cosmétique
  selected_skin   text default 'Skin_T1',
  selected_bg     jsonb default 'null'::jsonb,
  equipped_title  text default 'title1',
  equipped_avatar text default 'avatar1',
  equipped_pet    text default null,

  -- Récompenses débloquées (JSON arrays)
  titles      jsonb default '[]'::jsonb,
  avatars     jsonb default '[]'::jsonb,
  skins       jsonb default '[]'::jsonb,
  backgrounds jsonb default '[]'::jsonb,
  badges      jsonb default '[]'::jsonb,
  pets        jsonb default '[]'::jsonb,

  -- Badges équipés dans les slots
  badge_slots jsonb default '{"Force":null,"Intelligence":null,"Discipline":null,"Focus":null}'::jsonb,

  -- Hauts Faits
  achievements_claimed jsonb default '{}'::jsonb,

  -- Journal (clé = date YYYY-MM-DD)
  journal     jsonb default '{}'::jsonb,

  -- Quêtes
  quests      jsonb default '[]'::jsonb,

  -- Compteurs HF
  total_login_days  int default 0,
  total_quests_done int default 0,
  total_quest_xp    int default 0,
  total_chess_xp    int default 0,
  peak_elo          int default 0,
  last_login        text default null,
  last_elo          int default 0,
  current_elo       int default 0
);

-- ── SÉCURITÉ RLS ────────────────────────────
-- Chaque utilisateur ne voit que ses propres données
alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

-- ── TRIGGER : créer profil à l'inscription ──
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (user_id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'Joueur'));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
