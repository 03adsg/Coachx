"use client";

import { useTranslator } from "@/components/locale-provider";
import { supportedLocales, type Locale } from "@/lib/i18n";

export function LanguageSelector({ value, onChange, compact = false }: { value: Locale; onChange: (locale: Locale) => void; compact?: boolean }) {
  const { t } = useTranslator();

  return (
    <label className={`language-selector ${compact ? "language-selector--compact" : ""}`.trim()}>
      <span className="eyebrow">Language</span>
      <select className="input-field focus-ring" value={value} onChange={(event) => onChange(event.target.value as Locale)}>
        {supportedLocales.map((locale) => (
          <option key={locale} value={locale}>
            {t(`locale.${locale}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
