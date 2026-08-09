import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import * as ts from "typescript";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libDir = path.join(repoRoot, "lib");
const tempDir = await mkdtemp(path.join(tmpdir(), "coachx-onboarding-tests-"));

async function transpileLibraryChain() {
  const sourceFiles = [
    "anatomy.ts",
    "nutrition-data.ts",
    "workout-data.ts",
    "coachx-data.ts",
    "progress-data.ts",
    "program-service.ts",
    "onboarding-data.ts",
    "profile-settings-data.ts",
    "nutrition-service.ts",
    "auth/navigation.ts",
    "athlete-service.ts",
    "workout-session-service.ts"
  ];

  for (const fileName of sourceFiles) {
    const sourcePath = path.join(libDir, fileName);
    const sourceText = await readFile(sourcePath, "utf8");
    const rewrittenSource = sourceText
      .replaceAll("@/lib/", "./")
      .replaceAll("@/components/", "./components/")
      .replaceAll('from "zod"', `from "${pathToFileURL(path.join(repoRoot, "node_modules/zod/index.js")).href}"`)
      .replaceAll("from 'zod'", `from '${pathToFileURL(path.join(repoRoot, "node_modules/zod/index.js")).href}'`);

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
      .replace(/from "(\.\/[^"]+)"/g, 'from "$1.mjs"')
      .replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'");

    const outputPath = path.join(tempDir, fileName.replace(/\.ts$/, ".mjs"));
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, outputText, "utf8");
  }

  return import(pathToFileURL(path.join(tempDir, "onboarding-data.mjs")).href);
}

const onboarding = await transpileLibraryChain();
const profileSettings = await import(pathToFileURL(path.join(tempDir, "profile-settings-data.mjs")).href);
const nutritionService = await import(pathToFileURL(path.join(tempDir, "nutrition-service.mjs")).href);
const authNavigation = await import(pathToFileURL(path.join(tempDir, "auth/navigation.mjs")).href);
const athleteService = await import(pathToFileURL(path.join(tempDir, "athlete-service.mjs")).href);
const workoutSessionService = await import(pathToFileURL(path.join(tempDir, "workout-session-service.mjs")).href);
const programService = await import(pathToFileURL(path.join(tempDir, "program-service.mjs")).href);

test("onboarding step ordering works", () => {
  assert.equal(onboarding.getNextOnboardingStep("goals"), "training-experience");
  assert.equal(onboarding.getPreviousOnboardingStep("goals"), "profile");
});

test("priority reordering is immediate", () => {
  assert.deepEqual(onboarding.reorderPriorityItems(["Glutes", "Legs", "Abdomen"], 0, 2), ["Legs", "Abdomen", "Glutes"]);
});

test("nutrition safety blocks allergy matches", () => {
  assert.equal(
    onboarding.isNutritionChoiceAllowed({ tags: ["peanuts"] }, onboarding.onboardingDemoState.nutritionPreferences),
    false
  );
  assert.equal(
    onboarding.isNutritionChoiceAllowed({ tags: ["rice"] }, onboarding.onboardingDemoState.nutritionPreferences),
    true
  );
});

test("coach review is required for significant limitations", () => {
  assert.equal(onboarding.shouldRequireCoachReview(onboarding.onboardingDemoState.healthLimitations), false);
  assert.equal(
    onboarding.shouldRequireCoachReview({
      ...onboarding.onboardingDemoState.healthLimitations,
      currentPain: "Knee pain during deep flexion"
    }),
    true
  );
});

test("baseline seed stays separate from progress state", () => {
  const seed = onboarding.buildBaselineSeed(onboarding.onboardingDemoState);
  assert.equal(seed.measurements.length, 4);
  assert.equal(seed.photos.length, 3);
  assert.equal(seed.photos[0].checkpoint, "baseline");
});

test("program activation is explicit", () => {
  const proposal = onboarding.createProgramProposal(onboarding.onboardingDemoState);
  assert.equal(proposal.status, "proposed");
  const active = onboarding.activateProgram(proposal);
  assert.equal(active.status, "active");
  assert.equal(onboarding.finalizeOnboarding(onboarding.onboardingDemoState).progress.status, "complete");
});

test("profile review classifies program-impacting edits", () => {
  const current = profileSettings.createProfileSnapshot();
  const next = {
    ...current,
    trainingPreferences: {
      ...current.trainingPreferences,
      daysPerWeek: 3
    }
  };

  const review = profileSettings.buildProfileReview(current, next, onboarding.onboardingDemoState.program);
  assert.equal(review.classification, "PROGRAM_ADJUSTMENT_RECOMMENDED");
  assert.ok(review.whatChanged.some((change) => change.field === "Training days"));
});

test("nutrition safety changes require coach review", () => {
  const current = profileSettings.createProfileSnapshot();
  const next = {
    ...current,
    nutritionPreferences: {
      ...current.nutritionPreferences,
      allergies: [...current.nutritionPreferences.allergies, "Shellfish"]
    }
  };

  const review = profileSettings.buildProfileReview(current, next, onboarding.onboardingDemoState.program);
  assert.equal(review.classification, "COACH_REVIEW_REQUIRED");
});

test("notification settings preserve categories when the master toggle changes", () => {
  const settings = profileSettings.createNotificationSettings();
  const disabled = {
    ...settings,
    masterEnabled: false
  };

  const revived = profileSettings.reviveProfileSettingsState(JSON.stringify({ notifications: disabled })).notifications;
  assert.equal(revived.masterEnabled, false);
  assert.equal(revived.categories.length, settings.categories.length);
  assert.deepEqual(
    revived.categories.map((category) => category.id),
    settings.categories.map((category) => category.id)
  );
});

test("program update remains explicit", () => {
  const current = profileSettings.createProfileSnapshot();
  const updatedProgram = profileSettings.applySnapshotToProgram(onboarding.onboardingDemoState.program, current);
  assert.equal(updatedProgram.goal, current.goals.mainGoal);
  assert.equal(updatedProgram.status, onboarding.onboardingDemoState.program.status);
});

test("route helpers keep authenticated users out of entry", () => {
  assert.equal(authNavigation.resolveAthleteRouteForStatus("not_started"), "/entry");
  assert.equal(authNavigation.resolveAthleteRouteForStatus("in_progress"), "/onboarding");
  assert.equal(authNavigation.resolveAthleteRouteForStatus("completed"), "/");
});

test("athlete rows preserve profile and snapshot data", () => {
  const snapshot = profileSettings.createProfileSnapshot();
  const profileRow = athleteService.buildAthleteProfileRow("00000000-0000-0000-0000-000000000001", snapshot, "completed", "2026-08-08T08:00:00.000Z");
  const preferencesRow = athleteService.buildAthletePreferencesRow("00000000-0000-0000-0000-000000000001", snapshot);

  assert.equal(profileRow.display_name, snapshot.profile.name);
  assert.equal(profileRow.onboarding_status, "completed");
  assert.equal(preferencesRow.user_id, "00000000-0000-0000-0000-000000000001");
  assert.deepEqual(preferencesRow.goals, snapshot.goals);
});

test("remote snapshots hydrate onboarding state without changing the active program", () => {
  const snapshot = profileSettings.createProfileSnapshot();
  const remote = {
    snapshot,
    onboardingStatus: "in_progress",
    onboardingCompletedAt: null,
    profilePresent: true,
    preferencesPresent: true,
    source: "remote"
  };
  const hydrated = athleteService.mergeRemoteSnapshotIntoOnboardingState(onboarding.onboardingDemoState, remote);

  assert.equal(hydrated.profile.name, snapshot.profile.name);
  assert.equal(hydrated.progress.status, "in-progress");
  assert.equal(hydrated.program.status, onboarding.onboardingDemoState.program.status);
});

test("nutrition snapshots derive training and rest contexts from the program calendar", () => {
  const demoBundle = programService.createDemoProgramBundle("00000000-0000-4000-8000-000000000010");
  const bundleView = programService.createProgramBundleFromRows(
    demoBundle.program,
    demoBundle.phase,
    demoBundle.templates,
    demoBundle.templateExercises,
    demoBundle.scheduledWorkouts
  );
  const trainingSummary = programService.getProgramDaySummary(bundleView, "2026-08-08");
  const restSummary = programService.getProgramDaySummary(bundleView, "2026-08-09");
  const trainingSnapshot = nutritionService.createNutritionStoreSnapshot(
    "2026-08-08",
    trainingSummary,
    "00000000-0000-4000-8000-000000000011",
    bundleView.activeProgram?.id ?? null
  );
  const restSnapshot = nutritionService.createNutritionStoreSnapshot(
    "2026-08-09",
    restSummary,
    "00000000-0000-4000-8000-000000000011",
    bundleView.activeProgram?.id ?? null
  );

  assert.equal(trainingSnapshot.day.dayType, "training");
  assert.equal(restSnapshot.day.dayType, "rest");
  assert.equal(nutritionService.buildNutritionDayView(trainingSnapshot).title, "Glutes + Hamstrings");
  assert.equal(nutritionService.buildNutritionDayView(restSnapshot).title, "Recovery Day");
});

test("nutrition selections update in place and do not duplicate slot records", () => {
  const demoBundle = programService.createDemoProgramBundle("00000000-0000-4000-8000-000000000012");
  const bundleView = programService.createProgramBundleFromRows(
    demoBundle.program,
    demoBundle.phase,
    demoBundle.templates,
    demoBundle.templateExercises,
    demoBundle.scheduledWorkouts
  );
  const summary = programService.getProgramDaySummary(bundleView, "2026-08-08");
  const initial = nutritionService.createNutritionStoreSnapshot(
    "2026-08-08",
    summary,
    "00000000-0000-4000-8000-000000000013",
    bundleView.activeProgram?.id ?? null
  );
  const selected = nutritionService.applyMealSelection(initial, "lunch", "chicken-rice-bowl");
  const changed = nutritionService.applyMealSelection(selected, "lunch", "turkey-wrap");
  const updatedSlot = changed.selections.find((selection) => selection.mealSlotId === "lunch");

  assert.equal(changed.selections.filter((selection) => selection.mealSlotId === "lunch").length, 1);
  assert.equal(updatedSlot?.mealOptionId, "turkey-wrap");
});

test("nutrition hydration, supplement, and meal completion restore through the snapshot boundary", () => {
  const demoBundle = programService.createDemoProgramBundle("00000000-0000-4000-8000-000000000014");
  const bundleView = programService.createProgramBundleFromRows(
    demoBundle.program,
    demoBundle.phase,
    demoBundle.templates,
    demoBundle.templateExercises,
    demoBundle.scheduledWorkouts
  );
  const summary = programService.getProgramDaySummary(bundleView, "2026-08-08");
  const initial = nutritionService.createNutritionStoreSnapshot(
    "2026-08-08",
    summary,
    "00000000-0000-4000-8000-000000000015",
    bundleView.activeProgram?.id ?? null
  );
  const selected = nutritionService.applyMealSelection(initial, "lunch", "chicken-rice-bowl");
  const eaten = nutritionService.markMealEaten(selected, "lunch");
  const completed = nutritionService.markMealCompleted(eaten, "lunch");
  const hydrated = nutritionService.addHydration(completed, 250);
  const supplemented = nutritionService.toggleSupplement(hydrated, "protein-isolate");
  const summaryView = nutritionService.summarizeNutritionDay(supplemented);

  assert.equal(nutritionService.buildNutritionDayView(supplemented).mealSlots.find((slot) => slot.id === "lunch")?.state, "completed");
  assert.equal(summaryView.hydrationMl, hydrated.hydrationLogs.reduce((total, entry) => total + entry.amountMl, 0));
  assert.equal(summaryView.supplementsCompleted, 2);
  assert.equal(summaryView.completedMeals >= 2, true);
});

test("nutrition snapshots survive serialize and revive without changing the source context", () => {
  const demoBundle = programService.createDemoProgramBundle("00000000-0000-4000-8000-000000000016");
  const bundleView = programService.createProgramBundleFromRows(
    demoBundle.program,
    demoBundle.phase,
    demoBundle.templates,
    demoBundle.templateExercises,
    demoBundle.scheduledWorkouts
  );
  const summary = programService.getProgramDaySummary(bundleView, "2026-08-09");
  const initial = nutritionService.createNutritionStoreSnapshot(
    "2026-08-09",
    summary,
    "00000000-0000-4000-8000-000000000017",
    bundleView.activeProgram?.id ?? null
  );
  const roundTrip = nutritionService.reviveNutritionStoreSnapshot(
    nutritionService.serializeNutritionStoreSnapshot(initial),
    "2026-08-09",
    summary
  );

  assert.equal(roundTrip.day.dayType, "rest");
  assert.equal(roundTrip.plan.userId, "00000000-0000-4000-8000-000000000017");
  assert.equal(nutritionService.buildNutritionDayView(roundTrip).dateKey, "2026-08-09");
});

function createFakeWorkoutClient(seedState) {
  const state = structuredClone(seedState);
  state.rpcCalls = [];

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

  function applyOrdering(rows, order) {
    if (!order) {
      return rows;
    }

    return rows.slice().sort((left, right) => {
      const leftValue = left[order.column];
      const rightValue = right[order.column];

      if (leftValue === rightValue) {
        return 0;
      }

      if (leftValue == null) {
        return order.ascending ? -1 : 1;
      }

      if (rightValue == null) {
        return order.ascending ? 1 : -1;
      }

      return order.ascending ? (leftValue > rightValue ? 1 : -1) : leftValue > rightValue ? -1 : 1;
    });
  }

  function runQuery(tableName, query) {
    const table = state[tableName];

    if (query.type === "update") {
      const rows = table.filter((row) => matchesRow(row, query.filters));
      for (const row of rows) {
        Object.assign(row, query.payload);
      }
      return rows;
    }

    if (query.type === "insert") {
      const inserted = query.payload.map((row) => ({
        created_at: "2026-08-09T08:00:00.000Z",
        updated_at: "2026-08-09T08:00:00.000Z",
        ...structuredClone(row)
      }));
      table.push(...inserted);
      return inserted;
    }

    let rows = table.filter((row) => matchesRow(row, query.filters));
    rows = applyOrdering(rows, query.order);
    if (typeof query.limit === "number") {
      rows = rows.slice(0, query.limit);
    }
    return rows;
  }

  function createQuery(tableName) {
    const query = {
      type: "select",
      filters: [],
      payload: null,
      order: null,
      limit: null
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
      order(column, options) {
        query.order = { column, ascending: options?.ascending !== false };
        return api;
      },
      limit(count) {
        query.limit = count;
        return api;
      },
      update(values) {
        query.type = "update";
        query.payload = values;
        return api;
      },
      insert(values) {
        query.type = "insert";
        query.payload = Array.isArray(values) ? values : [values];
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

  return {
    state,
    from(tableName) {
      return createQuery(tableName);
    },
    async rpc(name, args) {
      state.rpcCalls.push({ name, args });

      if (name === "complete_workout_session") {
        const row = state.workout_sessions.find((item) => item.id === args.p_workout_session_id);
        if (!row) {
          return { data: null, error: new Error("Not found") };
        }

        row.status = "completed";
        row.completed_at = "2026-08-09T10:00:00.000Z";
        row.duration_seconds = args.p_duration_seconds ?? row.duration_seconds;
        row.notes = args.p_notes ?? row.notes;
        return { data: row, error: null };
      }

      return { data: null, error: new Error("Unexpected rpc") };
    }
  };
}

test("workout set saves update the same row and complete the exercise only when all sets are done", async () => {
  const client = createFakeWorkoutClient({
    workout_sessions: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        user_id: "00000000-0000-4000-8000-000000000002",
        scheduled_workout_id: "00000000-0000-4000-8000-000000000003",
        workout_template_id: "00000000-0000-4000-8000-000000000004",
        status: "in_progress",
        started_at: "2026-08-09T08:00:00.000Z",
        completed_at: null,
        duration_seconds: null,
        notes: null,
        session_metadata: {},
        created_at: "2026-08-09T08:00:00.000Z",
        updated_at: "2026-08-09T08:00:00.000Z"
      }
    ],
    workout_session_exercises: [
      {
        id: "00000000-0000-4000-8000-000000000005",
        workout_session_id: "00000000-0000-4000-8000-000000000001",
        prescribed_template_exercise_id: "00000000-0000-4000-8000-000000000006",
        prescribed_exercise_key: "barbell-hip-thrust",
        performed_exercise_key: "barbell-hip-thrust",
        sort_order: 1,
        target_sets: 2,
        rep_min: 8,
        rep_max: 10,
        rir_min: 1,
        rir_max: 2,
        rest_seconds: 120,
        notes: null,
        swap_reason: null,
        status: "planned",
        started_at: null,
        completed_at: null,
        created_at: "2026-08-09T08:00:00.000Z",
        updated_at: "2026-08-09T08:00:00.000Z"
      }
    ],
    workout_sets: [
      {
        id: "00000000-0000-4000-8000-000000000007",
        workout_session_exercise_id: "00000000-0000-4000-8000-000000000005",
        set_number: 1,
        status: "planned",
        weight_kg: null,
        reps: null,
        rir: null,
        completed_at: null,
        notes: null,
        created_at: "2026-08-09T08:00:00.000Z",
        updated_at: "2026-08-09T08:00:00.000Z"
      }
    ]
  });

  await workoutSessionService.saveWorkoutSet(client, {
    workoutSessionExerciseId: "00000000-0000-4000-8000-000000000005",
    workoutSetId: "00000000-0000-4000-8000-000000000007",
    setNumber: 1,
    payload: { kilograms: "80", reps: "10", rir: "2" }
  });

  assert.equal(client.state.workout_sets.length, 1);
  assert.equal(client.state.workout_sets[0].weight_kg, 80);
  assert.equal(client.state.workout_session_exercises[0].status, "planned");
  assert.equal(workoutSessionService.isWorkoutSessionExerciseComplete(2, client.state.workout_sets), false);

  await workoutSessionService.saveWorkoutSet(client, {
    workoutSessionExerciseId: "00000000-0000-4000-8000-000000000005",
    workoutSetId: "00000000-0000-4000-8000-000000000007",
    setNumber: 1,
    payload: { kilograms: "85", reps: "10", rir: "1" }
  });

  assert.equal(client.state.workout_sets.length, 1);
  assert.equal(client.state.workout_sets[0].weight_kg, 85);
  assert.equal(workoutSessionService.isWorkoutSessionExerciseComplete(2, client.state.workout_sets), false);

  await workoutSessionService.saveWorkoutSet(client, {
    workoutSessionExerciseId: "00000000-0000-4000-8000-000000000005",
    setNumber: 2,
    payload: { kilograms: "85", reps: "9", rir: "1" }
  });

  assert.equal(client.state.workout_sets.length, 2);
  assert.equal(workoutSessionService.isWorkoutSessionExerciseComplete(2, client.state.workout_sets), true);
});

test("exercise swaps preserve the prescribed identity", async () => {
  const client = createFakeWorkoutClient({
    workout_sessions: [],
    workout_session_exercises: [
      {
        id: "00000000-0000-4000-8000-000000000005",
        workout_session_id: "00000000-0000-4000-8000-000000000001",
        prescribed_template_exercise_id: "00000000-0000-4000-8000-000000000006",
        prescribed_exercise_key: "barbell-hip-thrust",
        performed_exercise_key: "barbell-hip-thrust",
        sort_order: 1,
        target_sets: 4,
        rep_min: 8,
        rep_max: 10,
        rir_min: 1,
        rir_max: 2,
        rest_seconds: 120,
        notes: null,
        swap_reason: null,
        status: "planned",
        started_at: null,
        completed_at: null,
        created_at: "2026-08-09T08:00:00.000Z",
        updated_at: "2026-08-09T08:00:00.000Z"
      }
    ],
    workout_sets: []
  });

  const swapped = await workoutSessionService.swapWorkoutSessionExercise(client, {
    workoutSessionExerciseId: "00000000-0000-4000-8000-000000000005",
    performedExerciseKey: "glute-drive-machine",
    swapReason: "pain"
  });

  assert.equal(swapped.prescribed_exercise_key, "barbell-hip-thrust");
  assert.equal(swapped.performed_exercise_key, "glute-drive-machine");
  assert.equal(client.state.workout_session_exercises[0].performed_exercise_key, "glute-drive-machine");
});

test("workout completion persists through the RPC boundary", async () => {
  const client = createFakeWorkoutClient({
    workout_sessions: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        user_id: "00000000-0000-4000-8000-000000000002",
        scheduled_workout_id: "00000000-0000-4000-8000-000000000003",
        workout_template_id: "00000000-0000-4000-8000-000000000004",
        status: "in_progress",
        started_at: "2026-08-09T08:00:00.000Z",
        completed_at: null,
        duration_seconds: null,
        notes: null,
        session_metadata: {},
        created_at: "2026-08-09T08:00:00.000Z",
        updated_at: "2026-08-09T08:00:00.000Z"
      }
    ],
    workout_session_exercises: [],
    workout_sets: []
  });

  const completed = await workoutSessionService.completeWorkoutSession(client, {
    workoutSessionId: "00000000-0000-4000-8000-000000000001",
    durationSeconds: 3600,
    notes: "done"
  });

  assert.equal(completed.status, "completed");
  assert.equal(client.state.workout_sessions[0].status, "completed");
  assert.equal(client.state.workout_sessions[0].duration_seconds, 3600);
});

await rm(tempDir, { recursive: true, force: true });
