/**
 * Locale-specific formatting utilities
 * Handles date, number, and currency formatting based on language/locale
 */

import { format, parseISO, formatDistance } from 'date-fns';
import { enUS, fil } from 'date-fns/locale';

export type Language = 'en' | 'fil';

const localeMap: Record<Language, Locale> = {
  en: enUS,
  fil: fil,
};

const currencyMap: Record<Language, { code: string; symbol: string; locale: string }> = {
  en: { code: 'USD', symbol: '$', locale: 'en-US' },
  fil: { code: 'PHP', symbol: '₱', locale: 'fil-PH' },
};

const numberFormatLocales: Record<Language, string> = {
  en: 'en-US',
  fil: 'fil-PH',
};

/**
 * Format a date for the specified language/locale
 */
export function formatDate(date: Date | string, language: Language = 'en'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'PPP', { locale: localeMap[language] });
  } catch {
    return new Date().toLocaleDateString();
  }
}

/**
 * Format a date with time for the specified language/locale
 */
export function formatDateTime(date: Date | string, language: Language = 'en'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'PPp', { locale: localeMap[language] });
  } catch {
    return new Date().toLocaleString();
  }
}

/**
 * Format time relative to now (e.g., "2 hours ago")
 */
export function formatTimeDistance(date: Date | string, language: Language = 'en'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), {
      addSuffix: true,
      locale: localeMap[language],
    });
  } catch {
    return 'recently';
  }
}

/**
 * Format a number according to locale rules
 */
export function formatNumber(value: number, language: Language = 'en'): string {
  return new Intl.NumberFormat(numberFormatLocales[language]).format(value);
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, language: Language = 'en'): string {
  const { code, locale } = currencyMap[language];
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
  }).format(amount);
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, language: Language = 'en'): string {
  return new Intl.NumberFormat(numberFormatLocales[language], {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Get the proper locale object for date-fns
 */
export function getLocaleObject(language: Language): Locale {
  return localeMap[language];
}

/**
 * Get the locale code for the specified language
 */
export function getLocaleCode(language: Language): string {
  return numberFormatLocales[language];
}

/**
 * Get currency info for the specified language
 */
export function getCurrencyInfo(language: Language): { code: string; symbol: string } {
  return {
    code: currencyMap[language].code,
    symbol: currencyMap[language].symbol,
  };
}
