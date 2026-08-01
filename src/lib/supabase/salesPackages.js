import 'server-only';
import { createAdminClient } from './admin';
import { novaConfig } from '@/config/nova.config';
import { createCompanyPackages, createPackageRegistry } from '@/lib/nova/sales/packageConfig';

/**
 * Nova sales-packages write + read layer. Server-only, service-role (bypasses the
 * table's RLS, mirroring src/lib/supabase/knowledgeBase.js). Scoped to the active
 * tenant. Backs both the dashboard CMS and the config-driven package registry the
 * sales engine consumes — replacing the retired hardcoded `avenixPackages` literal.
 */

const COMPANY_ID = novaConfig.companyId;
const TABLE = 'sales_packages';
const COLUMNS =
  'id, company_id, package_id, name, short_description, target_audience, recommended_for, features, starting_price, currency, cta, display_order, industry, is_active, created_at, updated_at';

const clean = (s) => String(s ?? '').trim();

/** Normalize a mixed value (array or delimited string) into a trimmed string[]. */
function toStringArray(value, splitOn = /[\n,]/) {
  const list = Array.isArray(value) ? value : String(value ?? '').split(splitOn);
  return list.map((v) => clean(v)).filter(Boolean);
}

/** null when empty/blank, otherwise a finite number (0 preserved). */
function toNullableNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toInteger(value, fallback = 0) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function validatePackage({ packageId, name }) {
  const p = clean(packageId);
  if (p.length < 1 || p.length > 64) return 'Package ID is required (max 64 characters)';
  if (!/^[a-z0-9-]+$/.test(p)) return 'Package ID may only contain lowercase letters, numbers and hyphens';
  const n = clean(name);
  if (n.length < 1 || n.length > 200) return 'Name is required (max 200 characters)';
  return null;
}

function withSearch(query, term, cols) {
  const safe = term.replace(/[%,()]/g, ' ');
  return query.or(cols.map((c) => `${c}.ilike.%${safe}%`).join(','));
}

/** Map a stored row into the shape `createPackage()` expects (config attributes). */
function toConfigPackage(row) {
  return {
    id: row.package_id,
    name: row.name,
    shortDescription: row.short_description ?? '',
    targetAudience: row.target_audience ?? '',
    recommendedFor: row.recommended_for ?? [],
    features: row.features ?? [],
    startingPrice: row.starting_price == null ? null : Number(row.starting_price),
    currency: row.currency ?? 'USD',
    cta: row.cta ?? 'Learn more',
    displayOrder: row.display_order ?? 0,
    active: row.is_active,
  };
}

/* ── Dashboard CMS: list / get / CRUD ─────────────────────────────────────── */

/** List packages (by display order, then newest), optional active / search filters. */
export async function listPackages({ search = '', activeOnly = false } = {}) {
  const supabase = createAdminClient();
  let query = supabase
    .from(TABLE)
    .select(COLUMNS)
    .eq('company_id', COMPANY_ID)
    .order('display_order', { ascending: true })
    .order('updated_at', { ascending: false });
  if (activeOnly) query = query.eq('is_active', true);
  const term = clean(search);
  if (term) query = withSearch(query, term, ['name', 'package_id', 'short_description', 'target_audience']);
  const { data, error } = await query;
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function getPackage(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('company_id', COMPANY_ID)
    .eq('id', id)
    .maybeSingle();
  if (error) return { entry: null, error: error.message };
  return { entry: data ?? null, error: null };
}

function toRow(payload) {
  return {
    package_id: clean(payload.packageId),
    name: clean(payload.name),
    short_description: clean(payload.shortDescription),
    target_audience: clean(payload.targetAudience),
    recommended_for: toStringArray(payload.recommendedFor, /,/),
    features: toStringArray(payload.features, /\n/),
    starting_price: toNullableNumber(payload.startingPrice),
    currency: clean(payload.currency) || 'USD',
    cta: clean(payload.cta) || 'Learn more',
    display_order: toInteger(payload.displayOrder, 0),
    industry: clean(payload.industry) || null,
    is_active: Boolean(payload.isActive),
  };
}

export async function createPackage(payload) {
  const invalid = validatePackage(payload);
  if (invalid) return { ok: false, error: invalid };
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ company_id: COMPANY_ID, ...toRow(payload), created_at: now, updated_at: now })
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null, id: data?.id };
}

export async function updatePackage(id, payload) {
  const invalid = validatePackage(payload);
  if (invalid) return { ok: false, error: invalid };
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...toRow(payload), updated_at: new Date().toISOString() })
    .eq('company_id', COMPANY_ID)
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Entry not found' };
  return { ok: true, error: null };
}

export async function deletePackage(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from(TABLE).delete().eq('company_id', COMPANY_ID).eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

export async function setPackageActive(id, isActive) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ is_active: Boolean(isActive), updated_at: new Date().toISOString() })
    .eq('company_id', COMPANY_ID)
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Entry not found' };
  return { ok: true, error: null };
}

/* ── Engine loader: DB rows → package registry (same objects as before) ───── */

/**
 * Build the CompanyPackages config for a tenant from active DB rows, in the exact
 * shape `createCompanyPackages()` used to produce from the hardcoded literal.
 * @returns {Promise<{ config: object|null, error: string|null }>}
 */
export async function loadCompanyPackages(companyId = COMPANY_ID) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) return { config: null, error: error.message };
  const rows = data ?? [];
  const config = createCompanyPackages({
    companyId,
    industry: rows[0]?.industry ?? null,
    currency: rows[0]?.currency ?? 'USD',
    packages: rows.map(toConfigPackage),
  });
  return { config, error: null };
}

/**
 * DB-backed replacement for the retired static `packageRegistry`. Resolves a
 * PackageRegistry seeded with the tenant's active packages. Async because the
 * data source is now Supabase; the registry/engine objects are identical.
 * @returns {Promise<{ registry: import('@/lib/nova/sales/packageConfig').PackageRegistry|null, error: string|null }>}
 */
export async function getPackageRegistry(companyId = COMPANY_ID) {
  const { config, error } = await loadCompanyPackages(companyId);
  if (error) return { registry: null, error };
  return { registry: createPackageRegistry([config]), error: null };
}
