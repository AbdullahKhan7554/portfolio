/**
 * Nova Sales — Package Configuration System (CONFIG, not logic).
 *
 * A fully configuration-driven catalog so Nova can recommend packages for ANY
 * company / industry without code changes. Business data lives only in config;
 * the selectors below match packages by generic CONFIG ATTRIBUTES
 * (`recommendedFor`, `displayOrder`, `active`) and NEVER by package name — so
 * the recommendation logic stays company-agnostic.
 *
 * Pure JavaScript. No UI, no APIs, no database, no AI, no persistence.
 *
 * ── Configuration schema ──────────────────────────────────────────────────
 * CompanyPackages:
 *   companyId    string   unique tenant slug
 *   industry     string   one of INDUSTRY (optional)
 *   currency     string   default currency for its packages (e.g. 'USD')
 *   packages     Package[]  unlimited
 *
 * Package:
 *   id                string   unique within the company
 *   name              string   human label (NEVER referenced by the engine)
 *   shortDescription  string
 *   targetAudience    string
 *   recommendedFor    string[] match tokens (intents/audience tags)
 *   features          string[]
 *   startingPrice     number|null   indicative only (no pricing logic here)
 *   currency          string
 *   cta               string
 *   displayOrder      number   ascending sort + deterministic fallback
 *   active            boolean  inactive packages are hidden by default
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Industries the config supports out of the box (extend freely). */
export const INDUSTRY = Object.freeze({
  AGENCY: 'agency',
  RESTAURANT: 'restaurant',
  GYM: 'gym',
  LAW_FIRM: 'law-firm',
  DENTAL_CLINIC: 'dental-clinic',
  REAL_ESTATE: 'real-estate',
  ECOMMERCE: 'ecommerce',
  CONSTRUCTION: 'construction',
});

/* ── helpers (pure) ─────────────────────────────────────────────────────── */

function toArray(value) {
  if (Array.isArray(value)) return value;
  return value == null ? [] : [value];
}

function normalizeTokens(value) {
  return toArray(value)
    .map((v) => String(v).trim().toLowerCase())
    .filter(Boolean);
}

/* ── factories (validate + freeze) ──────────────────────────────────────── */

/**
 * Build one validated, frozen package with safe defaults.
 * @param {Partial<import('./packageConfig').Package>} [input]
 */
export function createPackage(input = {}) {
  if (!input.id) throw new Error('createPackage: `id` is required.');
  if (!input.name) throw new Error(`createPackage: package "${input.id}" requires a name.`);
  return Object.freeze({
    id: String(input.id),
    name: String(input.name),
    shortDescription: input.shortDescription ?? '',
    targetAudience: input.targetAudience ?? '',
    recommendedFor: Object.freeze([...toArray(input.recommendedFor)]),
    features: Object.freeze([...toArray(input.features)]),
    startingPrice: input.startingPrice ?? null,
    currency: input.currency ?? 'USD',
    cta: input.cta ?? 'Learn more',
    displayOrder: Number.isFinite(input.displayOrder) ? input.displayOrder : 0,
    active: input.active !== false,
  });
}

/**
 * Build a company's package config. Applies a default currency to each package
 * and enforces unique package ids.
 * @param {{ companyId:string, industry?:string, currency?:string, packages?:object[] }} input
 */
export function createCompanyPackages({ companyId, industry, currency, packages } = {}) {
  if (!companyId) throw new Error('createCompanyPackages: `companyId` is required.');
  const defaultCurrency = currency ?? 'USD';

  const seen = new Set();
  const built = toArray(packages).map((p) => {
    const pkg = createPackage({ currency: defaultCurrency, ...p });
    if (seen.has(pkg.id)) {
      throw new Error(`createCompanyPackages: duplicate package id "${pkg.id}" for "${companyId}".`);
    }
    seen.add(pkg.id);
    return pkg;
  });

  return Object.freeze({
    companyId: String(companyId),
    industry: industry ?? null,
    currency: defaultCurrency,
    packages: Object.freeze(built),
  });
}

/* ── registry (unlimited companies) ─────────────────────────────────────── */

export class PackageRegistry {
  constructor() {
    /** @type {Map<string, object>} */
    this._map = new Map();
  }

  register(config) {
    const c = createCompanyPackages(config);
    if (this._map.has(c.companyId)) {
      throw new Error(`PackageRegistry: "${c.companyId}" already registered.`);
    }
    this._map.set(c.companyId, c);
    return c;
  }

  upsert(config) {
    const c = createCompanyPackages(config);
    this._map.set(c.companyId, c);
    return c;
  }

  get(companyId) {
    return this._map.get(companyId) ?? null;
  }

  has(companyId) {
    return this._map.has(companyId);
  }

  list() {
    return [...this._map.values()];
  }

  ids() {
    return [...this._map.keys()];
  }
}

/** DI factory: build a registry seeded with company configs. */
export function createPackageRegistry(configs = []) {
  const registry = new PackageRegistry();
  for (const config of configs) registry.register(config);
  return registry;
}

/* ── selectors + name-agnostic recommendation (read config ONLY) ────────── */

/** Active packages, sorted by displayOrder. */
export function getPackages(companyPackages, { includeInactive = false } = {}) {
  const list = companyPackages?.packages ?? [];
  const filtered = includeInactive ? list : list.filter((p) => p.active);
  return [...filtered].sort((a, b) => a.displayOrder - b.displayOrder);
}

/** Look up one package by id (config-driven, not by name). */
export function getPackageById(companyPackages, id) {
  return (companyPackages?.packages ?? []).find((p) => p.id === id) ?? null;
}

/** Overlap score between a package's `recommendedFor` tags and criteria tokens. */
export function scorePackage(pkg, criteria = []) {
  const wants = normalizeTokens(criteria);
  if (wants.length === 0) return 0;
  const tags = new Set(normalizeTokens(pkg.recommendedFor));
  return wants.reduce((n, w) => (tags.has(w) ? n + 1 : n), 0);
}

/**
 * Recommend the best-matching package for a company given generic criteria
 * tokens (e.g. a detected intent + audience tags). The engine only reads
 * `recommendedFor` / `displayOrder` / `active` — it NEVER references names. If
 * nothing matches, the first active package (by displayOrder) is the config-
 * decided default.
 * @returns {object|null}
 */
export function recommendPackage(companyPackages, criteria = [], { includeInactive = false } = {}) {
  const active = getPackages(companyPackages, { includeInactive });
  if (active.length === 0) return null;

  const ranked = active
    .map((pkg) => ({ pkg, score: scorePackage(pkg, criteria) }))
    .sort((a, b) => b.score - a.score || a.pkg.displayOrder - b.pkg.displayOrder);

  return ranked[0].score > 0 ? ranked[0].pkg : active[0];
}

/* ── example configuration: Avenix Studio ───────────────────────────────── */

/**
 * Deliverable example. Pure config/data — no logic. `recommendedFor` tokens
 * align with the sales-engine intents so a future integration can pass a
 * detected intent straight through as criteria.
 */
export const avenixPackages = createCompanyPackages({
  companyId: 'avenix',
  industry: INDUSTRY.AGENCY,
  currency: 'USD',
  packages: [
    {
      id: 'launch',
      name: 'Launch',
      shortDescription: 'High-converting single-page presence.',
      targetAudience: 'Startups, single offers & MVP landing pages',
      recommendedFor: ['website', 'branding', 'general'],
      features: [
        'One conversion-focused page',
        'Copy guidance & structure',
        'Lead form + WhatsApp click-to-chat',
        'On-page technical SEO',
        'Core Web Vitals tuned',
      ],
      startingPrice: 300,
      cta: 'Start a Launch project',
      displayOrder: 1,
      active: true,
    },
    {
      id: 'business',
      name: 'Business Website',
      shortDescription: 'The complete brand & lead engine.',
      targetAudience: 'Clinics, gyms, salons & growing businesses',
      recommendedFor: ['website', 'seo', 'branding'],
      features: [
        '5–7 page Next.js website',
        'On-page + local technical SEO',
        'Gallery, reviews & social proof',
        'WhatsApp booking + Maps',
        'Analytics & conversion tracking',
      ],
      startingPrice: 700,
      cta: 'Build my website',
      displayOrder: 2,
      active: true,
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      shortDescription: 'A fast, conversion-focused storefront.',
      targetAudience: 'Retailers & product brands',
      recommendedFor: ['ecommerce'],
      features: [
        'Product catalog & cart',
        'Secure checkout & payments',
        'Inventory-ready structure',
        'Performance & SEO',
      ],
      startingPrice: 1200,
      cta: 'Plan my store',
      displayOrder: 3,
      active: true,
    },
    {
      id: 'app',
      name: 'Web Application',
      shortDescription: 'Custom MERN / Next.js apps & automations.',
      targetAudience: 'Products, portals & internal tools',
      recommendedFor: ['automation', 'website'],
      features: [
        'Auth, dashboards & integrations',
        'API & database design',
        'Security & performance hardening',
      ],
      startingPrice: null,
      cta: 'Scope my app',
      displayOrder: 4,
      active: true,
    },
    {
      id: 'seo',
      name: 'SEO & Growth',
      shortDescription: 'Rank higher and grow organic traffic.',
      targetAudience: 'Sites that need visibility',
      recommendedFor: ['seo'],
      features: [
        'Technical SEO audit',
        'On-page + local SEO',
        'Content structure & Core Web Vitals',
      ],
      startingPrice: null,
      cta: 'Improve my SEO',
      displayOrder: 5,
      active: true,
    },
    {
      id: 'consultation',
      name: 'Strategy Consultation',
      shortDescription: 'A focused call to map your next step.',
      targetAudience: 'Anyone exploring options',
      recommendedFor: ['consultation', 'support', 'pricing', 'general'],
      features: [
        '30-minute discovery call',
        'Honest recommendation',
        'Fixed quote before work begins',
      ],
      startingPrice: 0,
      cta: 'Book a call',
      displayOrder: 6,
      active: true,
    },
  ],
});

/** Default registry, seeded with the bundled company. Add tenants via register(). */
export const packageRegistry = createPackageRegistry([avenixPackages]);
