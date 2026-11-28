alter table public.profiles
  add column bio text not null default '' check (char_length(bio) <= 1000),
  add column subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'org')),
  add column is_pro boolean not null default false,
  add column org_id uuid;

grant update (bio) on public.profiles to authenticated;
