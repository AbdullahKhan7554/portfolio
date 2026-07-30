/**
 * Nova — Cal.com booking configuration (NON-SECRET).
 *
 * `CAL_LINK` is the Cal.com event handle (`username/event-slug`) read verbatim
 * from the environment. `calConfig` holds the shared embed UI defaults; Phase 3
 * overrides `theme` with the widget's live mode via `calTheme`.
 */
export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK || '';

export const calConfig = {
  theme: 'dark',
  layout: 'month_view',
};

/** Map the Nova widget mode to a Cal.com embed theme. */
export function calTheme(mode) {
  return mode === 'light' ? 'light' : 'dark';
}

export default calConfig;
