import { PageHeader } from '@/components/ui/PageHeader';
import { EntitySummary } from '@/components/sections/about/EntitySummary';
import { WhoWeAre } from '@/components/sections/about/WhoWeAre';
import { WhyWeExist } from '@/components/sections/about/WhyWeExist';
import { Founder } from '@/components/sections/about/Founder';
import { MissionVision } from '@/components/sections/about/MissionVision';
import { ClientPhilosophy } from '@/components/sections/about/ClientPhilosophy';
import { Principles } from '@/components/sections/about/Principles';
import { TrustStandard } from '@/components/sections/about/TrustStandard';
import { AboutCta } from '@/components/sections/about/AboutCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

/**
 * Title names the entity AND the place, because this is the page an answer
 * engine resolves "who is Avenix Studio" against, and a bare "About" gave it
 * nothing to anchor on.
 */
export const metadata = buildMetadata({
  absoluteTitle: 'About Avenix Studio — Software & AI Studio in Lahore, Pakistan',
  description:
    'Avenix Studio is a digital product studio in Lahore, Pakistan, founded in 2023 — custom software, AI automation, mobile apps and SEO, built by one accountable team.',
  path: '/about',
});

/**
 * This route opens on a dark PageHeader, so it needs the same chrome override
 * the homepage uses — app/layout.js defaults themeColor to #FFFFFF on the stated
 * assumption that "inner pages all open on a white PageHeader", which stopped
 * being true when this hero went dark. Without it the browser bar renders white
 * directly above near-black. #0A0A0B is --obsidian-950, the value `theme-dark`
 * assigns to --bg. Next merges viewport shallowly, so this replaces themeColor
 * only; colorScheme, width and initialScale still come from the root layout.
 */
export const viewport = { themeColor: '#0A0A0B' };

/**
 * /about — who Avenix is, why it exists, what it believes, and who is behind it.
 *
 * Deliberately NOT a portfolio page: what Avenix has built lives on /work, what
 * it offers lives on /services. Nothing here restates either.
 *
 * GROUND RHYTHM — dark is reserved for four anchors and never runs adjacent:
 *   01 dark -> 02 light -> 03 light-alt -> 04 DARK (founder, image anchor)
 *   -> 05/06 light -> 07 light-alt -> 08 DARK -> 09 light-alt -> 10 DARK
 * That is what keeps the page from becoming a stack of black cards.
 *
 * STRUCTURED DATA: only the breadcrumb is emitted here. Organization and Person
 * are already injected site-wide from app/layout.js, so adding either would
 * duplicate them.
 */
export default function AboutPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        )}
      />

      {/* 01 — About Hero. The shared PageHeader, opted into the dark ground with
          `theme-dark` (which re-declares the semantic tokens) plus `bg-bg` —
          PageHeader declares no background of its own, so without the second
          class the section would stay transparent over the white body. Passed as
          className; PageHeader itself is untouched and every other page that
          uses it is unaffected.

          No photograph here on purpose: the homepage hero is image-led, so type
          on near-black is what makes this read as the same brand without reading
          as the same page. */}
      <PageHeader
        className="theme-dark bg-bg"
        eyebrow="01 — About Avenix Studio"
        title="We build digital products with intent."
        intro="Avenix Studio is a digital product studio combining strategy, design, engineering, AI and growth — turning ideas into products that earn their place in a business."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />

      {/*
        Placed FIRST among the body sections, immediately under the hero: the
        extractable definition should be the first prose on the page, both for
        an answer engine and for a human who wants the summary before the
        narrative. Everything below it stays in its documented order and the
        dark/light ground rhythm noted above is preserved — this section is
        light-alt, and the section that follows it (WhoWeAre) is light.
      */}
      <EntitySummary />
      <WhoWeAre />
      <WhyWeExist />
      <Founder />
      <MissionVision />
      <ClientPhilosophy />
      <Principles />
      <TrustStandard />
      <AboutCta />
    </main>
  );
}
