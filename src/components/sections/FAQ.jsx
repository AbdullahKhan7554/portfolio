import { Section } from '@/components/ui/Section';
import { Accordion } from '@/components/ui/Accordion';
import { faqs } from '@/content/faqs';
import { faqSchema, jsonLd } from '@/lib/schema';

export function FAQ() {
  return (
    <Section
      id="faq"
      eyebrow="11 — Questions"
      title="Everything You Might Ask."
      intro="Straight answers to the questions clients ask most — so the call can focus on your project."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))} />
      <div className="mt-6 max-w-3xl">
        <Accordion items={faqs} defaultOpen={0} />
      </div>
    </Section>
  );
}
