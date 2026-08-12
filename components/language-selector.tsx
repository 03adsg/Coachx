"use client";

import { useTranslator } from "@/components/locale-provider";
import { supportedLocales, type Locale } from "@/lib/i18n";
import { getLocaleFlag } from "@/components/locale-provider";

export function LanguageSelector({ value, onChange, compact = false }: { value: Locale; onChange: (locale: Locale) => void; compact?: boolean }) {
  const { t } = useTranslator();

  return (
    <fieldset className={`language-selector ${compact ? "language-selector--compact" : ""}`.trim()}>
      <legend className="eyebrow">{t("common.language")}</legend>
      <div className="language-selector__grid" role="radiogroup" aria-label={t("common.language")}>
        {supportedLocales.map((locale) => {
          const selected = locale === value;

          return (
            <button
              key={locale}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${getLocaleFlag(locale)} ${t(`locale.${locale}`)}`}
              className={`language-selector__option focus-ring ${selected ? "selected" : ""}`.trim()}
              onClick={() => onChange(locale)}
            >
              <span className="language-selector__flag" aria-hidden="true">
                {getLocaleFlag(locale)}
              </span>
              <span className="language-selector__label">{t(`locale.${locale}`)}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
