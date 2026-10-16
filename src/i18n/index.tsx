import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type Dict } from './en.ts';
import { he } from './he.ts';

export type Locale = 'en' | 'he';

export const LOCALES: { id: Locale; label: string; dir: 'ltr' | 'rtl' }[] = [
  { id: 'en', label: 'English', dir: 'ltr' },
  { id: 'he', label: 'עברית', dir: 'rtl' },
];

const DICTS: Record<Locale, Dict> = { en, he };
const STORAGE_KEY = 'bundlebloom.locale';

function initialLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'he') return saved;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('he') ? 'he' : 'en';
}

interface I18nValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: Dict;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const dir = locale === 'he' ? 'rtl' : 'ltr';
  const t = DICTS[locale];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }, [locale, dir, t]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo(() => ({ locale, dir, t, setLocale }), [locale, dir, t, setLocale]) satisfies I18nValue;
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}
