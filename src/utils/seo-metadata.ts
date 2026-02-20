/**
 * SEO metadata generation for multi-language support
 * Handles language-specific titles, descriptions, and hreflang tags
 */

import { Metadata } from 'next';

export type Language = 'en' | 'fil';

interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
}

const pageMetadata: Record<string, Record<Language, PageMetadata>> = {
  home: {
    en: {
      title: 'Gloria Connect - Connect With Purpose',
      description: 'Join Gloria Connect, the platform for meaningful community connections and collaboration.',
      keywords: ['community', 'connection', 'collaboration', 'platform'],
    },
    fil: {
      title: 'Gloria Connect - Makipag-ugnayan Nang May Layunin',
      description: 'Sumali sa Gloria Connect, ang platform para sa makabuluhang koneksyon at kolaborasyon sa komunidad.',
      keywords: ['komunidad', 'koneksyon', 'kolaborasyon', 'platform'],
    },
  },
  dashboard: {
    en: {
      title: 'Dashboard - Gloria Connect',
      description: 'Manage your Gloria Connect profile, activities, and connections.',
      keywords: ['dashboard', 'profile', 'manage', 'activities'],
    },
    fil: {
      title: 'Dashboard - Gloria Connect',
      description: 'Pamahalaan ang iyong Gloria Connect profile, aktibidades, at koneksyon.',
      keywords: ['dashboard', 'profile', 'manage', 'aktibidad'],
    },
  },
};

/**
 * Generate metadata for a specific page and language
 */
export function generateMetadataForPage(page: string, language: Language): PageMetadata {
  const metadata = pageMetadata[page]?.[language];
  if (!metadata) {
    return pageMetadata.home[language];
  }
  return metadata;
}

/**
 * Generate Next.js Metadata object for a page
 */
export function generateMetadata(
  page: string,
  language: Language,
  baseUrl: string = 'https://gloria-connect.com'
): Metadata {
  const pageData = generateMetadataForPage(page, language);

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords?.join(', '),
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      type: 'website',
      url: `${baseUrl}/${language}`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: pageData.title,
        },
      ],
    },
    alternates: {
      languages: {
        en: `${baseUrl}/en`,
        fil: `${baseUrl}/fil`,
      },
    },
  };
}

/**
 * Generate hreflang link tags for multi-language support
 * Used for SEO to indicate alternate language versions
 */
export function generateHrefLangLinks(
  pathname: string,
  languages: Language[] = ['en', 'fil'],
  baseUrl: string = 'https://gloria-connect.com'
): Array<{ rel: string; hrefLang: string; href: string }> {
  return languages.map((lang) => ({
    rel: 'alternate',
    hrefLang: lang === 'fil' ? 'fil-PH' : lang,
    href: `${baseUrl}/${lang}${pathname}`,
  }));
}

/**
 * Get the language code for hreflang attributes
 */
export function getHrefLangCode(language: Language): string {
  return language === 'fil' ? 'fil-PH' : language;
}

/**
 * Get alternate language routes for the current page
 */
export function getAlternateLanguageRoutes(
  pathname: string,
  currentLanguage: Language,
  languages: Language[] = ['en', 'fil']
): Record<Language, string> {
  const routes: Record<Language, string> = {} as Record<Language, string>;

  languages.forEach((lang) => {
    // Remove current language prefix if present
    let cleanPath = pathname;
    if (pathname.startsWith(`/${currentLanguage}`)) {
      cleanPath = pathname.slice(currentLanguage.length + 1) || '/';
    }

    routes[lang] = `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
  });

  return routes;
}

/**
 * Extract language from pathname
 */
export function extractLanguageFromPath(pathname: string): Language {
  const match = pathname.match(/^\/(en|fil)/);
  return (match?.[1] as Language) || 'en';
}
