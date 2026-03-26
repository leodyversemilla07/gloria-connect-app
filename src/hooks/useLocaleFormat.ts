/**
 * Custom hook for accessing locale-specific formatting
 * Provides formatting functions based on current i18n language
 */

'use client';

import { useI18n } from '@/app/(main)/i18n-provider';
import {
  formatDate,
  formatDateTime,
  formatTimeDistance,
  formatNumber,
  formatCurrency,
  formatPercent,
  getCurrencyInfo,
  Language,
} from '@/utils/locale-format';

export function useLocaleFormat() {
  const { language } = useI18n();
  const lang = (language as Language) || 'en';

  return {
    formatDate: (date: Date | string) => formatDate(date, lang),
    formatDateTime: (date: Date | string) => formatDateTime(date, lang),
    formatTimeDistance: (date: Date | string) => formatTimeDistance(date, lang),
    formatNumber: (value: number) => formatNumber(value, lang),
    formatCurrency: (amount: number) => formatCurrency(amount, lang),
    formatPercent: (value: number) => formatPercent(value, lang),
    getCurrencyInfo: () => getCurrencyInfo(lang),
  };
}
