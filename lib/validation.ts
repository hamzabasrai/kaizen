const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Must match Supabase Auth minimum (Settings → Auth → Password). */
export const MIN_PASSWORD_LENGTH = 6;

export function isValidEmail(email: string): boolean {
	return EMAIL_RE.test(email);
}

export function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}
