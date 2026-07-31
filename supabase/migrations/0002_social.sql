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
