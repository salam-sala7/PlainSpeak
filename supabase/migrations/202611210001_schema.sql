create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(btrim(username)) between 1 and 50)
);

create table public.terms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  jargon text not null check (char_length(btrim(jargon)) between 1 and 160),
  translation text not null check (char_length(btrim(translation)) between 1 and 1500),
  analogy text not null default '' check (char_length(analogy) <= 1500),
  category text not null check (category in ('Contracts', 'Privacy', 'Employment', 'Housing')),
  trust_score integer not null default 0 check (trust_score >= 0),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.terms enable row level security;

revoke all on public.profiles, public.terms from anon, authenticated;
grant select on public.terms to anon, authenticated;
grant insert (user_id, jargon, translation, analogy, category) on public.terms to authenticated;
grant select on public.profiles to authenticated;
grant update (username) on public.profiles to authenticated;

create policy "Read terms" on public.terms for select to anon, authenticated using (true);
create policy "Submit own terms" on public.terms for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Read own profile" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "Update own profile" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
