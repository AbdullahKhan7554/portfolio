/** Best-effort E.164 (digits only); assumes PK for local 03… numbers. '' when empty. */
export function normalizePhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 11 && digits.startsWith('0')) return `92${digits.slice(1)}`;
  return digits;
}
