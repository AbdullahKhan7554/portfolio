/**
 * Internal-page hero art — the single swap point for the Phase 4A hero system.
 *
 * WHY A REGISTRY RATHER THAN PROPS AT EACH CALL SITE
 * The art direction is not final. Keeping src/alt/focal here means replacing a
 * placeholder with commissioned art is a one-line edit in this file — no page
 * and no component changes. A route mapped to `null` simply renders the existing
 * type-led header, so pages without approved art degrade to exactly what shipped
 * before rather than to a broken image.
 *
 * FOCAL CLASSES ARE LITERAL STRINGS ON PURPOSE.
 * tailwind.config.js scans `./src/**\/*.{js,jsx,mdx}`, which includes this file,
 * so these compile. Building them dynamically (`object-[${x}]`) would not — the
 * scanner never sees the interpolated result. Mobile value first, `md:` second:
 * a wide short band crops an image vertically, but a narrow tall one crops it
 * horizontally, so the two viewports genuinely need different focal points
 * rather than one shared crop.
 *
 * ONE ASSET, THREE ROUTES (Phase 4D).
 * /work, /services and /blog now share a single object rather than three
 * lookalike literals. Sharing the reference — not copying the fields — is what
 * makes the guarantee structural: the alt text cannot drift away from the
 * photograph it describes, and re-pointing the art is still one edit.
 *
 * ASSET STATUS
 *  - work.webp — derived from the repo's own unreferenced `hero-dev (1).jpg`.
 *    The source carried a heavy teal cast (G and B ~22 points above R) that
 *    conflicts with the black/white/amber identity, so it was desaturated and
 *    warmed until the channel order inverted to R > G > B. STILL NEEDS VISUAL
 *    SIGN-OFF — the correction is verified numerically, not by eye — and that
 *    sign-off now covers three routes rather than one.
 *  - services.webp — derived from `hero-bg.jpg`. Phase 4D consolidated the three
 *    image heroes onto the tower, so this file is now ORPHANED: present in
 *    public/images/page-hero/ (40 KB), referenced by nothing. Left on disk
 *    rather than deleted, because the decision to standardise on one photograph
 *    is an art-direction call that may be revisited.
 *  - /about is intentionally null: specified as type-led, and the founder
 *    portrait is that page's image anchor.
 *  - /contact is intentionally absent: specified as no-image. It opts into the
 *    full-viewport model via PageHeader's `fullScreen` prop instead, so there is
 *    no empty image slot to fill in later.
 *
 * Originals are untouched in public/images/.
 */

/**
 * The tower. One object, three routes — see above.
 *
 * The alt describes the photograph for someone who cannot see it and
 * deliberately does not restate the H1 sitting beside it. It stays accurate on
 * all three pages because it describes the IMAGE, not the page.
 */
const TOWER = {
  src: '/images/page-hero/work.webp',
  alt: 'Low-angle view of a dark tower, its facade receding into repeating bands of glass and shadow',
  /**
   * The apex sits at roughly 52% across and 15% down the frame — measured off
   * the asset, not guessed.
   *
   * Verified against the full-viewport band this now renders into, which crops
   * the source very differently from the 46svh band it was tuned for:
   *  - Portrait phones crop HORIZONTALLY only (a 390x844 slot is far taller than
   *    the 3:2 source), so the whole image height is in shot and the vertical
   *    term is inert. 50% keeps the apex, at 52%, comfortably inside the slice.
   *  - Desktop crops VERTICALLY (16:9 and wider against 3:2). At 1920x1080 the
   *    30% term lands the apex around 13% down the viewport — high, clear of the
   *    copy pinned to the bottom, and clear of the navbar.
   * One shared configuration across all three routes; no per-route override, and
   * no new breakpoint.
   */
  focalClass: 'object-[50%_35%] md:object-[50%_30%]',
};

export const pageHeroes = {
  '/work': TOWER,
  '/services': TOWER,
  '/blog': TOWER,

  /** Type-led by specification — the founder portrait is the page's image anchor. */
  '/about': null,
};

/** Safe lookup — unknown routes fall through to the type-led header. */
export function getPageHero(path) {
  return pageHeroes[path] ?? null;
}
