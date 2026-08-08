import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
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
    "onboarding-data.ts",
    "profile-settings-data.ts"
  ];

  for (const fileName of sourceFiles) {
    const sourcePath = path.join(libDir, fileName);
    const sourceText = await readFile(sourcePath, "utf8");
    const rewrittenSource = sourceText
      .replaceAll("@/lib/", "./")
      .replaceAll("@/components/", "./components/");

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

    await writeFile(path.join(tempDir, fileName.replace(/\.ts$/, ".mjs")), outputText, "utf8");
  }

  return import(pathToFileURL(path.join(tempDir, "onboarding-data.mjs")).href);
}

const onboarding = await transpileLibraryChain();
const profileSettings = await import(pathToFileURL(path.join(tempDir, "profile-settings-data.mjs")).href);

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

await rm(tempDir, { recursive: true, force: true });
