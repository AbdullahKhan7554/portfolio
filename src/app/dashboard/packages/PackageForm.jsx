'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPackageAction, updatePackageAction } from './actions';

const field =
  'w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]';
const label = 'block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]';
const BACK = '/dashboard/packages';

const toLines = (arr) => (Array.isArray(arr) ? arr.join('\n') : arr || '');
const toCsv = (arr) => (Array.isArray(arr) ? arr.join(', ') : arr || '');

export function PackageForm({ mode, id, initial = {} }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [packageId, setPackageId] = useState(initial.package_id || '');
  const [name, setName] = useState(initial.name || '');
  const [shortDescription, setShortDescription] = useState(initial.short_description || '');
  const [targetAudience, setTargetAudience] = useState(initial.target_audience || '');
  const [recommendedFor, setRecommendedFor] = useState(toCsv(initial.recommended_for));
  const [features, setFeatures] = useState(toLines(initial.features));
  const [startingPrice, setStartingPrice] = useState(
    initial.starting_price == null ? '' : String(initial.starting_price),
  );
  const [currency, setCurrency] = useState(initial.currency || 'USD');
  const [cta, setCta] = useState(initial.cta || '');
  const [displayOrder, setDisplayOrder] = useState(String(initial.display_order ?? 0));
  const [industry, setIndustry] = useState(initial.industry || '');
  const [isActive, setIsActive] = useState(initial.is_active ?? true);

  function onSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = {
      packageId,
      name,
      shortDescription,
      targetAudience,
      recommendedFor,
      features,
      startingPrice: startingPrice === '' ? null : Number(startingPrice),
      currency,
      cta,
      displayOrder: Number(displayOrder),
      industry,
      isActive,
    };
    startTransition(async () => {
      const res =
        mode === 'edit'
          ? await updatePackageAction(id, payload)
          : await createPackageAction(payload);
      if (res?.ok) router.push(BACK);
      else setError(res?.error || 'Save failed');
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="package_id">Package ID</label>
          <input
            id="package_id"
            className={`${field} mt-1`}
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            placeholder="e.g. launch"
            maxLength={64}
            disabled={mode === 'edit'}
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">Stable slug (lowercase, hyphens). Fixed after creation.</p>
        </div>
        <div>
          <label className={label} htmlFor="name">Name</label>
          <input
            id="name"
            className={`${field} mt-1`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={200}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="short_description">Short description</label>
        <input
          id="short_description"
          className={`${field} mt-1`}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
      </div>

      <div>
        <label className={label} htmlFor="target_audience">Target audience</label>
        <input
          id="target_audience"
          className={`${field} mt-1`}
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        />
      </div>

      <div>
        <label className={label} htmlFor="recommended_for">Recommended for</label>
        <input
          id="recommended_for"
          className={`${field} mt-1`}
          value={recommendedFor}
          onChange={(e) => setRecommendedFor(e.target.value)}
          placeholder="Comma-separated match tokens, e.g. website, seo, branding"
        />
        <p className="mt-1 text-xs text-[var(--text-muted)]">Generic intent/audience tags the recommender scores against (never the package name).</p>
      </div>

      <div>
        <label className={label} htmlFor="features">Features</label>
        <textarea
          id="features"
          rows={6}
          className={`${field} mt-1`}
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="One feature per line"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="starting_price">Starting price</label>
          <input
            id="starting_price"
            type="number"
            className={`${field} mt-1`}
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="Blank = not shown"
          />
        </div>
        <div>
          <label className={label} htmlFor="currency">Currency</label>
          <input
            id="currency"
            className={`${field} mt-1`}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            maxLength={8}
          />
        </div>
        <div>
          <label className={label} htmlFor="display_order">Display order</label>
          <input
            id="display_order"
            type="number"
            className={`${field} mt-1`}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="cta">Call to action</label>
          <input
            id="cta"
            className={`${field} mt-1`}
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="e.g. Book a call"
          />
        </div>
        <div>
          <label className={label} htmlFor="industry">Industry</label>
          <input
            id="industry"
            className={`${field} mt-1`}
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Optional, e.g. agency"
          />
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-[var(--text)]">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Active (offered by Nova&apos;s recommender)
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[var(--radius-md)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {pending ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => router.push(BACK)}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--border-strong)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
