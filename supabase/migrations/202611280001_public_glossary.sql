begin;

alter table public.profiles add column if not exists is_verified boolean not null default false;
alter table public.professionals
  add column if not exists is_verified boolean not null default false,
  add column if not exists bio text not null default '';
alter table public.terms
  add column if not exists sponsored boolean not null default false,
  add column if not exists is_demo boolean not null default false;

-- Only migrate display labels from the known demo seed. User text does not
-- grant sponsorship or verification.
update public.terms t
set sponsored = true
from auth.users u
where t.user_id = u.id
  and u.email like '%@plainspeak-demo.invalid'
  and t.id in (
    '7bc1d2e4-3000-4000-8000-000000000001',
    '7bc1d2e4-3000-4000-8000-000000000002',
    '7bc1d2e4-3000-4000-8000-000000000003',
    '7bc1d2e4-3000-4000-8000-000000000013',
    '7bc1d2e4-3000-4000-8000-000000000014',
    '7bc1d2e4-3000-4000-8000-000000000015'
  )
  and t.translation like 'Sponsored demo · %';

update public.terms t
set is_demo = true
from auth.users u
where t.user_id = u.id
  and u.email like '%@plainspeak-demo.invalid'
  and t.id between '7bc1d2e4-3000-4000-8000-000000000001' and '7bc1d2e4-3000-4000-8000-000000000054';

update public.profiles p
set is_verified = p.is_pro
from auth.users u
where p.id = u.id
  and u.email like '%@plainspeak-demo.invalid'
  and u.id between '6b90a343-2000-4000-8000-000000000001' and '6b90a343-2000-4000-8000-000000000027';

update public.professionals l
set is_verified = p.is_verified, bio = p.bio
from public.profiles p
join auth.users u on u.id = p.id
where l.id = p.id and l.is_demo
  and u.email like '%@plainspeak-demo.invalid'
  and u.id between '6b90a343-2000-4000-8000-000000000001' and '6b90a343-2000-4000-8000-000000000027';

-- Expose only the public byline and badge for published terms. The existing
-- profile RLS policies continue to protect private profile fields.
create or replace function public.read_public_terms(term_id uuid default null)
returns table (
  id uuid, jargon text, translation text, analogy text, category text,
  created_at timestamptz, sponsored boolean, is_demo boolean,
  author_name text, author_verified boolean
)
language sql stable security definer set search_path = ''
as $$
  select t.id, t.jargon,
    case when t.is_demo and t.sponsored and t.translation like 'Sponsored demo · %'
      then substr(t.translation, char_length('Sponsored demo · ') + 1)
      else t.translation end,
    t.analogy, t.category, t.created_at, t.sponsored, t.is_demo,
    p.username, coalesce(p.is_verified, false)
  from public.terms t
  left join public.profiles p on p.id = t.user_id
  where term_id is null or t.id = term_id
$$;

revoke all on function public.read_public_terms(uuid) from public;
grant execute on function public.read_public_terms(uuid) to anon, authenticated;
create index if not exists plainspeak_term_feed_order on public.terms (sponsored desc, created_at desc, id);

commit;
