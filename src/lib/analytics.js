'use client';

/**
 * Thin analytics wrapper. Fires GA4 events when configured; otherwise no-ops
 * (and logs in dev) so calls are always safe regardless of env setup.
 * Event names mirror PRD §16.
 *
 * @param {string} event
 * @param {Record<string, any>} [params]
 */
export function trackEvent(event, params = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  } else if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, params);
  }
}

export const AnalyticsEvent = {
  WHATSAPP_CLICK: 'whatsapp_click',
  CONTACT_SUBMIT: 'contact_submit',
  LEAD_MAGNET_SUBMIT: 'lead_magnet_submit',
  CV_DOWNLOAD: 'cv_download',
  CASE_STUDY_VIEW: 'case_study_view',
  PACKAGE_CTA_CLICK: 'package_cta_click',
  BOOKING_CLICK: 'booking_click',
};
