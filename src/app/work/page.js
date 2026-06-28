import { PageHeader } from '@/components/ui/PageHeader';
import { WorkGallery } from '@/components/work/WorkGallery';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'Work',
  description:
    'Selected work by Avenix Studio — production websites for clinics, gyms, salons, and businesses, built on Next.js and engineered to convert.',
  path: '/work',
});

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
        eyebrow="Selected Work"
        title="A confident body of work."
        intro="Real projects for real businesses. Filter by type, or open any project to see the problem, the build, and the outcome."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
        ]}
      />
      <section className="container-page pb-[clamp(var(--space-12),10vw,var(--space-24))]">
        <WorkGallery initialType={type} />
      </section>
    </main>
  );
}
