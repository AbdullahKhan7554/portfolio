'use client';

import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { Calendar } from 'lucide-react';
import { CAL_LINK, calConfig, calTheme } from '@/lib/nova/calendar/calConfig';
import { useNova } from '../context/NovaContext';

const CAL_NAMESPACE = 'nova';

/**
 * CTA that opens the Cal.com booking flow in an in-page popup (no navigation).
 * The `data-cal-*` attributes trigger the popup; `getCalApi` themes it to match
 * the widget's active light/dark mode.
 */
export function CalBookingButton() {
  const { mode } = useNova();
  const theme = calTheme(mode);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal('ui', { theme, hideEventTypeDetails: false, layout: calConfig.layout });
    })();
  }, [theme]);

  return (
    <button
      type="button"
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config={JSON.stringify({ layout: calConfig.layout, theme })}
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--nova-accent)] px-3 py-1.5 text-[0.8rem] font-medium text-[var(--nova-accent-text)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nova-accent)]"
    >
      <Calendar size={15} aria-hidden="true" />
      Book a Call
    </button>
  );
}
