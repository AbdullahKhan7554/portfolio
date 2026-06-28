import { Hero } from '@/components/sections/Hero';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { Services } from '@/components/sections/Services';
import { WhyMe } from '@/components/sections/WhyMe';
import { Process } from '@/components/sections/Process';
import { TechStack } from '@/components/sections/TechStack';
import { AIWorkflow } from '@/components/sections/AIWorkflow';
import { PerfSEO } from '@/components/sections/PerfSEO';
import { CurrentlyLearning } from '@/components/sections/CurrentlyLearning';
import { Testimonials } from '@/components/sections/Testimonials';
import { LeadMagnet } from '@/components/sections/LeadMagnet';
import { FAQ } from '@/components/sections/FAQ';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ path: '/' });

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <CaseStudies />
      <About />
      <Services />
      <WhyMe />
      <Process />
      <AIWorkflow />
      <PerfSEO />
      <TechStack />
      <CurrentlyLearning />
      <Testimonials />
      <LeadMagnet />
      <FAQ />
      <Contact />
    </main>
  );
}
