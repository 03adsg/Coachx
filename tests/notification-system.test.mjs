import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import * as ts from "typescript";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libDir = path.join(repoRoot, "lib");
const tempDir = await mkdtemp(path.join(tmpdir(), "coachx-notification-tests-"));

function toModuleUrl(targetPath) {
  return pathToFileURL(targetPath).href;
}

function rewriteImport(specifier, currentOutputPath) {
  const currentDir = path.dirname(currentOutputPath);
  const normalize = (targetPath) => {
    const relativePath = path.relative(currentDir, targetPath).replaceAll(path.sep, "/");
    return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
  };

  if (specifier.startsWith("@/lib/")) {
    const relativeSourcePath = specifier.slice("@/lib/".length);
    return normalize(path.join(tempDir, `${relativeSourcePath}.mjs`));
  }

  if (specifier.startsWith("@/components/")) {
    const relativeSourcePath = specifier.slice("@/components/".length);
    return normalize(path.join(tempDir, "components", `${relativeSourcePath}.mjs`));
  }

  if (specifier === "zod") {
    return toModuleUrl(path.join(repoRoot, "node_modules/zod/index.js"));
  }

  return specifier;
}

async function transpileLibraryChain() {
  const sourceFiles = [
    "i18n.ts",
    "auth/session-policy.ts",
    "notification-system.ts",
    "notification-preference-service.ts",
    "notification-browser.ts"
  ];

  for (const fileName of sourceFiles) {
    const sourcePath = path.join(libDir, fileName);
    const sourceText = await readFile(sourcePath, "utf8");
    const outputPath = path.join(tempDir, fileName.replace(/\.ts$/, ".mjs"));
    const rewrittenSource = sourceText.replace(/from\s+["'](@\/[^"']+)["']/g, (_, specifier) => `from "${rewriteImport(specifier, outputPath)}"`).replace(/from\s+["']zod["']/g, `from "${toModuleUrl(path.join(repoRoot, "node_modules/zod/index.js"))}"`);

    const transpiled = ts.transpileModule(rewrittenSource, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.Preserve,
        esModuleInterop: true
      },
      fileName
    }).outputText;

    const outputText = transpiled
      .replace(/from "((?:\.{1,2}\/)[^"]+)"/g, (_, specifier) => `from "${specifier.endsWith(".mjs") ? specifier : `${specifier}.mjs`}"`)
      .replace(/from '((?:\.{1,2}\/)[^']+)'/g, (_, specifier) => `from '${specifier.endsWith(".mjs") ? specifier : `${specifier}.mjs`}'`);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, outputText, "utf8");
  }

  return {
    i18n: await import(toModuleUrl(path.join(tempDir, "i18n.mjs"))),
    sessionPolicy: await import(toModuleUrl(path.join(tempDir, "auth/session-policy.mjs"))),
    notificationSystem: await import(toModuleUrl(path.join(tempDir, "notification-system.mjs"))),
    notificationPreferences: await import(toModuleUrl(path.join(tempDir, "notification-preference-service.mjs"))),
    notificationBrowser: await import(toModuleUrl(path.join(tempDir, "notification-browser.mjs")))
  };
}

const {
  notificationSystem,
  notificationPreferences,
  notificationBrowser
} = await transpileLibraryChain();

function createFakeReminderClient(initialRows = []) {
  const state = {
    notification_reminders: structuredClone(initialRows)
  };

  function createQuery(tableName) {
    const query = {
      type: "select",
      payload: null,
      filters: [],
      conflict: []
    };

    const api = {
      select() {
        return api;
      },
      eq(column, value) {
        query.filters.push({ kind: "eq", column, value });
        return api;
      },
      in(column, values) {
        query.filters.push({ kind: "in", column, values });
        return api;
      },
      order() {
        return api;
      },
      upsert(values, options) {
        query.type = "upsert";
        query.payload = Array.isArray(values) ? values : [values];
        query.conflict = String(options?.onConflict ?? "").split(",").map((value) => value.trim()).filter(Boolean);
        return api;
      },
      async maybeSingle() {
        const rows = runQuery(tableName, query);
        return { data: rows[0] ?? null, error: null };
      },
      async single() {
        const rows = runQuery(tableName, query);
        return { data: rows[0] ?? null, error: rows[0] ? null : new Error("Not found") };
      }
    };

    return api;
  }

  function matchesRow(row, filters) {
    return filters.every((filter) => {
      if (filter.kind === "eq") {
        return row[filter.column] === filter.value;
      }

      if (filter.kind === "in") {
        return filter.values.includes(row[filter.column]);
      }

      return true;
    });
  }

  function runQuery(tableName, query) {
    const table = state[tableName];

    if (query.type === "upsert") {
      const rows = [];
      for (const candidate of query.payload) {
        const existing = table.find((row) => query.conflict.every((column) => row[column] === candidate[column]));
        if (existing) {
          Object.assign(existing, candidate);
          rows.push(existing);
        } else {
          const next = {
            id: candidate.id ?? crypto.randomUUID(),
            created_at: candidate.created_at ?? "2026-08-20T00:00:00.000Z",
            updated_at: candidate.updated_at ?? "2026-08-20T00:00:00.000Z",
            ...structuredClone(candidate)
          };
          table.push(next);
          rows.push(next);
        }
      }
      return rows;
    }

    return table.filter((row) => matchesRow(row, query.filters));
  }

  return {
    state,
    from(tableName) {
      return createQuery(tableName);
    }
  };
}

test("notification capability and permission helpers stay canonical", () => {
  assert.equal(notificationSystem.normalizeBrowserPermissionState("default"), "PERMISSION_DEFAULT");
  assert.equal(notificationSystem.normalizeBrowserPermissionState("granted"), "PERMISSION_GRANTED");
  assert.equal(notificationSystem.normalizeBrowserPermissionState("denied"), "PERMISSION_DENIED");

  assert.equal(notificationSystem.deriveNotificationCapabilityState(true, true, true, false, false), "SUPPORTED");
  assert.equal(notificationSystem.deriveNotificationCapabilityState(false, true, true, false, true), "INSTALL_REQUIRED");
  assert.equal(notificationSystem.deriveNotificationCapabilityState(true, false, true, false, false), "UNSUPPORTED");
});

test("quiet hours resolve across midnight without flipping the wrong window", () => {
  const quietHours = { enabled: true, start: "22:00", end: "07:00", timezone: "Device local" };
  assert.equal(notificationSystem.resolveQuietHoursActive(new Date(2026, 7, 20, 21, 30), quietHours), false);
  assert.equal(notificationSystem.resolveQuietHoursActive(new Date(2026, 7, 20, 23, 30), quietHours), true);
  assert.equal(notificationSystem.resolveQuietHoursActive(new Date(2026, 7, 20, 6, 30), quietHours), true);
});

test("notification path allowlist blocks external destinations", () => {
  assert.equal(notificationSystem.isAllowedNotificationPath("/nutrition"), true);
  assert.equal(notificationSystem.isAllowedNotificationPath("/workout/abc"), true);
  assert.equal(notificationSystem.isAllowedNotificationPath("https://evil.example"), false);
});

test("delivery truth preserves master-off and blocked-browser states", () => {
  const settings = notificationSystem.createNotificationPreferences("en");

  assert.equal(
    notificationPreferences.buildNotificationDeliveryTruth(
      { ...settings, masterEnabled: false },
      notificationSystem.createNotificationRuntimeState({ permission: "PERMISSION_GRANTED", subscription: "SUBSCRIBED", capability: "SUPPORTED" })
    ),
    "DISABLED_BY_USER"
  );

  assert.equal(
    notificationPreferences.buildNotificationDeliveryTruth(
      settings,
      notificationSystem.createNotificationRuntimeState({ permission: "PERMISSION_DENIED", subscription: "NOT_SUBSCRIBED", capability: "SUPPORTED" })
    ),
    "IN_APP_ONLY"
  );

  assert.equal(
    notificationPreferences.buildNotificationDeliveryTruth(
      settings,
      notificationSystem.createNotificationRuntimeState({ permission: "PERMISSION_GRANTED", subscription: "NOT_SUBSCRIBED", capability: "SUPPORTED", online: true })
    ),
    "OFFLINE_SYNC"
  );
});

test("preference rows preserve the canonical category and timing state", () => {
  const settings = notificationSystem.createNotificationPreferences("en");
  const row = notificationPreferences.buildNotificationPreferencesRow("00000000-0000-4000-8000-000000000001", {
    ...settings,
    masterEnabled: false,
    workoutLeadMinutes: 60,
    hydrationIntervalMinutes: 180,
    quietHours: { ...settings.quietHours, start: "21:00", end: "06:00", timezone: "Europe/Madrid" },
    categories: settings.categories.map((category) => ({ ...category, enabled: category.id === "meals" }))
  });

  const revived = notificationPreferences.notificationPreferencesRowToSettings({
    id: "00000000-0000-4000-8000-000000000001",
    user_id: "00000000-0000-4000-8000-000000000001",
    master_enabled: row.master_enabled ?? false,
    workout_enabled: row.workout_enabled ?? false,
    meals_enabled: row.meals_enabled ?? false,
    checkin_enabled: row.checkin_enabled ?? false,
    sleep_enabled: row.sleep_enabled ?? false,
    workout_reminders_enabled: row.workout_reminders_enabled ?? false,
    program_updates_enabled: row.program_updates_enabled ?? false,
    weekly_check_in_enabled: row.weekly_check_in_enabled ?? false,
    measurements_enabled: row.measurements_enabled ?? false,
    progress_photos_enabled: row.progress_photos_enabled ?? false,
    phase_reviews_enabled: row.phase_reviews_enabled ?? false,
    nutrition_reminders_enabled: row.nutrition_reminders_enabled ?? false,
    hydration_enabled: row.hydration_enabled ?? false,
    supplements_enabled: row.supplements_enabled ?? false,
    sleep_routine_enabled: row.sleep_routine_enabled ?? false,
    adaptive_alerts_enabled: row.adaptive_alerts_enabled ?? false,
    reminder_intensity: row.reminder_intensity ?? "minimal",
    quiet_hours_enabled: row.quiet_hours_enabled ?? false,
    quiet_start: row.quiet_start ?? null,
    quiet_end: row.quiet_end ?? null,
    timezone: row.timezone ?? null,
    in_app_enabled: row.in_app_enabled ?? true,
    workout_lead_minutes: row.workout_lead_minutes ?? 30,
    hydration_interval_minutes: row.hydration_interval_minutes ?? 120,
    created_at: "2026-08-20T00:00:00.000Z",
    updated_at: "2026-08-20T00:00:00.000Z"
  }, "en");

  assert.equal(revived.masterEnabled, false);
  assert.equal(revived.workoutLeadMinutes, 60);
  assert.equal(revived.hydrationIntervalMinutes, 180);
  assert.equal(revived.quietHours.start, "21:00");
  assert.equal(revived.categories.find((category) => category.id === "meals")?.enabled, true);
  assert.equal(revived.categories.find((category) => category.id === "sleep")?.enabled, false);
});

test("push subscription payloads stay browser-safe", () => {
  const payload = notificationBrowser.buildPushSubscriptionPayload({
    endpoint: "https://push.example/subscription",
    toJSON() {
      return {
        endpoint: this.endpoint,
        expirationTime: 1700000000000,
        keys: {
          p256dh: "abc",
          auth: "def"
        }
      };
    }
  });

  assert.equal(payload.endpoint, "https://push.example/subscription");
  assert.equal(payload.p256dh, "abc");
  assert.equal(payload.auth, "def");
  assert.equal(payload.expiration_time, new Date(1700000000000).toISOString());
});

test("reminder upsert dedupes by logical key", async () => {
  const client = createFakeReminderClient();

  const first = await notificationPreferences.saveNotificationReminder(client, {
    user_id: "00000000-0000-4000-8000-000000000001",
    category: "meals",
    destination_path: "/nutrition",
    title: "Meal reminder",
    body: "Open nutrition",
    scheduled_for: "2026-08-20T08:00:00.000Z",
    dedupe_key: "meals-20260820-breakfast",
    payload: { source: "day-slot" }
  });

  const second = await notificationPreferences.saveNotificationReminder(client, {
    user_id: "00000000-0000-4000-8000-000000000001",
    category: "meals",
    destination_path: "/nutrition",
    title: "Meal reminder updated",
    body: "Open nutrition now",
    scheduled_for: "2026-08-20T08:00:00.000Z",
    dedupe_key: "meals-20260820-breakfast",
    payload: { source: "day-slot", retry: true }
  });

  assert.equal(client.state.notification_reminders.length, 1);
  assert.equal(first.id, second.id);
  assert.equal(second.title, "Meal reminder updated");
  assert.equal(second.payload.retry, true);
});
