const rememberSessionStorageKey = "athlexforce-remember-session";
const trustedAppOrigins = ["http://localhost:3000", "https://coachxsync1.vercel.app"] as const;

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

export function isTrustedAppOrigin(origin: string | null | undefined) {
  return typeof origin === "string" && trustedAppOrigins.includes(origin as (typeof trustedAppOrigins)[number]);
}

export function resolveTrustedAppOrigin(origin: string | null | undefined) {
  return isTrustedAppOrigin(origin) ? origin : null;
}

export function buildTrustedAppUrl(origin: string | null | undefined, pathname: string, fallback = "/") {
  const trustedOrigin = resolveTrustedAppOrigin(origin);
  if (!trustedOrigin) {
    return null;
  }

  return `${trustedOrigin}${resolveSafeInternalPath(pathname, fallback)}`;
}

