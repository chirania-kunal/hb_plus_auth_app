export const ALLOWED_DOMAIN = 'hbplus.fit';
export const APP_NAME = 'HBPlus Portal';

export function isAllowedEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf('@');
  return at > 0 && normalized.slice(at + 1) === ALLOWED_DOMAIN;
}
