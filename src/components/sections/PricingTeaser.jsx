/**
 * Pricing teaser — SLOT RESERVED.
 *
 * Renders an anchor target only. The real teaser (tier cards, `priceFrom`
 * values, CTA) and its data source (`src/content/pricing.js`) are built in a
 * dedicated later phase; the component is wired into the homepage now so the
 * section order is final and does not need re-shuffling later.
 *
 * Takes eyebrow "07 — Pricing" when it ships, at which point FAQ and Contact
 * renumber to 08 and 09.
 */
export function PricingTeaser() {
  return <section id="pricing" className="scroll-mt-24" aria-hidden="true" />;
}
