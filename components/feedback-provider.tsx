"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { useLocale } from "@/components/locale-provider";
import {
  clearFeedbackMemoryForAction,
  buildFeedbackNotice,
  createInitialFeedbackMemory,
  feedbackMemoryStorageKey,
  getFeedbackActionDefaults,
  getFeedbackActionLabel,
  reviveFeedbackMemory,
  serializeFeedbackMemory,
  type FeedbackActionId,
  type FeedbackIntent,
  type FeedbackMemoryState,
  type FeedbackNotice
} from "@/lib/feedback";

interface FeedbackStoreValue {
  memory: FeedbackMemoryState;
  recent: FeedbackNotice[];
  emitFeedback: (intent: FeedbackIntent) => string;
  emitSuccess: (actionId: FeedbackActionId, title: string, detail?: string | null) => string;
  emitError: (actionId: FeedbackActionId, title: string, detail?: string | null) => string;
  clearFeedback: () => void;
  clearFeedbackForAction: (actionId: FeedbackActionId) => void;
  dismissFeedback: (id: string) => void;
}

const FeedbackContext = createContext<FeedbackStoreValue | null>(null);
const FEEDBACK_EVENT_NAME = "athlexforce-feedback";
const FEEDBACK_CLEAR_EVENT_NAME = "athlexforce-feedback-clear";
const DEFAULT_DISPLAY_MS = 4200;
const HERO_DISPLAY_MS = 6200;

function hasWindow() {
  return typeof window !== "undefined";
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const reducedMotion = useReducedMotion();
  const [memory, setMemory] = useState<FeedbackMemoryState>(() => {
    if (!hasWindow()) {
      return createInitialFeedbackMemory();
    }

    return reviveFeedbackMemory(window.sessionStorage.getItem(feedbackMemoryStorageKey()));
  });
  const [queue, setQueue] = useState<FeedbackNotice[]>(() => memory.recent.slice(0, 4));

  useEffect(() => {
    if (!hasWindow()) {
      return;
    }

    window.sessionStorage.setItem(feedbackMemoryStorageKey(), serializeFeedbackMemory(memory));
  }, [memory]);

  const enqueueNotice = useCallback(
    (notice: FeedbackNotice) => {
      setMemory((current) => {
        const recent = [notice, ...current.recent.filter((entry) => entry.dedupeKey !== notice.dedupeKey)].slice(0, 20);
        return {
          recent,
          lastByAction: {
            ...current.lastByAction,
            [notice.actionId]: notice
          }
        };
      });

      setQueue((current) => {
        const deduped = current.filter((entry) => entry.dedupeKey !== notice.dedupeKey);
        return [notice, ...deduped].slice(0, 3);
      });

      if (!reducedMotion) {
        window.setTimeout(() => {
          setQueue((current) => current.filter((entry) => entry.id !== notice.id));
        }, notice.placement === "hero" ? HERO_DISPLAY_MS : DEFAULT_DISPLAY_MS);
      }
    },
    [reducedMotion]
  );

  useEffect(() => {
    if (!hasWindow()) {
      return;
    }

    const handleFeedback = (event: Event) => {
      const customEvent = event as CustomEvent<FeedbackIntent>;
      if (!customEvent.detail?.actionId) {
        return;
      }

      const notice = buildFeedbackNotice(locale, customEvent.detail);
      enqueueNotice(notice);
    };

    window.addEventListener(FEEDBACK_EVENT_NAME, handleFeedback as EventListener);
    return () => window.removeEventListener(FEEDBACK_EVENT_NAME, handleFeedback as EventListener);
  }, [enqueueNotice, locale]);

  useEffect(() => {
    if (!hasWindow()) {
      return;
    }

    const handleClearFeedback = (event: Event) => {
      const customEvent = event as CustomEvent<Pick<FeedbackIntent, "actionId">>;
      if (!customEvent.detail?.actionId) {
        return;
      }

      const actionId = customEvent.detail.actionId;
      setMemory((current) => clearFeedbackMemoryForAction(current, actionId));
      setQueue((current) => current.filter((entry) => entry.actionId !== actionId));
    };

    window.addEventListener(FEEDBACK_CLEAR_EVENT_NAME, handleClearFeedback as EventListener);
    return () => window.removeEventListener(FEEDBACK_CLEAR_EVENT_NAME, handleClearFeedback as EventListener);
  }, []);

  const emitFeedback = useCallback(
    (intent: FeedbackIntent) => {
      const notice = buildFeedbackNotice(locale, intent);
      enqueueNotice(notice);
      return notice.id;
    },
    [enqueueNotice, locale]
  );

  const emitSuccess = useCallback(
    (actionId: FeedbackActionId, title: string, detail?: string | null) => {
      return emitFeedback({ actionId, title, detail, kind: "success" });
    },
    [emitFeedback]
  );

  const emitError = useCallback(
    (actionId: FeedbackActionId, title: string, detail?: string | null) => {
      return emitFeedback({ actionId, title, detail, kind: "error" });
    },
    [emitFeedback]
  );

  const dismissFeedback = useCallback((id: string) => {
    setQueue((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clearFeedbackForAction = useCallback((actionId: FeedbackActionId) => {
    setMemory((current) => clearFeedbackMemoryForAction(current, actionId));
    setQueue((current) => current.filter((entry) => entry.actionId !== actionId));
  }, []);

  const clearFeedback = useCallback(() => {
    setQueue([]);
  }, []);

  const value = useMemo<FeedbackStoreValue>(
    () => ({
      memory,
      recent: queue,
      emitFeedback,
      emitSuccess,
      emitError,
      clearFeedback,
      clearFeedbackForAction,
      dismissFeedback
    }),
    [clearFeedback, clearFeedbackForAction, dismissFeedback, emitError, emitFeedback, emitSuccess, memory, queue]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <FeedbackTray notices={queue} onDismiss={dismissFeedback} />
    </FeedbackContext.Provider>
  );
}

function FeedbackTray({ notices, onDismiss }: { notices: FeedbackNotice[]; onDismiss: (id: string) => void }) {
  if (notices.length === 0) {
    return null;
  }

  return (
    <div className="feedback-tray" aria-live="polite" aria-relevant="additions removals">
      {notices.map((notice) => (
        <article
          key={notice.id}
          className={`feedback-toast feedback-toast--${notice.kind} feedback-toast--${notice.placement}`}
          role={notice.ariaLive === "assertive" ? "alert" : "status"}
        >
          <div className="feedback-toast__icon" aria-hidden="true">
            {notice.kind === "error" ? "error" : notice.kind === "warning" ? "warning" : notice.kind === "pending" ? "progress_activity" : "check_circle"}
          </div>
          <div className="feedback-toast__content">
            <div className="feedback-toast__title">{notice.title}</div>
            {notice.detail ? <p className="feedback-toast__detail">{notice.detail}</p> : null}
          </div>
          <div className="feedback-toast__actions">
            {notice.reversible && notice.undoLabel ? (
              <button className="feedback-toast__undo focus-ring" type="button" onClick={() => onDismiss(notice.id)}>
                {notice.undoLabel}
              </button>
            ) : null}
            <button className="feedback-toast__close focus-ring" type="button" aria-label="Dismiss feedback" onClick={() => onDismiss(notice.id)}>
              ×
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export function useFeedbackStore() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedbackStore must be used within FeedbackProvider");
  }

  return context;
}

export function publishFeedback(intent: FeedbackIntent) {
  if (!hasWindow()) {
    return;
  }

  window.dispatchEvent(new CustomEvent<FeedbackIntent>(FEEDBACK_EVENT_NAME, { detail: intent }));
}

export function publishFeedbackClear(actionId: FeedbackActionId) {
  if (!hasWindow()) {
    return;
  }

  window.dispatchEvent(new CustomEvent<Pick<FeedbackIntent, "actionId">>(FEEDBACK_CLEAR_EVENT_NAME, { detail: { actionId } }));
}

export function publishFeedbackError(actionId: FeedbackActionId, title: string, detail?: string | null) {
  publishFeedback({ actionId, title, detail, kind: "error" });
}

export function publishFeedbackSuccess(actionId: FeedbackActionId, title: string, detail?: string | null) {
  publishFeedback({ actionId, title, detail, kind: "success" });
}

export function getFeedbackTrayCopy(locale: Parameters<typeof getFeedbackActionLabel>[0], actionId: FeedbackActionId) {
  return {
    actionLabel: getFeedbackActionLabel(locale, actionId),
    defaults: getFeedbackActionDefaults(actionId)
  };
}
