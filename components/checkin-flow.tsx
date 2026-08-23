"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { useTranslator } from "@/components/locale-provider";
import { Screen } from "@/components/screen";
import { Card, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useCheckInStore } from "@/components/checkin-provider";
import type { WeeklyCheckinQuestionDefinition } from "@/lib/checkin-data";

const checkInCopy = {
  en: {
    closeScreen: "Close screen",
    loadingAnswers: "Restoring your answers",
    unableToLoad: "Unable to load",
    tryAgain: "Try again",
    weekOf: "Week of",
    to: "to",
    inProgress: "In progress",
    saved: "Saved",
    draft: "Draft",
    training: "training",
    nutrition: "nutrition",
    pending: "Pending",
    summaryFallback: "Your answers and adherence context are being captured.",
    addShortNote: "Add a short note",
    saveNote: "Save note",
    alreadySaved: "What is already saved",
    notAnswered: "Not answered",
    submit: "Submit check-in",
    submittedAt: "Submitted at",
    noReview: "No review yet.",
    keyTraining: "Training",
    keyNutrition: "Nutrition",
    keyProgressEntries: "Progress entries",
    reviewStored: "The review state is stored remotely and can later be consumed by the coach workflow."
  },
  es: {
    closeScreen: "Cerrar pantalla",
    loadingAnswers: "Restaurando tus respuestas",
    unableToLoad: "No se ha podido cargar",
    tryAgain: "Intentar de nuevo",
    weekOf: "Semana del",
    to: "al",
    inProgress: "En curso",
    saved: "Guardado",
    draft: "Borrador",
    training: "entrenamiento",
    nutrition: "nutrición",
    pending: "Pendiente",
    summaryFallback: "Se están guardando tus respuestas y el contexto de adherencia.",
    addShortNote: "Añade una nota breve",
    saveNote: "Guardar nota",
    alreadySaved: "Ya guardado",
    notAnswered: "Sin responder",
    submit: "Enviar check-in",
    submittedAt: "Enviado el",
    noReview: "Aún no hay revisión.",
    keyTraining: "Entrenamiento",
    keyNutrition: "Nutrición",
    keyProgressEntries: "Entradas de progreso",
    reviewStored: "El estado de la revisión queda guardado y el flujo del coach podrá usarlo más adelante."
  },
  ca: {
    closeScreen: "Tanca la pantalla",
    loadingAnswers: "Restaurant les teves respostes",
    unableToLoad: "No s'ha pogut carregar",
    tryAgain: "Torna-ho a provar",
    weekOf: "Setmana del",
    to: "al",
    inProgress: "En curs",
    saved: "Desat",
    draft: "Esborrany",
    training: "entrenament",
    nutrition: "nutrició",
    pending: "Pendent",
    summaryFallback: "S'estan desant les teves respostes i el context d'adherència.",
    addShortNote: "Afegeix una nota breu",
    saveNote: "Desa la nota",
    alreadySaved: "Ja desat",
    notAnswered: "Sense resposta",
    submit: "Envia el check-in",
    submittedAt: "Enviat el",
    noReview: "Encara no hi ha revisió.",
    keyTraining: "Entrenament",
    keyNutrition: "Nutrició",
    keyProgressEntries: "Entrades de progrés",
    reviewStored: "L'estat de la revisió queda desat i el flux del coach el podrà fer servir més endavant."
  },
  de: {
    closeScreen: "Bildschirm schließen",
    loadingAnswers: "Deine Antworten werden wiederhergestellt",
    unableToLoad: "Konnte nicht geladen werden",
    tryAgain: "Erneut versuchen",
    weekOf: "Woche vom",
    to: "bis",
    inProgress: "In Bearbeitung",
    saved: "Gespeichert",
    draft: "Entwurf",
    training: "Training",
    nutrition: "Ernährung",
    pending: "Ausstehend",
    summaryFallback: "Deine Antworten und der Adhärenzkontext werden erfasst.",
    addShortNote: "Kurze Notiz hinzufügen",
    saveNote: "Notiz speichern",
    alreadySaved: "Bereits gespeichert",
    notAnswered: "Nicht beantwortet",
    submit: "Check-in senden",
    submittedAt: "Gesendet am",
    noReview: "Noch keine Prüfung.",
    keyTraining: "Training",
    keyNutrition: "Ernährung",
    keyProgressEntries: "Fortschrittseinträge",
    reviewStored: "Der Prüfstatus ist gespeichert und kann später vom Coach-Workflow genutzt werden."
  }
} as const;

function localizeCheckInReviewCopy(value: string | null | undefined, locale: keyof typeof checkInCopy) {
  if (!value) {
    return value;
  }

  if (locale === "en") {
    return value;
  }

  const es: Record<string, string> = {
    "Coach review required": "Revisión del coach necesaria",
    "Light review recommended": "Revisión ligera recomendada",
    "No review required": "Sin revisión necesaria",
    "The week looks stable and the active program can remain in place.": "La semana parece estable y el programa activo puede mantenerse.",
    "A safety-sensitive signal was captured. Keep the current program stable until someone reviews it.": "Se ha detectado una señal sensible de seguridad. Mantén estable el programa actual hasta que se revise.",
    "A few adherence signals are softer this week, so the review should stay visible without mutating the program.": "Algunas señales de adherencia están más bajas esta semana, así que la revisión debe permanecer visible sin modificar el programa."
  };
  const ca: Record<string, string> = {
    "Coach review required": "Cal revisió del coach",
    "Light review recommended": "Revisió lleugera recomanada",
    "No review required": "No cal revisió",
    "The week looks stable and the active program can remain in place.": "La setmana sembla estable i el programa actiu es pot mantenir.",
    "A safety-sensitive signal was captured. Keep the current program stable until someone reviews it.": "S'ha detectat un senyal sensible de seguretat. Mantén estable el programa actual fins que algú el revisi.",
    "A few adherence signals are softer this week, so the review should stay visible without mutating the program.": "Alguns senyals d'adherència són més baixos aquesta setmana, així que la revisió ha de continuar visible sense modificar el programa."
  };
  const de: Record<string, string> = {
    "Coach review required": "Coach-Prüfung erforderlich",
    "Light review recommended": "Leichte Prüfung empfohlen",
    "No review required": "Keine Prüfung erforderlich",
    "The week looks stable and the active program can remain in place.": "Die Woche wirkt stabil und das aktive Programm kann bestehen bleiben.",
    "A safety-sensitive signal was captured. Keep the current program stable until someone reviews it.": "Ein sicherheitsrelevantes Signal wurde erfasst. Halte das aktuelle Programm stabil, bis es geprüft wurde.",
    "A few adherence signals are softer this week, so the review should stay visible without mutating the program.": "Einige Adhärenzsignale sind diese Woche schwächer, daher sollte die Prüfung sichtbar bleiben, ohne das Programm zu ändern."
  };

  const translations: Partial<Record<keyof typeof checkInCopy, Record<string, string>>> = { es, ca, de };
  return translations[locale]?.[value] ?? value;
}

function localizeCheckInStatus(value: string | null | undefined, locale: keyof typeof checkInCopy) {
  const normalized = value?.replaceAll("_", " ") ?? "in progress";
  const labels: Record<keyof typeof checkInCopy, Record<string, string>> = {
    en: { "not started": "Not started", "in progress": "In progress", completed: "Completed", submitted: "Submitted", reviewed: "Reviewed" },
    es: { "not started": "Sin empezar", "in progress": "En curso", completed: "Completado", submitted: "Enviado", reviewed: "Revisado" },
    ca: { "not started": "Sense començar", "in progress": "En curs", completed: "Completat", submitted: "Enviat", reviewed: "Revisat" },
    de: { "not started": "Nicht gestartet", "in progress": "In Bearbeitung", completed: "Abgeschlossen", submitted: "Gesendet", reviewed: "Geprüft" }
  };

  return labels[locale][normalized] ?? normalized;
}

function CheckInTopbar({ title }: { title: string }) {
  const { locale } = useTranslator();
  const copy = checkInCopy[locale];

  return (
    <header className="progress-review-topbar">
      <Link href="/progress" className="progress-review-topbar__button focus-ring" aria-label={copy.closeScreen}>
        <span className="icon" aria-hidden="true">
          close
        </span>
      </Link>
      <BrandLogo variant="mark" width={34} alt="AthlexForce" />
      <span className="progress-review-topbar__label">{title}</span>
    </header>
  );
}

function ScaleChoiceRow({
  question,
  value,
  onSelect,
  disabled = false
}: {
  question: WeeklyCheckinQuestionDefinition;
  value: number | null;
  onSelect: (next: number) => void;
  disabled?: boolean;
}) {
  if (!question.scale) {
    return null;
  }

  const labels = [question.scale.minimumLabel, "", "", "", question.scale.maximumLabel];

  return (
    <div className="progress-choice-row" role="radiogroup" aria-label={question.title}>
      {Array.from({ length: question.scale.maximum - question.scale.minimum + 1 }, (_, index) => {
        const nextValue = question.scale ? question.scale.minimum + index : index + 1;
        return (
          <button
            key={nextValue}
            type="button"
            className={`progress-choice-chip ${value === nextValue ? "active" : ""}`.trim()}
            disabled={disabled}
            aria-pressed={value === nextValue}
            onClick={() => onSelect(nextValue)}
          >
            <span>{nextValue}</span>
            {labels[index] ? <span className="caption" style={{ marginTop: 4 }}>{labels[index]}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function SingleChoiceRow({
  question,
  value,
  onSelect,
  disabled = false
}: {
  question: WeeklyCheckinQuestionDefinition;
  value: string | null;
  onSelect: (next: string) => void;
  disabled?: boolean;
}) {
  if (!question.options) {
    return null;
  }

  return (
    <div className="progress-choice-row" role="radiogroup" aria-label={question.title}>
      {question.options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`progress-choice-chip ${value === option.id ? "active" : ""}`.trim()}
          disabled={disabled}
          aria-pressed={value === option.id}
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function WeeklyCheckInScreen() {
  const router = useRouter();
  const { t, locale } = useTranslator();
  const copy = checkInCopy[locale];
  const store = useCheckInStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (store.currentQuestionIndex >= 0) {
      setActiveIndex(store.currentQuestionIndex);
    }
  }, [store.currentQuestionIndex, store.checkin?.id]);

  useEffect(() => {
    const note = store.responses.find((response) => response.question_key === "weekly_notes");
    setNoteDraft(note?.text_value ?? "");
  }, [store.responses, store.checkin?.id]);

  const answeredMap = useMemo(() => new Map(store.responses.map((response) => [response.question_key, response])), [store.responses]);
  const currentQuestion = store.questions[activeIndex] ?? store.questions[store.questions.length - 1];
  const coreQuestionsComplete = store.questions
    .filter((question) => question.key !== "weekly_notes")
    .every((question) => answeredMap.has(question.key));
  const canSubmit = coreQuestionsComplete && currentQuestion.key === "weekly_notes";
  const currentAnswer = answeredMap.get(currentQuestion.key) ?? null;

  const moveNext = async () => {
    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setActionError(null);
    try {
      if (noteDraft.trim() && currentAnswer?.text_value !== noteDraft.trim()) {
        await store.saveResponse({
          questionKey: "weekly_notes",
          responseType: "text",
          textValue: noteDraft.trim()
        });
      }
      await store.submitCheckIn(noteDraft.trim() || null);
      router.push("/progress/check-in/completion");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : copy.unableToLoad);
    } finally {
      setSubmitting(false);
    }
  };

  const saveScaleAnswer = async (nextValue: number) => {
    if (!currentQuestion.scale) {
      return;
    }

    setSavingKey(currentQuestion.key);
    setActionError(null);
    try {
      await store.saveResponse({
        questionKey: currentQuestion.key,
        responseType: "scale",
        numericValue: nextValue
      });
      await moveNext();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : copy.unableToLoad);
    } finally {
      setSavingKey(null);
    }
  };

  const saveChoiceAnswer = async (nextValue: string) => {
    setSavingKey(currentQuestion.key);
    setActionError(null);
    try {
      await store.saveResponse({
        questionKey: currentQuestion.key,
        responseType: "single_choice",
        choiceValue: nextValue
      });
      await moveNext();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : copy.unableToLoad);
    } finally {
      setSavingKey(null);
    }
  };

  const saveNote = async () => {
    setSavingKey(currentQuestion.key);
    setActionError(null);
    try {
      await store.saveResponse({
        questionKey: "weekly_notes",
        responseType: "text",
        textValue: noteDraft.trim() || null
      });
      setActiveIndex(store.questions.length - 1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : copy.unableToLoad);
    } finally {
      setSavingKey(null);
    }
  };

  if (store.loading) {
    return (
      <Screen shellClassName="progress-flow-shell" topbar={<CheckInTopbar title={t("common.review").toUpperCase()} />}>
        <main className="content tight">
          <section className="section">
            <Card className="p-16 elevated">
              <div className="eyebrow">{t("common.loading")} {t("common.review").toLowerCase()}</div>
              <div className="headline-md" style={{ marginTop: 10 }}>
                {copy.loadingAnswers}
              </div>
            </Card>
          </section>
        </main>
      </Screen>
    );
  }

  if (store.error) {
    return (
      <Screen shellClassName="progress-flow-shell" topbar={<CheckInTopbar title={t("common.review").toUpperCase()} />}>
        <main className="content tight">
          <section className="section">
            <Card className="p-16 elevated">
              <div className="eyebrow">{copy.unableToLoad}</div>
              <p className="body-md" style={{ marginTop: 10 }}>
                {store.error}
              </p>
              <div className="stack" style={{ marginTop: 16 }}>
                <PrimaryButton className="focus-ring" onClick={() => void store.reloadCheckIn()}>
                  {copy.tryAgain}
                </PrimaryButton>
                <SecondaryButton className="focus-ring" onClick={() => router.push("/progress")}>
                {t("common.back")} {t("common.progress").toLowerCase()}
                </SecondaryButton>
              </div>
            </Card>
          </section>
        </main>
      </Screen>
    );
  }

  return (
    <Screen shellClassName="progress-flow-shell" topbar={<CheckInTopbar title={t("common.review").toUpperCase()} />}>
      <main className="content tight">
        <section className="section progress-hero">
          <h1 className="headline-lg" style={{ textTransform: "uppercase" }}>
            {t("common.review")}
          </h1>
          <p className="caption" style={{ marginTop: 8 }}>
            {copy.weekOf} {store.weekStartDate} {copy.to} {store.weekEndDate}
          </p>
          <div className="progress-phase-timeline progress-phase-timeline--review" style={{ marginTop: 12 }}>
            <span className="accent">{store.currentQuestionIndex + 1} / {store.questions.length}</span>
            <span>{localizeCheckInStatus(store.checkin?.status, locale).toUpperCase()}</span>
            <span>{store.source === "remote" ? copy.saved : copy.draft}</span>
          </div>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="row start">
              <div>
              <div className="eyebrow">{t("common.review")}</div>
                <div className="headline-md" style={{ marginTop: 6 }}>
                  {store.summary?.adherencePercent.training ?? 0}% {copy.training} · {store.summary?.adherencePercent.nutrition ?? 0}% {copy.nutrition}
                </div>
              </div>
              <span className="progress-chip progress-chip--accent">
                {localizeCheckInReviewCopy(store.summary?.review.recommendationLabel, locale) ?? copy.pending}
              </span>
            </div>
            <p className="caption" style={{ marginTop: 10, lineHeight: 1.6 }}>
              {localizeCheckInReviewCopy(store.summary?.review.summary, locale) ?? copy.summaryFallback}
            </p>
          </Card>
        </section>

        <section className="section">
          <Card className="p-16 elevated">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              {currentQuestion.title}
            </div>
            <h2 className="headline-md" style={{ margin: 0 }}>
              {currentQuestion.prompt}
            </h2>
            {currentQuestion.helperText ? (
              <p className="caption" style={{ marginTop: 10, lineHeight: 1.6 }}>
                {currentQuestion.helperText}
              </p>
            ) : null}

            <div style={{ marginTop: 18 }}>
              {currentQuestion.responseType === "scale" ? (
                <ScaleChoiceRow
                  question={currentQuestion}
                  value={currentAnswer?.numeric_value ?? null}
                  disabled={savingKey === currentQuestion.key || submitting}
                  onSelect={(nextValue) => void saveScaleAnswer(nextValue)}
                />
              ) : currentQuestion.responseType === "single_choice" ? (
                <SingleChoiceRow
                  question={currentQuestion}
                  value={currentAnswer?.choice_value ?? null}
                  disabled={savingKey === currentQuestion.key || submitting}
                  onSelect={(nextValue) => void saveChoiceAnswer(nextValue)}
                />
              ) : (
                <div className="stack" style={{ gap: 12 }}>
                  <textarea
                    aria-label={currentQuestion.title}
                    className="input-field"
                    rows={5}
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    placeholder={copy.addShortNote}
                  />
                  <PrimaryButton
                    className="focus-ring"
                    disabled={savingKey === currentQuestion.key || submitting}
                    onClick={() => void saveNote()}
                  >
                    {copy.saveNote}
                  </PrimaryButton>
                </div>
              )}
            </div>
          </Card>
        </section>

        {actionError ? (
          <section className="section">
            <Card className="p-16">
              <div className="eyebrow">{t("common.error")}</div>
              <p className="caption" style={{ marginTop: 8, lineHeight: 1.6 }}>
                {actionError}
              </p>
            </Card>
          </section>
        ) : null}

        <section className="section">
          <Card className="p-16">
            <div className="eyebrow">{copy.alreadySaved}</div>
            <div className="stack" style={{ gap: 10, marginTop: 12 }}>
              {store.questions
                .filter((question) => question.key !== "weekly_notes")
                .map((question) => {
                  const response = answeredMap.get(question.key);
                  const label =
                    response?.numeric_value != null
                      ? String(response.numeric_value)
                      : response?.choice_value ?? response?.text_value ?? copy.notAnswered;
                  return (
                    <div key={question.key} className="row" style={{ alignItems: "flex-start" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="body-md" style={{ fontWeight: 700 }}>
                          {question.title}
                        </div>
                        <div className="caption" style={{ marginTop: 4 }}>
                          {label}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="progress-mini-action focus-ring"
                        onClick={() => setActiveIndex(store.questions.findIndex((item) => item.key === question.key))}
                      >
                  {t("common.edit")}
                      </button>
                    </div>
                  );
                })}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="stack" style={{ gap: 12 }}>
            {canSubmit ? (
              <PrimaryButton className="focus-ring" onClick={() => void moveNext()} disabled={submitting}>
                {copy.submit}
              </PrimaryButton>
            ) : null}
              <SecondaryButton className="focus-ring" onClick={() => router.push("/progress")}>
              {t("common.back")} {t("common.progress").toLowerCase()}
              </SecondaryButton>
          </div>
        </section>
      </main>
    </Screen>
  );
}

export function WeeklyCheckInCompletionScreen() {
  const router = useRouter();
  const { t, locale } = useTranslator();
  const copy = checkInCopy[locale];
  const store = useCheckInStore();
  const review = store.review
    ? {
        status: store.review.status,
        recommendationType: store.review.recommendation_type ?? store.summary?.review.recommendationType ?? "none",
        summary:
          typeof store.review.review_reason === "object" && store.review.review_reason && "summary" in store.review.review_reason
            ? localizeCheckInReviewCopy(String((store.review.review_reason as Record<string, unknown>).summary ?? store.summary?.review.summary ?? ""), locale) ?? ""
            : localizeCheckInReviewCopy(store.summary?.review.summary, locale) ?? "",
        recommendationLabel: localizeCheckInReviewCopy(store.summary?.review.recommendationLabel, locale) ?? copy.pending
      }
    : store.summary
      ? {
          ...store.summary.review,
          summary: localizeCheckInReviewCopy(store.summary.review.summary, locale) ?? store.summary.review.summary,
          recommendationLabel: localizeCheckInReviewCopy(store.summary.review.recommendationLabel, locale) ?? store.summary.review.recommendationLabel
        }
      : { status: "pending", recommendationType: "none", summary: copy.noReview, recommendationLabel: copy.pending };

  const keySignals = [
    { label: copy.keyTraining, value: `${store.summary?.adherencePercent.training ?? 0}%` },
    { label: copy.keyNutrition, value: `${store.summary?.adherencePercent.nutrition ?? 0}%` },
    { label: copy.keyProgressEntries, value: String(store.summary?.counts.progressEntries ?? 0) }
  ];

  const noteResponse = store.responses.find((response) => response.question_key === "weekly_notes");
  const painResponse = store.responses.find((response) => response.question_key === "pain_discomfort");

  return (
    <Screen shellClassName="progress-flow-shell" topbar={<CheckInTopbar title={t("common.review").toUpperCase()} />}>
      <main className="content tight">
        <section className="section">
          <Card className="p-16 elevated" style={{ background: "var(--background-charcoal)" }}>
            <div className="eyebrow">{t("common.success")}</div>
            <h1 className="headline-lg" style={{ marginTop: 8, textTransform: "uppercase" }}>
              {t("common.review")}
            </h1>
            <p className="caption" style={{ marginTop: 8, lineHeight: 1.6 }}>
              {store.checkin?.submitted_at ? `${copy.submittedAt} ${new Date(store.checkin.submitted_at).toLocaleString()}.` : t("common.success")}
            </p>
          </Card>
        </section>

        <section className="section">
          <div className="grid-3">
            {keySignals.map((signal) => (
              <Card key={signal.label} className="p-16">
                <div className="eyebrow">{signal.label}</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  {signal.value}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="eyebrow">{t("common.review")}</div>
            <div className="headline-md" style={{ marginTop: 8 }}>
              {review.recommendationLabel}
            </div>
            <p className="caption" style={{ marginTop: 10, lineHeight: 1.6 }}>
              {review.summary}
            </p>
            {painResponse?.choice_value ? (
              <div className="caption" style={{ marginTop: 10 }}>
                {t("common.progress")}: {painResponse.choice_value}
              </div>
            ) : null}
            {noteResponse?.text_value ? (
              <div className="caption" style={{ marginTop: 6 }}>
                {t("common.review")}: {noteResponse.text_value}
              </div>
            ) : null}
          </Card>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="eyebrow">{t("common.save")}</div>
            <div className="stack" style={{ gap: 10, marginTop: 12 }}>
              {store.questions.map((question) => {
                const response = store.responses.find((item) => item.question_key === question.key);
                const value =
                  response?.numeric_value != null
                    ? String(response.numeric_value)
                    : response?.choice_value ?? response?.text_value ?? response?.boolean_value?.toString() ?? copy.notAnswered;

                return (
                  <div key={question.key} className="row" style={{ alignItems: "flex-start" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="body-md" style={{ fontWeight: 700 }}>
                        {question.title}
                      </div>
                      <div className="caption" style={{ marginTop: 4 }}>
                        {value}
                      </div>
                    </div>
                    <span className="caption">{response?.answered_at ? t("common.save") : t("common.loading")}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="stack" style={{ gap: 12 }}>
            {store.review?.status === "acknowledged" ? (
              <Card className="p-16">
                <div className="eyebrow">{t("common.approve")}</div>
                <p className="caption" style={{ marginTop: 8 }}>
                  {copy.reviewStored}
                </p>
              </Card>
            ) : (
              <PrimaryButton className="focus-ring" onClick={() => void store.acknowledgeReview()}>
              {t("common.approve")}
            </PrimaryButton>
          )}
          <SecondaryButton className="focus-ring" onClick={() => router.push("/progress")}>
              {t("common.back")} {t("common.progress").toLowerCase()}
          </SecondaryButton>
          </div>
        </section>
      </main>
    </Screen>
  );
}
