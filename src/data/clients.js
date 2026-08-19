/**
 * Clients shown in the homepage logo strip.
 *
 * Assets live in /public/images/clients. Filenames were normalised (spaces and
 * uppercase extensions removed) so the URLs need no escaping.
 *
 * `logo: null` means "no usable asset supplied" — ClientLogoStrip filters those
 * out via getClientsWithLogos() rather than substituting a screenshot.
 *
 * ASSET NOTES — all six below are cropped, transparent-background marks
 * (verified: RGBA, sane crops, no poster text or screenshot chrome). Two carry
 * caveats worth knowing rather than fixing silently:
 *   - paperboat.png  a solid blue 512x512 tile; the alpha channel exists but the
 *                    blue is painted in, so it reads as a square among the
 *                    otherwise free-standing marks.
 *   - scissors…svg   drawn on a 16x16 viewBox — vector, so it scales, but the
 *                    detail available at that grid is minimal.
 *
 * INTEGRITY: only case studies whose `client` is a real named business appear
 * here. The generic entries in content/caseStudies.js ("Law Firm", "Events
 * Business", …) read as demo builds and are deliberately excluded.
 */
export const clients = [
  { slug: 'builtu-gym', name: 'Builtu Gym', logo: '/images/clients/builtu-gym.png' },
  {
    slug: 'xtreme-fitness',
    name: 'XTREME Fitness',
    logo: '/images/clients/xtreme-fitness.png',
  },
  { slug: 'agriprom', name: 'Agriprom Pakistan', logo: '/images/clients/agriprom.png' },
  {
    slug: 'scissors-vip-salon',
    name: 'Scissors VIP Salon',
    logo: '/images/clients/scissors-vip-salon.svg',
  },
  { slug: 'paper-boat', name: 'Paper Boat', logo: '/images/clients/paperboat.png' },
  { slug: 'seven-guys', name: 'Seven Guys', logo: '/images/clients/seven-guys.png' },
  // No asset supplied — getClientsWithLogos() skips these until a path is set.
  { slug: 'smile-heaven-dental', name: 'Smile Heaven Dental Clinic', logo: null },
  { slug: 'voila-luxury-skincare', name: 'Voila Luxury Skincare', logo: null },
  { slug: 'electronics-store', name: 'Multi Electronics', logo: null },
];

/** Only entries with a real asset ever reach the strip. */
export function getClientsWithLogos() {
  return clients.filter((c) => Boolean(c.logo));
}
