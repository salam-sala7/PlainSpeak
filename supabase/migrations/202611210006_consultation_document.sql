begin;

alter table public.consultations
  add column document_name text,
  add column document_pdf bytea,
  add constraint consultations_pdf_document check (
    (document_name is null and document_pdf is null)
    or (
      document_name is not null and document_pdf is not null
      and char_length(document_name) between 1 and 255
      and lower(right(document_name, 4)) = '.pdf'
      and octet_length(document_pdf) between 5 and 1048576
      and substring(document_pdf from 1 for 5) = decode('255044462d', 'hex')
    )
  );

grant insert (document_name, document_pdf) on public.consultations to authenticated;

commit;
