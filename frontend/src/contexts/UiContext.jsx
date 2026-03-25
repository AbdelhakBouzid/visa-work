import { createContext, useContext, useMemo, useState } from 'react';
import { localeOptions, translate } from '../utils/i18n';

const LOCALE_STORAGE_KEY = 'visa-work-locale';
const THEME_STORAGE_KEY = 'visa-work-theme';
const UiContext = createContext(null);

const getInitialLocale = () => {
  if (typeof window === 'undefined') {
    return 'ar';
  }

  return window.localStorage.getItem(LOCALE_STORAGE_KEY) || 'ar';
};

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function UiProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);
  const [theme, setThemeState] = useState(getInitialTheme);
  const isRtl = locale === 'ar';

  const setLocale = (nextLocale) => {
    setLocaleState(nextLocale);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    }
  };

  const setTheme = (nextTheme) => {
    setThemeState(nextTheme);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const t = (key, params = {}, fallback) => translate(locale, key, params, fallback);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      theme,
      setTheme,
      toggleTheme,
      isRtl,
      localeOptions,
      t
    }),
    [locale, theme, isRtl]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export const useUi = () => {
  const context = useContext(UiContext);

  if (!context) {
    throw new Error('useUi must be used within UiProvider');
  }

  return context;
};
