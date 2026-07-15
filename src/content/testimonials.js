/**
 * Social proof.
 *
 * INTEGRITY NOTE — IMPORTANT:
 *   The `proofStats` below are REAL, documented figures (PRD §7.2): review
 *   counts and live custom-domain clients. These are safe to display.
 *
 *   The `testimonials` quotes are PLACEHOLDERS (`placeholder: true`), attributed
 *   to the real client BUSINESS — never to an invented named person. Replace the
 *   `quote` text with genuine client words (and set placeholder: false) before
 *   relying on them publicly. Do not fabricate named individuals or headshots.
 */

export const proofStats = [
  { value: 113, suffix: '+', label: 'Reviews showcased', context: 'Voila Luxury Skincare' },
  { value: 30, suffix: '+', label: 'Reviews surfaced', context: 'Smile Heaven Dental' },
  { value: 17, suffix: '', label: 'Projects shipped', context: 'Across clinics, gyms, salons & e-commerce' },
  { value: 5, suffix: '', label: 'Live client projects', context: 'Real businesses, live in production' },
];

export const testimonials = [
  {
    id: 'smile-heaven',
    business: 'Smile Heaven Dental',
    role: 'Clinic',
    quote:
      'The new site gave our clinic a premium presence and made it effortless for patients to find us and book — exactly what we needed.',
    placeholder: true,
    featured: true,
  },
  {
    id: 'voila',
    business: 'Voila Luxury Skincare',
    role: 'Skincare Clinic',
    quote:
      'Our online presence finally matches the experience we offer in the clinic. The treatment pages and gallery look exceptional.',
    placeholder: true,
  },
  {
    id: 'builtu',
    business: 'Builtu Gym',
    role: 'Live Client',
    quote:
      'Fast, reliable, and live on our own domain. The build was smooth and the result represents our brand perfectly.',
    placeholder: true,
  },
];
