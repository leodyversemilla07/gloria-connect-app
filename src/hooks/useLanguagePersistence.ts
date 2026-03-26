/**
 * Custom hook for managing language persistence
 * Handles saving/loading language preference from storage
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useI18n } from '@/app/(main)/i18n-provider';
import { saveLanguagePreference, getLanguagePreference } from '@/utils/i18n-storage';

export function useLanguagePersistence() {
  const { language, setLanguage } = useI18n();

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = getLanguagePreference();
    if (savedLanguage && savedLanguage !== language) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference whenever it changes
  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage);
      saveLanguagePreference(newLanguage);
    },
    [setLanguage]
  );

  return {
    language,
    setLanguage: handleLanguageChange,
  };
}
