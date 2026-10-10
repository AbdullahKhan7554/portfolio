import { siteConfig, organizationSchemaData } from '@/config/site';
import { services } from '@/data/services';
import {
  founderBio,
  founderEducation,
  founderKnowsAbout,
  founderProfiles,
} from '@/content/founder';

/**
 * Stable entity ids. The Organization and its founder reference each other by
 * these instead of restating each other inline, so every block on every page
 * resolves to ONE studio and ONE founder rather than near-duplicates with
 * drifting fields (the inline founder used to say "Founder & Lead Developer"
 * while the Person node said "Founder & Full-Stack Developer").
 */
export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const FOUNDER_ID = `${siteConfig.url}/founder#person`;
export const FOUNDER_ROLE = 'Founder & Full-Stack Developer';
export const FOUNDER_IMAGE = '/images/abdullah-khan.webp';

/** JSON-LD: Organization (the Avenix Studio brand). Injected site-wide. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: organizationSchemaData.name,
    // The domain is avenixstudios.com, so the plural is how the brand is
    // commonly typed. Declared as an alias, not used as the name.
    alternateName: 'Avenix Studios',
    legalName: organizationSchemaData.legalName,
    url: organizationSchemaData.url,
    logo: {
      '@type': 'ImageObject',
      url: organizationSchemaData.logo,
    },
    image: organizationSchemaData.logo,
    description: siteConfig.seo.description,
    email: organizationSchemaData.email,
    telephone: siteConfig.contact.phone,
    foundingDate: organizationSchemaData.foundingDate,
    founder: { '@type': 'Person', '@id': FOUNDER_ID, name: siteConfig.brand.founder },
    // sameAs: official social profiles (Instagram, Facebook, LinkedIn, GitHub, X).
    sameAs: organizationSchemaData.sameAs,
    areaServed: organizationSchemaData.areaServed,
    address: {
      '@type': 'PostalAddress',
      addressLocality: organizationSchemaData.address.locality,
      addressRegion: organizationSchemaData.address.region,
      addressCountry: organizationSchemaData.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: organizationSchemaData.email,
      telephone: siteConfig.contact.phone,
      areaServed: organizationSchemaData.areaServed,
      availableLanguage: ['English'],
    },
  };
}

/**
 * The founder Person node. Emitted in full exactly ONCE per page — site-wide,
 * via personSchema() in layout.js. Everything else (ProfilePage.mainEntity,
 * Organization.founder) points at it by @id rather than repeating its fields,
 * so /founder does not carry two copies of affiliation, sameAs, etc.
 *
 * Every value comes from src/content/founder.js and is visible on /founder.
 * `sameAs` is PERSONAL profiles only: the LinkedIn, Instagram and Facebook in
 * client.config.js are the studio's company profiles and belong on the
 * Organization, not the Person.
 *
 * `affiliation`, not `alumniOf`: the founder is a current student.
 */
function founderNode() {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: siteConfig.brand.founder,
    jobTitle: FOUNDER_ROLE,
    description: founderBio,
    image: `${siteConfig.url}${FOUNDER_IMAGE}`,
    url: `${siteConfig.url}/founder`,
    worksFor: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: siteConfig.brand.name },
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: founderEducation.institution,
      alternateName: founderEducation.institutionFullName,
    },
    knowsAbout: founderKnowsAbout,
    address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressCountry: 'PK' },
    sameAs: founderProfiles.map((p) => p.href),
  };
}

/** JSON-LD: Person (Abdullah Khan, the founder). Injected site-wide. */
export function personSchema() {
  return { '@context': 'https://schema.org', ...founderNode() };
}

/** JSON-LD: ProfilePage (for /founder), with the founder as its main entity. */
export function profilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${siteConfig.url}/founder`,
    name: `${siteConfig.brand.founder} — ${FOUNDER_ROLE}, ${siteConfig.brand.name}`,
    // Reference only — the full Person is already on this page from layout.js.
    mainEntity: { '@type': 'Person', '@id': FOUNDER_ID },
  };
}

/** JSON-LD: ProfessionalService (the studio as a discoverable service business). */
export function professionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.brand.name,
    url: siteConfig.url,
    image: siteConfig.seo.ogImage.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.seo.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    priceRange: '$$',
    /**
     * The local signal. `ProfessionalService` is a subtype of `LocalBusiness`,
     * so this block IS the studio's local-business entity — there is
     * deliberately no second LocalBusiness node, because emitting one on the
     * same URL would describe the same organisation twice and leave a consumer
     * to guess which is authoritative.
     *
     * City and Country are named explicitly rather than left at the previous
     * bare 'Worldwide', which said nothing about where the business actually
     * is. 'Worldwide' is RETAINED alongside them because it is also true and is
     * what the footer and `organizationSchemaData` already claim.
     *
     * NO `geo` AND NO `streetAddress`. Neither is in client.config.js, and a
     * fabricated coordinate or street on a local-business entity is exactly the
     * kind of claim that gets a listing distrusted. Locality-level only until
     * real values are supplied.
     */
    areaServed: [
      { '@type': 'City', name: siteConfig.contact.address.locality },
      { '@type': 'Country', name: 'Pakistan' },
      'Worldwide',
    ],
    founder: { '@type': 'Person', '@id': FOUNDER_ID, name: siteConfig.brand.founder },
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.contact.address.locality,
      addressRegion: siteConfig.contact.address.region,
      addressCountry: siteConfig.contact.address.country,
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    knowsAbout: siteConfig.seo.keywords,
    // Mirrors the four dedicated service routes plus the existing build
    // capabilities. Every entry maps to a real service in src/data/services.js
    // — nothing is listed here that the studio does not sell.
    // Expressed as `makesOffer` → Service, not `serviceType`: schema.org defines
    // `serviceType` on Service only, so on ProfessionalService it failed
    // validation.
    makesOffer: [
      'Software Development',
      'Web Development',
      'Next.js Development',
      'Mobile App Development',
      'AI Automation',
      'AI Agents',
      'Search Engine Optimization',
      'Technical SEO',
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  };
}

/**
 * JSON-LD: a single `Service` offering, for the dedicated service routes.
 *
 * The provider is stated as the Organization rather than repeated in full: the
 * Organization node is already injected site-wide from app/layout.js, so this
 * references that entity by name and url instead of describing it a second
 * time.
 *
 * `areaServed` defaults to Pakistan + Worldwide — the market the service pages
 * target, and the one the studio genuinely serves. Callers may override it.
 *
 * @param {Object} opts
 * @param {string} opts.name
 * @param {string} opts.description
 * @param {string} opts.path            route path, e.g. '/services/seo'
 * @param {string[]} [opts.serviceType] defaults to [name]
 * @param {any[]} [opts.areaServed]
 */
export function serviceSchema({ name, description, path, serviceType, areaServed }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: serviceType?.length ? serviceType : [name],
    url: `${siteConfig.url}${path}`,
    provider: {
      '@type': 'Organization',
      name: siteConfig.brand.name,
      url: siteConfig.url,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.contact.address.locality,
        addressRegion: siteConfig.contact.address.region,
        addressCountry: siteConfig.contact.address.country,
      },
    },
    /*
     * City first, then country, then Worldwide. The city is NOT an invented
     * local signal: it is the same `contact.address.locality` that
     * professionalServiceSchema() already declares and that the PostalAddress
     * on `provider` above carries, so Service and ProfessionalService agree
     * instead of one claiming a narrower service area than the other.
     */
    areaServed: areaServed?.length
      ? areaServed
      : [
          { '@type': 'City', name: siteConfig.contact.address.locality },
          { '@type': 'Country', name: 'Pakistan' },
          'Worldwide',
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
    // No `position`: it is not an Offer property (schema.org defines it on
    // ListItem/CreativeWork), and array order already carries the sequence.
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
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
