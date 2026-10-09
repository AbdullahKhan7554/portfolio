/**
 * Founder facts — supplied by Abdullah, 2026-10-09. The ONLY source for the
 * founder bio on /about and /founder and for the Person JSON-LD in
 * lib/schema.js, so the visible copy and the structured data cannot disagree.
 *
 * Do not add to this file from anywhere else. Anything not listed here is not
 * a confirmed fact about the founder.
 *
 * LinkedIn is deliberately absent from `profiles`: the URL supplied was
 * https://www.linkedin.com/feed/ — LinkedIn's generic home feed, not a profile
 * — so it identifies nobody. Add the /in/<handle> URL when it is available.
 */

export const founderBio =
  'Abdullah Khan is the founder of Avenix Studio, a software studio based in Lahore, Pakistan. He is a full-stack developer studying Computer Science at FAST-NUCES Lahore, and works with businesses in Pakistan and abroad on websites, web apps and AI automation. His main stack is Next.js, React and JavaScript, with API integrations that connect a business’s tools and automate repeated work.';

export const founderEducation = {
  degree: 'BS Computer Science',
  institution: 'FAST-NUCES Lahore',
  institutionFullName: 'National University of Computer and Emerging Sciences',
  years: '2024–2028 (expected)',
};

export const founderFacts = [
  { label: 'Based in', value: 'Lahore, Pakistan' },
  {
    label: 'Education',
    value: `${founderEducation.degree}, ${founderEducation.institution}, ${founderEducation.years}`,
  },
  {
    label: 'Work',
    value:
      'Freelances on Upwork with international clients, and has worked with multiple businesses on their websites and automation.',
  },
  { label: 'Skills', value: 'Web development, app development, AI automation' },
  { label: 'Tech', value: 'Next.js, React, JavaScript, APIs' },
];

/** Personal profiles — the Person's `sameAs` and the links on /founder. */
export const founderProfiles = [
  { label: 'GitHub', href: 'https://github.com/AbdullahKhan7554' },
  { label: 'Upwork', href: 'https://www.upwork.com/freelancers/~01e4f3e9f4eb63c276' },
];

export const founderKnowsAbout = [
  'Web Development',
  'Next.js',
  'React',
  'AI Automation',
  'App Development',
];
