-- SPOODY TRACKER — complete database setup
-- GENERATED FILE: run `npm run setup-sql` after editing migrations.
--
-- Paste this whole file into the Supabase SQL editor and hit Run.
-- Safe to run once on a fresh project.

-- ======================================================================
-- 0001_init.sql
-- ======================================================================
-- Webhead Tracker — initial schema
-- Run via: supabase db push  (or paste into the Supabase SQL editor)

create extension if not exists pgcrypto;

create type sighting_status as enum ('visible', 'hidden', 'deleted');
create type photo_state as enum ('none', 'screened', 'unscreened', 'removed');

create table public.sightings (
  id           uuid primary key default gen_random_uuid(),
  lat          double precision not null check (lat between -90 and 90),
  lng          double precision not null check (lng between -180 and 180),
  name         text not null check (char_length(name) between 1 and 24),
  message      text not null check (char_length(message) between 1 and 140),
  photo_path   text,
  photo_state  photo_state not null default 'none',
  place_label  text check (char_length(place_label) <= 80),
  status       sighting_status not null default 'visible',
  report_count int not null default 0,
  created_at   timestamptz not null default now()
);

create index sightings_created_idx on public.sightings (created_at desc);
create index sightings_status_idx on public.sightings (status, created_at desc);

-- IP hashes live in a separate table so the public API can never leak them.
create table public.sightings_private (
  sighting_id uuid primary key references public.sightings (id) on delete cascade,
  ip_hash     text not null,
  created_at  timestamptz not null default now()
);
create index sightings_private_ip_idx on public.sightings_private (ip_hash, created_at desc);

create table public.flags (
  sighting_id uuid not null references public.sightings (id) on delete cascade,
  ip_hash     text not null,
  created_at  timestamptz not null default now(),
  primary key (sighting_id, ip_hash)
);

-- Rate limit check, called by the report-sighting edge function (service role).
create or replace function public.can_post(p_ip_hash text) returns boolean
language sql security definer set search_path = public as $$
  select (
    select count(*) from sightings_private
    where ip_hash = p_ip_hash and created_at > now() - interval '10 minutes'
  ) < 3
  and (
    select count(*) from sightings_private
    where ip_hash = p_ip_hash and created_at > now() - interval '24 hours'
  ) < 20;
$$;

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.sightings enable row level security;
alter table public.sightings_private enable row level security;
alter table public.flags enable row level security;

-- Anyone may read visible sightings. There are NO anon write policies at all:
-- every write goes through the edge functions using the service role, which
-- is where rate limiting, validation, and screening happen.
create policy "anon read visible sightings"
  on public.sightings for select
  to anon, authenticated
  using (status = 'visible');

-- sightings_private and flags: no policies => invisible to the public API.

-- ── Realtime ────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.sightings;

-- ── Storage ─────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos', 'photos', true, 2097152,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;
-- Public read via bucket flag; no anon write policies — uploads happen inside
-- the report-sighting function with the service role.

-- ======================================================================
-- 0002_social.sql
-- ======================================================================
-- Social layer: likes ("web-ups") + replies

create table public.likes (
  sighting_id uuid not null references public.sightings (id) on delete cascade,
  ip_hash     text not null,
  created_at  timestamptz not null default now(),
  primary key (sighting_id, ip_hash)
);

create table public.replies (
  id              uuid primary key default gen_random_uuid(),
  sighting_id     uuid not null references public.sightings (id) on delete cascade,
  parent_reply_id uuid references public.replies (id) on delete cascade,
  name            text not null check (char_length(name) between 1 and 24),
  message         text not null check (char_length(message) between 1 and 140),
  created_at      timestamptz not null default now()
);
create index replies_sighting_idx on public.replies (sighting_id, created_at);

create table public.replies_private (
  reply_id   uuid primary key references public.replies (id) on delete cascade,
  ip_hash    text not null,
  created_at timestamptz not null default now()
);
create index replies_private_ip_idx on public.replies_private (ip_hash, created_at desc);

-- denormalized counters on sightings (kept by the edge functions)
alter table public.sightings add column if not exists like_count int not null default 0;
alter table public.sightings add column if not exists reply_count int not null default 0;

-- reply rate limit (reuses the pattern from can_post)
create or replace function public.can_reply(p_ip_hash text) returns boolean
language sql security definer set search_path = public as $$
  select (
    select count(*) from replies_private
    where ip_hash = p_ip_hash and created_at > now() - interval '10 minutes'
  ) < 10
  and (
    select count(*) from replies_private
    where ip_hash = p_ip_hash and created_at > now() - interval '24 hours'
  ) < 60;
$$;

-- RLS
alter table public.likes enable row level security;
alter table public.replies enable row level security;
alter table public.replies_private enable row level security;

-- Replies on visible sightings are publicly readable; all writes go through
-- edge functions. likes/replies_private stay invisible to the public API.
create policy "anon read replies"
  on public.replies for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.sightings s
      where s.id = sighting_id and s.status = 'visible'
    )
  );

