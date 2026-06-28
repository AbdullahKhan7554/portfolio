import { siteConfig, organizationSchemaData } from '@/config/site';
import { services } from '@/content/services';

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

/** JSON-LD: ProfessionalService (the studio as a discoverable service business). */
export function professionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.brand.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/opengraph-image`,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.seo.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    priceRange: '$$',
    areaServed: 'Worldwide',
    founder: { '@type': 'Person', name: siteConfig.brand.founder },
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.contact.address.locality,
      addressRegion: siteConfig.contact.address.region,
      addressCountry: siteConfig.contact.address.country,
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    knowsAbout: siteConfig.seo.keywords,
    serviceType: [
      'Web Development',
      'Next.js Development',
      'MERN Stack Development',
      'Technical SEO',
      'AI Automation',
    ],
  };
}

/** JSON-LD: OfferCatalog of the studio's services (for /services). */
export function servicesSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: `${siteConfig.brand.name} Services`,
    url: `${siteConfig.url}/services`,
    itemListElement: services.map((s, i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: {
        '@type': 'Service',
        name: s.name,
        description: s.tagline,
        provider: { '@type': 'Organization', name: siteConfig.brand.name },
        areaServed: 'Worldwide',
      },
    })),
  };
}

/** JSON-LD: ContactPage (for /contact). */
export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${siteConfig.brand.name}`,
    url: `${siteConfig.url}/contact`,
    description: `Get in touch with ${siteConfig.brand.name} — ${siteConfig.brand.founder}.`,
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.brand.name,
      url: siteConfig.url,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        areaServed: 'Worldwide',
        availableLanguage: ['English'],
      },
    },
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
