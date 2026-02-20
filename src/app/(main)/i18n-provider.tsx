"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { saveLanguagePreference, getLanguagePreference } from "@/utils/i18n-storage";

export type Messages = Record<string, string>;

type I18nContextType = {
    language: string;
    messages: Messages;
    setLanguage: (lang: string) => void;
};

const I18nContext = createContext<I18nContextType>({
    language: "en",
    messages: {},
    setLanguage: () => { },
});

// Helper to load messages dynamically
async function loadMessages(lang: string): Promise<Messages> {
    switch (lang) {
        case "fil":
            return (await import("../../../messages/fil.json")).default;
        case "en":
        default:
            return (await import("../../../messages/en.json")).default;
    }
}

export function I18nProvider({ language: initialLanguage, messages: initialMessages, children }: { language: string; messages: Messages; children: React.ReactNode }) {
    const [language, setLanguage] = useState(initialLanguage);
    const [messages, setMessages] = useState(initialMessages);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load saved language preference and messages on client-side mount
    useEffect(() => {
        const savedLanguage = getLanguagePreference();
        if (savedLanguage && savedLanguage !== language) {
            setLanguage(savedLanguage);
        }
        setIsHydrated(true);
    }, []);

    // Load messages when language changes
    useEffect(() => {
        let mounted = true;
        loadMessages(language).then((msgs) => {
            if (mounted) setMessages(msgs);
        });
        return () => { mounted = false; };
    }, [language]);

    // Save language preference whenever it changes (only after hydration)
    useEffect(() => {
        if (isHydrated) {
            saveLanguagePreference(language);
        }
    }, [language, isHydrated]);

    return (
        <I18nContext.Provider value={{ language, messages, setLanguage }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    return useContext(I18nContext);
}
