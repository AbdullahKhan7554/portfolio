-- Nova — security fix: make `email_templates` service-role-only, matching every
-- other Nova table.
--
-- Drops the `email_templates_read` policy created in 20260802_06, which granted
-- `anon` + `authenticated` SELECT of active rows — meaning template subject/
-- html_body were publicly readable via the anon key. This was a divergence, not
-- deliberate design: no client-side/anon code path reads this table. The only
-- reader is the server-side email service (src/lib/nova/email/templateRepository.js
-- via emailService.js), which uses the service-role key and bypasses RLS.
--
-- After this runs, RLS stays ENABLED with NO policies = service-role-only, exactly
-- like leads / conversations / knowledge_documents / faqs / sales_packages.

drop policy if exists email_templates_read on public.email_templates;
