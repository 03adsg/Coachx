import { cookies } from "next/headers";
import { Screen } from "@/components/screen";
import { getInitialLocale, type Locale } from "@/lib/i18n";

const loadingCopy: Record<Locale, { title: string; subtitle: string; summary: string; details: string }> = {
  en: { title: "PROGRESS", subtitle: "Loading your progress", summary: "Your progress summary is on its way.", details: "Preparing your latest metrics and trends." },
  es: { title: "PROGRESO", subtitle: "Cargando tu progreso", summary: "Tu resumen de progreso está en camino.", details: "Preparando tus métricas y tendencias más recientes." },
  ca: { title: "PROGRÉS", subtitle: "Carregant el teu progrés", summary: "El teu resum de progrés està en camí.", details: "Preparant les teves mètriques i tendències més recents." },
  de: { title: "FORTSCHRITT", subtitle: "Fortschritt wird geladen", summary: "Deine Fortschrittsübersicht wird geladen.", details: "Aktuelle Messwerte und Trends werden vorbereitet." }
};

export default async function Loading() {
  const cookieStore = await cookies();
  const copy = loadingCopy[getInitialLocale(cookieStore.get("athlexforce-locale")?.value)];

  return (
    <Screen
      activeTab="progress"
      shellClassName="progress-analytics-shell"
      topbar={
        <header className="topbar center analytics-topbar">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>{copy.title}</div>
        </header>
      }
    >
      <main className="content tight progress-loading-shell" aria-busy="true" aria-label={copy.subtitle}>
        <section className="section progress-loading-copy">
          <div className="progress-loading-block progress-loading-block--title" aria-hidden="true" />
          <p className="caption">{copy.subtitle}</p>
        </section>
        <section className="section">
          <div className="progress-loading-card" aria-hidden="true">
            <div className="progress-loading-block progress-loading-block--short" />
            <div className="progress-loading-block progress-loading-block--summary" />
            <div className="progress-loading-block progress-loading-block--body" />
            <div className="progress-loading-grid">
              <div className="progress-loading-block" />
              <div className="progress-loading-block" />
              <div className="progress-loading-block" />
              <div className="progress-loading-block" />
            </div>
          </div>
          <p className="sr-only">{copy.summary} {copy.details}</p>
        </section>
      </main>
    </Screen>
  );
}
