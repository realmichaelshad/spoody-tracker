-- Posting limits, in one place so they are easy to tune.
--
-- Rate limiting is enforced server-side in can_post(), which the
-- report-sighting edge function calls before every insert. Changing the
-- numbers here and re-running this file is all that's needed.

create or replace function public.can_post(p_ip_hash text) returns boolean
language sql security definer set search_path = public as $$
  select
    -- burst limit: no more than 3 reports in any 10 minutes
    (
      select count(*) from sightings_private
      where ip_hash = p_ip_hash and created_at > now() - interval '10 minutes'
    ) < 3
    and
    -- daily limit: no more than 10 reports per day, per person
    (
      select count(*) from sightings_private
      where ip_hash = p_ip_hash and created_at > now() - interval '24 hours'
    ) < 10;
$$;

-- How many reports this person has left today (used for the UI hint).
create or replace function public.posts_left_today(p_ip_hash text) returns int
language sql security definer set search_path = public as $$
  select greatest(
    0,
    10 - (
      select count(*) from sightings_private
      where ip_hash = p_ip_hash and created_at > now() - interval '24 hours'
    )
  );
$$;
