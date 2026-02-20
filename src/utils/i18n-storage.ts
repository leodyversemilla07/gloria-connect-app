/**
 * Storage utilities for language preference persistence
 * Handles localStorage access safely for SSR environments
 */

const LANGUAGE_STORAGE_KEY = 'gloria-connect-language';

export function saveLanguagePreference(language: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}

export function getLanguagePreference(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  }
  return null;
}

export function clearLanguagePreference(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  }
}
