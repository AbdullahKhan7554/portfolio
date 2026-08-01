-- Seed: Avenix Studio package catalog, migrated verbatim from the retired
-- `avenixPackages` literal in src/lib/nova/sales/packageConfig.js. Idempotent:
-- delete-then-insert scoped to company_id='avenix' so re-running is byte-stable.

delete from public.sales_packages where company_id = 'avenix';

insert into public.sales_packages
  (company_id, package_id, name, short_description, target_audience,
   recommended_for, features, starting_price, currency, cta, display_order, industry, is_active)
values
  ('avenix', 'launch', 'Launch',
   'High-converting single-page presence.',
   'Startups, single offers & MVP landing pages',
   array['website','branding','general'],
   array['One conversion-focused page','Copy guidance & structure','Lead form + WhatsApp click-to-chat','On-page technical SEO','Core Web Vitals tuned'],
   300, 'USD', 'Start a Launch project', 1, 'agency', true),

  ('avenix', 'business', 'Business Website',
   'The complete brand & lead engine.',
   'Clinics, gyms, salons & growing businesses',
   array['website','seo','branding'],
   array['5–7 page Next.js website','On-page + local technical SEO','Gallery, reviews & social proof','WhatsApp booking + Maps','Analytics & conversion tracking'],
   700, 'USD', 'Build my website', 2, 'agency', true),

  ('avenix', 'ecommerce', 'E-commerce Store',
   'A fast, conversion-focused storefront.',
   'Retailers & product brands',
   array['ecommerce'],
   array['Product catalog & cart','Secure checkout & payments','Inventory-ready structure','Performance & SEO'],
   1200, 'USD', 'Plan my store', 3, 'agency', true),

  ('avenix', 'app', 'Web Application',
   'Custom MERN / Next.js apps & automations.',
   'Products, portals & internal tools',
   array['automation','website'],
   array['Auth, dashboards & integrations','API & database design','Security & performance hardening'],
   null, 'USD', 'Scope my app', 4, 'agency', true),

  ('avenix', 'seo', 'SEO & Growth',
   'Rank higher and grow organic traffic.',
   'Sites that need visibility',
   array['seo'],
   array['Technical SEO audit','On-page + local SEO','Content structure & Core Web Vitals'],
   null, 'USD', 'Improve my SEO', 5, 'agency', true),

  ('avenix', 'consultation', 'Strategy Consultation',
   'A focused call to map your next step.',
   'Anyone exploring options',
   array['consultation','support','pricing','general'],
   array['30-minute discovery call','Honest recommendation','Fixed quote before work begins'],
   0, 'USD', 'Book a call', 6, 'agency', true);
