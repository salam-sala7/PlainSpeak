create table public.professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  is_demo boolean not null default false
);
alter table public.professionals enable row level security;
revoke all on public.professionals from anon, authenticated;
grant select on public.professionals to anon, authenticated;
create policy "Read directory" on public.professionals for select to anon, authenticated using (true);

create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  pro_id uuid not null references public.professionals(id),
  status text not null default 'requested' check (status in ('requested', 'accepted', 'declined')),
  date timestamptz not null,
  unique (client_id, pro_id, date)
);
alter table public.consultations enable row level security;
revoke all on public.consultations from anon, authenticated;
grant select on public.consultations to authenticated;
grant insert (client_id, pro_id, date) on public.consultations to authenticated;
create policy "Read own consultations" on public.consultations for select to authenticated
  using ((select auth.uid()) = client_id);
create policy "Request own future consultations" on public.consultations for insert to authenticated
  with check ((select auth.uid()) = client_id and date > now());
