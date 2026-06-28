import { siteConfig, organizationSchemaData } from '@/config/site';

/** JSON-LD: Organization (the Avenix Studio brand). */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organizationSchemaData.name,
    legalName: organizationSchemaData.legalName,
    url: organizationSchemaData.url,
    logo: organizationSchemaData.logo,
    email: organizationSchemaData.email,
    foundingDate: organizationSchemaData.foundingDate,
    founder: {
      '@type': 'Person',
      name: organizationSchemaData.founder.name,
      jobTitle: organizationSchemaData.founder.jobTitle,
    },
    sameAs: organizationSchemaData.sameAs,
    areaServed: organizationSchemaData.areaServed,
    address: {
      '@type': 'PostalAddress',
      addressLocality: organizationSchemaData.address.locality,
      addressRegion: organizationSchemaData.address.region,
      addressCountry: organizationSchemaData.address.country,
    },
  };
}

/** JSON-LD: Person (Abdullah Khan, the founder/developer). */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.brand.founder,
    jobTitle: 'Founder & Full-Stack Developer',
    worksFor: { '@type': 'Organization', name: siteConfig.brand.name },
    url: siteConfig.url,
    email: siteConfig.contact.email,
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    knowsAbout: siteConfig.seo.keywords,
  };
}

/** JSON-LD: WebSite (enables sitelinks search box potential). */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.brand.name,
    url: siteConfig.url,
    inLanguage: 'en',
  };
}

/** JSON-LD: BreadcrumbList from an array of { name, path }. */
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

/** JSON-LD: FAQPage from an array of { question, answer }. */
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Tiny helper component-friendly serializer. */
export function jsonLd(schema) {
  return { __html: JSON.stringify(schema) };
}
