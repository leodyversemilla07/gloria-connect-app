"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { saveLanguagePreference } from "@/utils/i18n-storage";

export type Messages = Record<string, string>;

type I18nContextType = {
    language: string;
    messages: Messages;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType>({
    language: "en",
    messages: {},
    setLanguage: () => { },
    t: (key: string) => key,
});

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
    const [language, setLanguageState] = useState(initialLanguage);
    const [messages, setMessages] = useState(initialMessages);

    useEffect(() => {
        let mounted = true;
        loadMessages(language).then((msgs) => {
            if (mounted) setMessages(msgs);
        });
        return () => { mounted = false; };
    }, [language]);

    const t = (key: string): string => {
        if (key in messages) {
            return messages[key] || key;
        }

        const keys = key.split(".");
        let value: unknown = messages;
        for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
                value = (value as Record<string, unknown>)[k];
            } else {
                return key;
            }
        }
        return typeof value === "string" ? value : key;
    };

    const setLanguage = (lang: string) => {
        saveLanguagePreference(lang);
        setLanguageState(lang);
    };

    return (
        <I18nContext.Provider value={{ language, messages, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    return useContext(I18nContext);
}
