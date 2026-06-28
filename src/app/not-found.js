import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-[70svh] place-items-center px-6 pt-32">
      <div className="text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="mt-6 font-display text-display text-text-strong">
          Lost the <span className="text-amber-wipe">thread</span>.
        </h1>
        <p className="measure mx-auto mt-4 text-lead text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Let&rsquo;s
          get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" magnetic>
            Back home
          </Button>
          <Button href="/work" variant="secondary">
            View work
          </Button>
        </div>
      </div>
    </main>
  );
}
