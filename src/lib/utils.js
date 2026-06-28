import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and de-dupe conflicting Tailwind utilities.
 * @param {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format an integer with locale grouping (e.g. 113 -> "113", 1200 -> "1,200").
 * @param {number} n
 */
export function formatNumber(n) {
  return new Intl.NumberFormat('en-US').format(n);
}
