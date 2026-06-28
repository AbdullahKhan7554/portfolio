import { Github, Linkedin, Instagram, Facebook } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: Linkedin },
  { label: 'GitHub', href: siteConfig.social.github, Icon: Github },
  { label: 'Instagram', href: siteConfig.social.instagram, Icon: Instagram },
  { label: 'Facebook', href: siteConfig.social.facebook, Icon: Facebook },
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
