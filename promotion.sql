-- Optional: admin-controlled sponsorship flags; existing column-level grants remain unchanged.
begin;
alter table public.professionals add column if not exists sponsored boolean not null default false;
alter table public.community_profiles add column if not exists sponsored boolean not null default false;
alter table public.community_posts add column if not exists sponsored boolean not null default false;
commit;
