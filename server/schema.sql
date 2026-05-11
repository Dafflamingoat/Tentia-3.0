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
  xp_buffer   numeric default 0,
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
  quest_history jsonb default '{}'::jsonb,
  quest_reputation jsonb default '{"submitted":0,"accepted":0,"rejected":0,"score":null}'::jsonb,
  dashboard_profile_photo text default null,

  -- Compteurs HF
  total_login_days  int default 0,
  total_quests_done int default 0,
  total_quest_xp    int default 0,
  total_chess_xp    int default 0,
  peak_elo          int default 0,
  last_login        text default null,
  last_elo          int default 0,
  current_elo       int default 0,

  -- Strava
  strava_athlete          jsonb default null,
  strava_access_token     text default null,
  strava_refresh_token    text default null,
  strava_token_expires_at int default null,
  strava_rewarded_activities jsonb default '{}'::jsonb,
  strava_daily_pv jsonb default '{}'::jsonb,
  strava_daily_xp jsonb default '{}'::jsonb
);

-- Colonnes Strava pour une base deja creee
alter table profiles add column if not exists strava_athlete jsonb default null;
alter table profiles add column if not exists strava_access_token text default null;
alter table profiles add column if not exists strava_refresh_token text default null;
alter table profiles add column if not exists strava_token_expires_at int default null;
alter table profiles add column if not exists strava_rewarded_activities jsonb default '{}'::jsonb;
alter table profiles add column if not exists strava_daily_pv jsonb default '{}'::jsonb;
alter table profiles add column if not exists strava_daily_xp jsonb default '{}'::jsonb;
alter table profiles add column if not exists quest_history jsonb default '{}'::jsonb;
alter table profiles add column if not exists quest_reputation jsonb default '{"submitted":0,"accepted":0,"rejected":0,"score":null}'::jsonb;
alter table profiles add column if not exists xp_buffer numeric default 0;
alter table profiles add column if not exists dashboard_profile_photo text default null;

-- Rework quetes : validations sociales / publiques / moderation
create table if not exists quest_validations (
  id uuid primary key default uuid_generate_v4(),
  owner_user_id uuid references auth.users(id) on delete cascade not null,
  quest_id text not null,
  quest_text text not null,
  total_xp numeric not null default 5,
  immediate_xp numeric not null default 0,
  friend_xp numeric not null default 0,
  public_xp numeric not null default 0,
  fallback_xp numeric not null default 0,
  public_slots int not null default 0 check (public_slots between 0 and 4),
  friend_validator_ids uuid[] default '{}',
  moderator_required boolean default false,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','cancelled')),
  friend_status text not null default 'pending' check (friend_status in ('none','pending','accepted','rejected')),
  public_status text not null default 'pending' check (public_status in ('none','pending','accepted','rejected')),
  moderator_status text not null default 'none' check (moderator_status in ('none','pending','accepted','rejected')),
  xp_awarded numeric not null default 0,
  created_at timestamptz default now(),
  resolved_at timestamptz default null
);

create table if not exists quest_validation_votes (
  id uuid primary key default uuid_generate_v4(),
  validation_id uuid references quest_validations(id) on delete cascade not null,
  voter_user_id uuid references auth.users(id) on delete cascade not null,
  vote_scope text not null check (vote_scope in ('friend','public','moderator')),
  vote_value boolean not null,
  vote_weight numeric not null default 1,
  created_at timestamptz default now(),
  unique(validation_id, voter_user_id, vote_scope)
);

alter table quest_validations enable row level security;
alter table quest_validation_votes enable row level security;

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
