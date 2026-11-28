create function public.create_profile_for_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(nullif(left(btrim(new.raw_user_meta_data->>'username'), 50), ''), 'Member'));
  return new;
end;
$$;

revoke execute on function public.create_profile_for_user() from public, anon, authenticated;
create trigger create_profile_on_signup
  after insert on auth.users
  for each row execute function public.create_profile_for_user();

insert into public.profiles (id, username)
select id, coalesce(nullif(left(btrim(raw_user_meta_data->>'username'), 50), ''), 'Member')
from auth.users
on conflict (id) do nothing;
