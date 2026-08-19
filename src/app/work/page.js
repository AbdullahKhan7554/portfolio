import { PageHeader } from '@/components/ui/PageHeader';
import { WorkGallery } from '@/components/work/WorkGallery';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';
import { getPageHero } from '@/content/pageHeroes';

export const metadata = buildMetadata({
  title: 'Work',
  description:
    'Selected work by Avenix Studio — production websites for clinics, gyms, salons, and businesses, built on Next.js and engineered to convert.',
  path: '/work',
});

/** Dark image hero — see the note in app/about/page.js. #0A0A0B = --obsidian-950. */
export const viewport = { themeColor: '#0A0A0B' };

export default async function WorkPage({ searchParams }) {
  const params = await searchParams;
  const type = params?.type || 'all';
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
          ]),
        )}
      />
      <PageHeader
        hero={getPageHero('/work')}
        eyebrow="Selected Work"
        title="A confident body of work."
        intro="Real projects for real businesses. Filter by type, or open any project to see the problem, the build, and the outcome."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
        ]}
      />
      {/* `py-`, not `pb-`. The hero above is now a full-viewport band, so its own
          bottom padding sits INSIDE the first screen and no longer separates
          anything — this section has to carry its own top spacing. The clamp is
          the same one `Section` uses, so the rhythm matches every other section
          on the site rather than being a value invented here. */}
      <section className="container-page py-[clamp(var(--space-12),10vw,var(--space-24))]">
        <WorkGallery initialType={type} />
      </section>
    </main>
  );
}
