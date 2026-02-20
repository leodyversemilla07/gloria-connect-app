import type { Metadata } from 'next';
import { I18nProvider } from '../i18n-provider';
import enMessages from '../../../../messages/en.json';
import filMessages from '../../../../messages/fil.json';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo-metadata';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const isValidLocale = ['en', 'fil'].includes(locale);

  if (!isValidLocale) {
    return {};
  }

  return generateSeoMetadata('home', locale as 'en' | 'fil');
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale, fallback to 'en'
  const validLocale = ['en', 'fil'].includes(locale) ? locale : 'en';
  const messages = validLocale === 'fil' ? filMessages : enMessages;

  return (
    <I18nProvider language={validLocale} messages={messages}>
      {children}
    </I18nProvider>
  );
}
