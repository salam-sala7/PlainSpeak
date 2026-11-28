-- PlainSpeak fictional sample accounts, professional listings, and terms.
-- Run after all migrations.
-- Demo authors have no password or email identity. They are sample records.
-- "Sponsored" is a feed preview based on the existing newest-first sort.
-- is_pro uses the existing professional field. The feed has no verification badge.
-- Running this again with the same IDs avoids duplicate rows.
-- Existing demo promotions get a fresh date for each presentation.

begin;

do $$
begin
  if to_regclass('public.profiles') is null
    or to_regclass('public.terms') is null
    or to_regclass('public.professionals') is null
    or not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'profiles'
        and column_name = 'is_verified'
    )
  then
    raise exception 'Apply all PlainSpeak migrations before running this demo seed.';
  end if;
end
$$;

create temporary table plainspeak_demo_authors (
  id uuid primary key,
  email text not null,
  username text not null,
  specialty text,
  bio text not null,
  is_pro boolean not null
) on commit drop;

insert into plainspeak_demo_authors values
  ('6b90a343-2000-4000-8000-000000000001', 'leila@plainspeak-demo.invalid', 'Leila Maren', 'Contract lawyer', 'Demo profile. Explains contract clauses in plain language.', true),
  ('6b90a343-2000-4000-8000-000000000002', 'omar@plainspeak-demo.invalid', 'Omar Kellan', 'Employment lawyer', 'Demo profile. Writes about common workplace documents.', true),
  ('6b90a343-2000-4000-8000-000000000003', 'nora@plainspeak-demo.invalid', 'Dr. Nora Vale', 'Family medicine physician', 'Demo profile. Explains forms commonly used at clinics.', true),
  ('6b90a343-2000-4000-8000-000000000004', 'adam@plainspeak-demo.invalid', 'Dr. Adam Solen', 'Dentist', 'Demo profile. Explains dental treatment estimates and paperwork.', true),
  ('6b90a343-2000-4000-8000-000000000005', 'reem@plainspeak-demo.invalid', 'Reem Linden', 'Accountant', 'Demo profile. Explains invoices and payslip terminology.', true),
  ('6b90a343-2000-4000-8000-000000000006', 'sami@plainspeak-demo.invalid', 'Sami Calder', 'Tax accountant', 'Demo profile. Writes about recordkeeping.', true),
  ('6b90a343-2000-4000-8000-000000000007', 'dana@plainspeak-demo.invalid', 'Dana Rowan', null, 'Demo community member. Shares housing terms she has looked up.', false),
  ('6b90a343-2000-4000-8000-000000000008', 'yousef@plainspeak-demo.invalid', 'Yousef Ellin', null, 'Demo community member. Shares definitions from workplace documents.', false),
  ('6b90a343-2000-4000-8000-000000000009', 'maya@plainspeak-demo.invalid', 'Maya Norin', null, 'Demo community member. Interested in digital privacy.', false),
  ('6b90a343-2000-4000-8000-000000000010', 'yasmin@plainspeak-demo.invalid', 'Yasmin Arden', 'Tenant and housing lawyer', 'Most of my work starts with a lease and a question someone was afraid to ask.', true),
  ('6b90a343-2000-4000-8000-000000000011', 'karim@plainspeak-demo.invalid', 'Karim Voss', 'Small business lawyer', 'I review supplier agreements for small shops and freelancers.', true),
  ('6b90a343-2000-4000-8000-000000000012', 'amira@plainspeak-demo.invalid', 'Dr. Amira Bellan', 'Pediatrician', 'I write about the forms families see at clinics and schools.', true),
  ('6b90a343-2000-4000-8000-000000000013', 'jad@plainspeak-demo.invalid', 'Dr. Jad Mercer', 'Physiotherapist', 'I help patients understand referrals, reports, and paperwork between appointments.', false),
  ('6b90a343-2000-4000-8000-000000000014', 'lina@plainspeak-demo.invalid', 'Lina Harrow', 'Payroll accountant', 'Payroll by day. Here for the questions people save until after payday.', true),
  ('6b90a343-2000-4000-8000-000000000015', 'nadim@plainspeak-demo.invalid', 'Nadim Corvin', 'Bookkeeper', 'I work with independent cafés and shops. Invoices are my thing.', false),
  ('6b90a343-2000-4000-8000-000000000016', 'mira@plainspeak-demo.invalid', 'Mira Delaney', 'Data privacy consultant', 'I help small teams make their privacy notices readable.', true),
  ('6b90a343-2000-4000-8000-000000000017', 'tarek@plainspeak-demo.invalid', 'Tarek Wren', 'Human resources consultant', 'I review offer letters and help small teams set up onboarding.', false),
  ('6b90a343-2000-4000-8000-000000000018', 'haneen@plainspeak-demo.invalid', 'Haneen Bristow', 'Housing adviser', 'I help first-time renters read their leases and handover forms.', true),
  ('6b90a343-2000-4000-8000-000000000019', 'zia@plainspeak-demo.invalid', 'Zia Calderon', 'Insurance claims adviser', 'I spend a lot of my time explaining what coverage summaries mean line by line.', false),
  ('6b90a343-2000-4000-8000-000000000020', 'aya@plainspeak-demo.invalid', 'Aya Fenwick', null, 'Moved twice in three years and still read every page of a lease.', false),
  ('6b90a343-2000-4000-8000-000000000021', 'moh@plainspeak-demo.invalid', 'Moh Valeen', null, 'Freelance designer. I started reading contract fine print after a confusing project handover.', false),
  ('6b90a343-2000-4000-8000-000000000022', 'sara@plainspeak-demo.invalid', 'Sara Noren', null, 'I work in retail and usually have a payslip question by the end of the month.', false),
  ('6b90a343-2000-4000-8000-000000000023', 'bilal@plainspeak-demo.invalid', 'Bilal Aven', null, 'IT student. I pay more attention to what apps ask for than I used to.', false),
  ('6b90a343-2000-4000-8000-000000000024', 'jana@plainspeak-demo.invalid', 'Jana Varen', null, 'I run a small online shop and am slowly learning how to read supplier quotes.', false),
  ('6b90a343-2000-4000-8000-000000000025', 'rami@plainspeak-demo.invalid', 'Rami Kade', null, 'I read along and save useful explanations for later.', false),
  ('6b90a343-2000-4000-8000-000000000026', 'nour@plainspeak-demo.invalid', 'Nour Carven', null, 'New here. I found PlainSpeak while comparing two rental agreements.', false),
  ('6b90a343-2000-4000-8000-000000000027', 'salma@plainspeak-demo.invalid', 'Salma Westin', null, 'I make notes whenever a form uses a word I wouldn''t use in conversation.', false);

insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
select id, 'authenticated', 'authenticated', email,
  '{}'::jsonb, jsonb_build_object('username', username), now(), now()
from plainspeak_demo_authors
on conflict (id) do nothing;

insert into public.profiles (id, username, bio, subscription_tier, is_pro, is_verified)
select a.id, a.username, a.bio, 'free', a.is_pro, a.is_pro
from plainspeak_demo_authors a
join auth.users u on u.id = a.id and u.email = a.email
on conflict (id) do update
set bio = excluded.bio, is_pro = excluded.is_pro, is_verified = excluded.is_verified
where public.profiles.bio = '';

insert into public.professionals (id, name, specialty, is_demo, is_verified, bio)
select id, username, specialty, true, is_pro, bio
from plainspeak_demo_authors
where specialty is not null
on conflict (id) do nothing;

with demo_terms (id, author, jargon, translation, analogy, category, sponsored, age_minutes) as (
  values
    ('7bc1d2e4-3000-4000-8000-000000000001', 'leila', 'Early termination fee', 'A charge an agreement says may apply if it ends before the agreed date.', 'A service plan lists a charge for cancelling before month twelve.', 'Contracts', true, 0),
    ('7bc1d2e4-3000-4000-8000-000000000002', 'nora', 'Authorization to release records', 'A form giving permission to share specified records with a named recipient.', 'A clinic form identifies which records may be sent to a specialist.', 'Privacy', true, 0),
    ('7bc1d2e4-3000-4000-8000-000000000003', 'reem', 'Payment terms', 'The part of an agreement that explains when and how payment is due.', 'An invoice says payment is due within 30 days.', 'Contracts', true, 0),
    ('7bc1d2e4-3000-4000-8000-000000000004', 'omar', 'Confidentiality clause', 'A section explaining which information must be kept private and under what conditions.', 'A workplace agreement identifies which internal documents must stay private.', 'Employment', false, 8),
    ('7bc1d2e4-3000-4000-8000-000000000005', 'adam', 'Itemized treatment estimate', 'A list of proposed procedures with a separate estimated price for each one.', 'An estimate lists the exam, X-rays, and cleaning as separate items.', 'Contracts', false, 14),
    ('7bc1d2e4-3000-4000-8000-000000000006', 'sami', 'Record retention policy', 'A policy describing how long different records are kept and what happens afterward.', 'A business keeps invoices for the period listed in its policy.', 'Privacy', false, 20),
    ('7bc1d2e4-3000-4000-8000-000000000007', 'dana', 'Move-in inspection', 'A record of a rental home’s condition at the start of a tenancy.', 'The tenant and landlord write down an existing scratch on a door.', 'Housing', false, 25),
    ('7bc1d2e4-3000-4000-8000-000000000008', 'yousef', 'Gross pay', 'Pay before deductions such as taxes or employee contributions.', 'A payslip lists gross pay and the amount deposited after deductions.', 'Employment', false, 32),
    ('7bc1d2e4-3000-4000-8000-000000000009', 'maya', 'Location permission', 'An app setting that controls whether and when the app can access your location.', 'A maps app asks to see your location only while you use it.', 'Privacy', false, 38),
    ('7bc1d2e4-3000-4000-8000-000000000010', 'leila', 'Amendment', 'A written change to part of an existing agreement.', 'Both parties sign a page that changes the delivery date.', 'Contracts', false, 48),
    ('7bc1d2e4-3000-4000-8000-000000000011', 'dana', 'Utility charges', 'Charges for services such as water, electricity, or gas.', 'A rental agreement says which bills are included in the rent.', 'Housing', false, 54),
    ('7bc1d2e4-3000-4000-8000-000000000012', 'reem', 'Reimbursement', 'Money paid back for an expense someone already covered.', 'An employee submits a receipt for an approved work trip.', 'Employment', false, 60),
    ('7bc1d2e4-3000-4000-8000-000000000013', 'yasmin', 'Joint and several liability', 'A clause that can make each person named on the lease responsible for the full amount owed, depending on its terms.', 'One roommate moves out early. The landlord asks the other roommate for the full rent under this clause.', 'Housing', true, 0),
    ('7bc1d2e4-3000-4000-8000-000000000014', 'lina', 'Year-to-date earnings', 'The total earnings counted from the start of the year through the current pay period.', 'My October payslip shows what I earned since January next to what I earned this month.', 'Employment', true, 0),
    ('7bc1d2e4-3000-4000-8000-000000000015', 'mira', 'Third-party data sharing', 'When an organization sends information about you to another organization or service.', 'A booking app sends a name and reservation number to the company operating the venue.', 'Privacy', true, 0),
    ('7bc1d2e4-3000-4000-8000-000000000016', 'moh', 'Scope of work', 'The part of a project agreement that lists the work and deliverables the price covers.', 'My quote includes a logo and two revisions. A social media kit would need its own line.', 'Contracts', false, 37),
    ('7bc1d2e4-3000-4000-8000-000000000017', 'aya', 'Inventory condition report', 'A list of items in a rental and the condition they are in at handover.', 'I noted that the oven light was already broken before I moved my boxes in.', 'Housing', false, 52),
    ('7bc1d2e4-3000-4000-8000-000000000018', 'sara', 'Pay period', 'The date range covered by a particular payslip.', 'My deposit came in on Friday, but the slip covers the two weeks ending the Sunday before.', 'Employment', false, 81),
    ('7bc1d2e4-3000-4000-8000-000000000019', 'bilal', 'Analytics cookies', 'Small browser files used to track how people use a website.', 'A shop counts how many visitors reach checkout and where people leave the site.', 'Privacy', false, 128),
    ('7bc1d2e4-3000-4000-8000-000000000020', 'jana', 'Minimum order quantity', 'The smallest quantity a supplier agrees to sell in one order.', 'The supplier quotes a price per mug, with a minimum order of 24 mugs.', 'Contracts', false, 170),
    ('7bc1d2e4-3000-4000-8000-000000000021', 'amira', 'Authorized pickup list', 'A school or clinic form that records which people have permission to pick up a child.', 'A parent adds a grandparent to the school list before going on a work trip.', 'Privacy', false, 240),
    ('7bc1d2e4-3000-4000-8000-000000000022', 'tarek', 'Conditional job offer', 'An offer that depends on one or more listed requirements being met.', 'An offer letter says the employer is waiting for two references before confirming the appointment.', 'Employment', false, 340),
    ('7bc1d2e4-3000-4000-8000-000000000023', 'nadim', 'Credit note', 'A document that reduces the amount owed on an invoice or records credit on an account.', 'A supplier sends a credit note after two damaged items are returned.', 'Contracts', false, 480),
    ('7bc1d2e4-3000-4000-8000-000000000024', 'haneen', 'Rent review date', 'A date when the rent can be reviewed under the agreement.', 'The lease lists July as the first date for a review and explains how the tenant will be told.', 'Housing', false, 610),
    ('7bc1d2e4-3000-4000-8000-000000000025', 'jad', 'Consent to share a referral', 'Permission for a healthcare provider to send referral details to another provider involved in your care.', 'My clinic asks which report can be shared with the physiotherapy office.', 'Privacy', false, 790),
    ('7bc1d2e4-3000-4000-8000-000000000026', 'zia', 'Deductible', 'The amount the policyholder may have to pay toward a covered claim before the insurer pays its share.', 'The policy lists a deductible for accidental damage, so the policyholder pays that portion of the repair bill.', 'Contracts', false, 900),
    ('7bc1d2e4-3000-4000-8000-000000000027', 'karim', 'Purchase order', 'A buyer''s written order identifying what it wants to buy and the terms it is requesting.', 'The shop sends a numbered order showing 30 chairs and the agreed delivery address.', 'Contracts', false, 1050),
    ('7bc1d2e4-3000-4000-8000-000000000028', 'salma', 'Privacy notice', 'A document that explains what an organization collects, why it uses it, and who may receive it.', 'A newsletter explains which data it saves when you sign up and how you can request its removal.', 'Privacy', false, 1260),
    ('7bc1d2e4-3000-4000-8000-000000000029', 'dana', 'Meter reading at move-in', 'A record of what a utility meter displayed when a new tenancy started.', 'I photographed the electricity meter on key collection day so I had the starting number.', 'Housing', false, 1510),
    ('7bc1d2e4-3000-4000-8000-000000000030', 'omar', 'Garden leave', 'A period during notice when an employee stays employed but is asked to stop doing some or all of their usual work.', 'An employee stops working with clients while waiting for their listed end date.', 'Employment', false, 1610),
    ('7bc1d2e4-3000-4000-8000-000000000031', 'adam', 'Pre-treatment estimate', 'A written estimate for proposed treatment that can help you compare expected charges before deciding.', 'A clinic lists the expected price of a crown and separates the lab fee from the appointment fee.', 'Contracts', false, 1780),
    ('7bc1d2e4-3000-4000-8000-000000000032', 'reem', 'Due date versus invoice date', 'The invoice date records when the bill was issued. The due date tells you when payment is expected.', 'An invoice is issued on March 3 and lists April 2 as the payment deadline.', 'Contracts', false, 1880),
    ('7bc1d2e4-3000-4000-8000-000000000033', 'yasmin', 'Quiet enjoyment', 'A lease term about a tenant''s ability to use their home without unreasonable interference.', 'The lease explains how visits for inspections are arranged while the tenant is living there.', 'Housing', false, 2050),
    ('7bc1d2e4-3000-4000-8000-000000000034', 'mira', 'Access request', 'A request asking an organization for access to the personal information it holds about you.', 'A former customer asks a subscription service for a copy of the information on their account.', 'Privacy', false, 2280),
    ('7bc1d2e4-3000-4000-8000-000000000035', 'lina', 'Net pay', 'The amount left after payroll deductions, usually the amount paid to you.', 'I compare the net pay line on the slip with the deposit in my bank app.', 'Employment', false, 2490),
    ('7bc1d2e4-3000-4000-8000-000000000036', 'tarek', 'Working hours clause', 'The part of an employment agreement that states expected working hours and may describe how scheduling changes are handled.', 'An offer lists 40 hours per week and says where to check the shift schedule.', 'Employment', false, 2630),
    ('7bc1d2e4-3000-4000-8000-000000000037', 'haneen', 'Break clause', 'A lease provision that describes when and how a party can end a fixed term early.', 'The lease says the tenant can give written notice after month six if the listed conditions are met.', 'Housing', false, 2880),
    ('7bc1d2e4-3000-4000-8000-000000000038', 'bilal', 'Two-factor authentication', 'A sign-in check that uses two different types of evidence to confirm the account holder.', 'I enter my password and approve the sign-in in a separate authenticator app.', 'Privacy', false, 3210),
    ('7bc1d2e4-3000-4000-8000-000000000039', 'sami', 'Supporting documents', 'Records that help show what a financial entry or claim refers to.', 'A shop keeps the supplier invoice and proof of payment together for one purchase.', 'Contracts', false, 3450),
    ('7bc1d2e4-3000-4000-8000-000000000040', 'karim', 'Acceptance criteria', 'Standards or checks used to decide whether a delivery meets the agreed requirements.', 'A website project says the contact form must send a test message before handover is approved.', 'Contracts', false, 3830),
    ('7bc1d2e4-3000-4000-8000-000000000041', 'aya', 'Key handover', 'The point when access keys are given to or returned by the tenant, sometimes recorded in writing.', 'I signed for two door keys and a building tag when I moved in.', 'Housing', false, 4200),
    ('7bc1d2e4-3000-4000-8000-000000000042', 'moh', 'Revision allowance', 'The number or type of changes included in a project quote.', 'Two rounds of edits are included. A third round is quoted as extra work.', 'Contracts', false, 4780),
    ('7bc1d2e4-3000-4000-8000-000000000043', 'sara', 'Overtime line on a payslip', 'A line showing pay recorded for overtime in that pay period, where the employer lists it separately.', 'I compared the overtime hours on my slip with the extra Saturday shift on my timesheet.', 'Employment', false, 5220),
    ('7bc1d2e4-3000-4000-8000-000000000044', 'maya', 'Optional marketing consent', 'Permission to send promotional communications that can be offered separately from some account settings.', 'I made an account and left the newsletter checkbox empty.', 'Privacy', false, 5840),
    ('7bc1d2e4-3000-4000-8000-000000000045', 'jana', 'Estimated delivery window', 'The range of dates a seller expects an order to arrive.', 'The supplier gave me Tuesday through Thursday as the expected arrival window.', 'Contracts', false, 6120),
    ('7bc1d2e4-3000-4000-8000-000000000046', 'zia', 'Coverage limit', 'The maximum amount the policy says it will pay for a specified type of claim or benefit.', 'An insurance summary lists a separate limit for luggage claims.', 'Contracts', false, 6780),
    ('7bc1d2e4-3000-4000-8000-000000000047', 'leila', 'Order of precedence', 'A clause saying which document takes priority if parts of an agreement conflict.', 'The signed order form and the supplier terms give different dates, so I check which one takes priority.', 'Contracts', false, 7350),
    ('7bc1d2e4-3000-4000-8000-000000000048', 'nora', 'Emergency contact', 'Someone an organization may contact in an urgent situation, as described on the form.', 'I listed my sister as the contact to call if the clinic needs to reach someone quickly.', 'Privacy', false, 8010),
    ('7bc1d2e4-3000-4000-8000-000000000049', 'yousef', 'Timesheet approval', 'The process of checking and confirming the hours someone recorded for work.', 'My supervisor approves Monday''s timesheet before payroll processes it.', 'Employment', false, 8870),
    ('7bc1d2e4-3000-4000-8000-000000000050', 'salma', 'Data correction request', 'A request asking an organization to fix inaccurate information it holds about you.', 'I ask the service to update a surname it spelled incorrectly on my account.', 'Privacy', false, 9250),
    ('7bc1d2e4-3000-4000-8000-000000000051', 'nadim', 'Invoice reference', 'A number or short label used to match a bill with the related order or payment.', 'I put the invoice number in the payment reference so the supplier can match the transfer.', 'Contracts', false, 10020),
    ('7bc1d2e4-3000-4000-8000-000000000052', 'haneen', 'Shared area rules', 'A set of building rules covering common spaces used by multiple residents.', 'The building rules say where bicycles can be stored and when the laundry room closes.', 'Housing', false, 10450),
    ('7bc1d2e4-3000-4000-8000-000000000053', 'amira', 'School photo consent', 'A form that asks whether a school can take or use a student''s photo for listed purposes.', 'A family agrees to a class photo kept inside the school and declines use on social media.', 'Privacy', false, 11120),
    ('7bc1d2e4-3000-4000-8000-000000000054', 'jad', 'Return-to-work note', 'A document that records when someone can resume working and may describe any restrictions.', 'The note says the person can return Monday with a temporary lifting restriction.', 'Employment', false, 11900)
)
insert into public.terms (id, user_id, jargon, translation, analogy, category, created_at, sponsored, is_demo)
select t.id::uuid, p.id, t.jargon, t.translation, t.analogy, t.category,
  now() - t.age_minutes * interval '1 minute', t.sponsored, true
from demo_terms t
join plainspeak_demo_authors a on a.email = t.author || '@plainspeak-demo.invalid'
join auth.users u on u.id = a.id and u.email = a.email
join public.profiles p on p.id = u.id
on conflict (id) do nothing;

select
  (select count(*) from public.profiles p join plainspeak_demo_authors a using (id)) as demo_profiles,
  (select count(*) from public.professionals p join plainspeak_demo_authors a using (id)) as demo_professionals,
  (select count(*) from public.terms where id between
    '7bc1d2e4-3000-4000-8000-000000000001' and '7bc1d2e4-3000-4000-8000-000000000054') as demo_posts;

commit;
