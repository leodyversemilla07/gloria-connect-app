/**
 * Custom hook for managing language persistence
 * Handles saving/loading language preference from storage
 */

"use client";

import { useCallback, useEffect } from "react";
import { useI18n } from "@/components/i18n-provider";
import { getLanguagePreference, saveLanguagePreference } from "@/utils/i18n-storage";

export function useLanguagePersistence() {
  const { language, setLanguage } = useI18n();

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = getLanguagePreference();
    if (savedLanguage && savedLanguage !== language) {
      setLanguage(savedLanguage);
    }
  }, [language, setLanguage]);

  // Save language preference whenever it changes
  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage);
      saveLanguagePreference(newLanguage);
    },
    [setLanguage],
  );

  return {
    language,
    setLanguage: handleLanguageChange,
  };
}
