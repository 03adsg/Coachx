const rememberSessionStorageKey = "athlexforce-remember-session";

export function readRememberSessionPreference(defaultValue = true) {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  const stored = window.localStorage.getItem(rememberSessionStorageKey);
  if (stored == null) {
    return defaultValue;
  }

  return stored !== "false";
}

export function writeRememberSessionPreference(rememberSession: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(rememberSessionStorageKey, rememberSession ? "true" : "false");
}

export function getRememberSessionPreferenceLabel(rememberSession: boolean) {
  return rememberSession ? "Keep me signed in" : "Sign out when this browser session ends";
}

export function resolveSafeInternalPath(nextPath: string | null | undefined, fallback = "/") {
  if (!nextPath || typeof nextPath !== "string") {
    return fallback;
  }

  if (!nextPath.startsWith("/")) {
    return fallback;
  }

  if (nextPath.startsWith("//") || nextPath.includes("://")) {
    return fallback;
  }

  return nextPath;
}

