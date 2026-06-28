import { Github, Linkedin, Instagram, Facebook } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/** X (formerly Twitter) brand glyph — lucide only ships the old bird. */
function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

const LINKS = [
  { label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: Linkedin },
  { label: 'GitHub', href: siteConfig.social.github, Icon: Github },
  { label: 'Instagram', href: siteConfig.social.instagram, Icon: Instagram },
  { label: 'Facebook', href: siteConfig.social.facebook, Icon: Facebook },
  { label: 'X', href: siteConfig.social.x, Icon: XIcon },
];

/** Row of social icon chips (reusable). Only renders links that are configured. */
export function SocialLinks({ className }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-3', className)}>
      {LINKS.filter((l) => l.href).map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid h-10 w-10 place-items-center rounded-pill border border-border-strong text-muted transition-colors duration-base hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            <Icon className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
