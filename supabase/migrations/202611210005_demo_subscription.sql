create function public.set_demo_subscription(tier text)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  account_id uuid := auth.uid();
  saved_tier text;
begin
  if account_id is null then
    raise exception 'Sign in to select a plan';
  end if;
  if tier is null or tier not in ('free', 'pro', 'org') then
    raise exception 'Invalid demo plan';
  end if;

  update public.profiles
    set subscription_tier = tier
    where id = account_id
    returning subscription_tier into saved_tier;
  if not found then
    raise exception 'Profile not found';
  end if;
  return saved_tier;
end;
$$;

revoke execute on function public.set_demo_subscription(text) from public, anon;
grant execute on function public.set_demo_subscription(text) to authenticated;
