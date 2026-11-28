begin;
alter table public.community_profiles add column if not exists premium_until timestamptz;
alter table public.professionals add column if not exists premium_until timestamptz;
alter table public.community_posts add column if not exists edited_at timestamptz;
alter table public.community_replies add column if not exists edited_at timestamptz;
grant update(display_name,bio,language) on public.community_profiles to authenticated;
drop policy if exists ps_own_profile_update on public.community_profiles;
create policy ps_own_profile_update on public.community_profiles for update to authenticated using(auth.uid()=id) with check(auth.uid()=id);
grant update(title,body,edited_at,media_path,media_type,media_description),delete on public.community_posts to authenticated;
grant update(body,edited_at),delete on public.community_replies to authenticated;
drop policy if exists ps_own_post_update on public.community_posts;
create policy ps_own_post_update on public.community_posts for update to authenticated using(auth.uid()=author_id) with check(auth.uid()=author_id);
drop policy if exists ps_own_post_delete on public.community_posts;
create policy ps_own_post_delete on public.community_posts for delete to authenticated using(auth.uid()=author_id);
drop policy if exists ps_own_reply_update on public.community_replies;
create policy ps_own_reply_update on public.community_replies for update to authenticated using(auth.uid()=author_id) with check(auth.uid()=author_id);
drop policy if exists ps_own_reply_delete on public.community_replies;
create policy ps_own_reply_delete on public.community_replies for delete to authenticated using(auth.uid()=author_id);
create table if not exists public.ps_verification_requests(id uuid primary key default gen_random_uuid(), user_id uuid not null references public.community_profiles(id) on delete cascade, document_path text not null unique, status text not null default 'pending' check(status in ('pending','approved','rejected')), created_at timestamptz not null default now());
alter table public.ps_verification_requests enable row level security;
revoke all on public.ps_verification_requests from anon,authenticated;
grant select on public.ps_verification_requests to authenticated;
grant insert(user_id,document_path) on public.ps_verification_requests to authenticated;
drop policy if exists ps_verification_read on public.ps_verification_requests;
create policy ps_verification_read on public.ps_verification_requests for select to authenticated using(auth.uid()=user_id);
drop policy if exists ps_verification_insert on public.ps_verification_requests;
create policy ps_verification_insert on public.ps_verification_requests for insert to authenticated with check(auth.uid()=user_id and split_part(document_path,'/',1)=auth.uid()::text and exists(select 1 from public.community_profiles p where p.id=auth.uid() and p.account_type in ('graduate','professional')));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('professional-proof','professional-proof',false,10485760,array['application/pdf','image/jpeg','image/png']) on conflict(id) do update set public=false;
drop policy if exists ps_proof_upload on storage.objects;
create policy ps_proof_upload on storage.objects for insert to authenticated with check(bucket_id='professional-proof' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists ps_proof_read on storage.objects;
create policy ps_proof_read on storage.objects for select to authenticated using(bucket_id='professional-proof' and (storage.foldername(name))[1]=auth.uid()::text);
create or replace function public.ps_community_signup() returns trigger language plpgsql security definer set search_path='' as $$
declare m jsonb; typ text; exp integer; begin
select raw_user_meta_data into m from auth.users where id=new.id;
if m->>'ps_signup' is distinct from 'yes' then return new; end if;
typ:=case when m->>'account_type' in ('graduate','professional') then m->>'account_type' else 'member' end;
exp:=case when coalesce(m->>'experience_years','') ~ '^[0-9]{1,2}$' then (m->>'experience_years')::integer else 0 end;
insert into public.community_profiles(id,display_name,bio,specialty,language,account_type,experience_years) values(new.id,new.username,'',case when typ='member' then '' else left(coalesce(m->>'specialty',''),160) end,case when m->>'language' in ('ar','he','en') then m->>'language' else 'en' end,typ,case when typ='member' then 0 else exp end) on conflict(id) do nothing;
return new; end $$;
revoke execute on function public.ps_community_signup() from public,anon,authenticated;
drop trigger if exists ps_community_signup on public.profiles;
create trigger ps_community_signup after insert on public.profiles for each row execute function public.ps_community_signup();
-- Admin-only approval. Verify document manually before calling in SQL Editor.
create or replace function public.ps_approve_professional(request_id uuid) returns void language plpgsql security definer set search_path='' as $$
declare p public.community_profiles%rowtype; begin
select c.* into p from public.community_profiles c join public.ps_verification_requests r on r.user_id=c.id where r.id=request_id and r.status='pending' and c.account_type in ('graduate','professional');
if not found then raise exception 'Pending request not found'; end if;
update public.ps_verification_requests set status='approved' where id=request_id;
update public.community_profiles set is_verified=true where id=p.id;
update public.profiles set is_verified=true where id=p.id;
insert into public.professionals(id,name,specialty,bio,is_verified,is_demo) values(p.id,p.display_name,p.specialty,p.bio,true,false) on conflict(id) do update set is_verified=true,name=excluded.name,specialty=excluded.specialty,bio=excluded.bio;
end $$;
revoke execute on function public.ps_approve_professional(uuid) from public,anon,authenticated;
-- Only privileged administrators can grant a paid period after actual payment.
create or replace function public.ps_activate_premium(target uuid, expires timestamptz) returns void language plpgsql security definer set search_path='' as $$
begin
if expires is null or expires<=now() then raise exception 'Future expiry required'; end if;
update public.community_profiles set premium_until=expires where id=target and is_verified and not is_demo and account_type in ('graduate','professional');
if not found then raise exception 'Professional verification required'; end if;
update public.professionals set premium_until=expires where id=target and is_verified and not is_demo;
end $$;
revoke execute on function public.ps_activate_premium(uuid,timestamptz) from public,anon,authenticated;
commit;
