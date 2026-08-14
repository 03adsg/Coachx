"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { bootstrapLocale, getCurrentLocale, getTranslation, setCurrentLocale, subscribeLocale } from "@/lib/i18n";

export function LocaleProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    bootstrapLocale();
  }, []);

  const { locale } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return children;
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribeLocale, getCurrentLocale, getCurrentLocale);

  return {
    locale,
    setLocale: setCurrentLocale
  };
}

export function useResolvedLocale() {
  return getCurrentLocale();
}

export function getLocaleFlag(locale: string) {
  switch (locale) {
    case "es":
      return "🇪🇸";
    case "ca":
      return "🇦🇩";
    case "en":
      return "🇬🇧";
    case "de":
      return "🇩🇪";
    default:
      return "";
  }
}

export function useTranslator() {
  const { locale } = useLocale();

  return {
    locale,
    t: (path: string) => getTranslation(locale, path)
  };
}
