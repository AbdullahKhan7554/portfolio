'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { LogoutButton } from './LogoutButton';

const items = [
  { href: '/dashboard', label: 'Leads' },
  { href: '/dashboard/analytics', label: 'Analytics' },
];

function isActive(pathname, href) {
  if (href === '/dashboard') {
    return pathname === '/dashboard' || pathname.startsWith('/dashboard/leads');
  }
  return pathname.startsWith(href);
}

const linkClass = (active) =>
  `block rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors ${
    active
      ? 'bg-[var(--surface)] text-[var(--text-strong)]'
      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
  }`;

export function DashboardNav({ userEmail }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-[var(--border)] px-3 py-6 md:flex">
        <div className="px-3 text-sm font-semibold text-[var(--text-strong)]">Avenix Dashboard</div>
        <nav className="mt-6 flex flex-col gap-1">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className={linkClass(isActive(pathname, i.href))}>
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <p className="truncate px-3 text-xs text-[var(--text-muted)]">{userEmail}</p>
          <LogoutButton />
        </div>
      </aside>

      <div className="md:hidden">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <span className="text-sm font-semibold text-[var(--text-strong)]">Avenix Dashboard</span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="rounded-[var(--radius-md)] border border-[var(--border)] p-2 text-[var(--text)] transition-colors hover:border-[var(--border-strong)]"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-b border-[var(--border)] px-3 py-3">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className={linkClass(isActive(pathname, i.href))}
              >
                {i.label}
              </Link>
            ))}
            <p className="truncate px-3 pt-2 text-xs text-[var(--text-muted)]">{userEmail}</p>
            <div className="pt-1">
              <LogoutButton />
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
