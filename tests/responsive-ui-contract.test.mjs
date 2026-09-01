import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readRepoFile(relativePath) {
  return readFile(path.join(repoRoot, relativePath), "utf8");
}

test("responsive UI contract is documented with the required viewport and QA rules", async () => {
  const contract = await readRepoFile("docs/RESPONSIVE_UI_CONTRACT.md");

  assert.match(contract, /375px/);
  assert.match(contract, /390px/);
  assert.match(contract, /430px/);
  assert.match(contract, /768px/);
  assert.match(contract, /sticky CTA/i);
  assert.match(contract, /no horizontal overflow/i);
  assert.match(contract, /pnpm build/i);
});

test("workout responsive shell keeps the browser scroll and sticky CTA contract in source", async () => {
  const css = await readRepoFile("app/globals.css");
  const workoutPage = await readRepoFile("app/workout/[sessionId]/exercise/[exerciseId]/page.tsx");
  const workoutOverview = await readRepoFile("app/workout/[sessionId]/page.tsx");
  const workoutData = await readRepoFile("lib/workout-data.ts");
  const numericControls = await readRepoFile("components/numeric-controls.tsx");

  assert.match(css, /\.screen > main \{/);
  assert.match(css, /overflow-y: auto;/);
  assert.match(css, /\.sticky-action--hidden \{/);
  assert.match(css, /\.workout-active-shell \{/);
  assert.match(css, /padding-bottom: calc\(224px \+ var\(--safe-bottom\)\);/);
  assert.match(css, /\.card\.workout-set-row--editing \{/);
  assert.match(css, /display: grid;/);
  assert.match(css, /background: transparent;/);

  assert.match(workoutPage, /stickyActionHidden/);
  assert.match(workoutPage, /requestAnimationFrame/);
  assert.match(workoutPage, /getExerciseProgressionTarget/);
  assert.match(workoutPage, /workout-set-row--editing/);
  assert.match(workoutPage, /previewExerciseBody/);
  assert.match(workoutOverview, /resumeSession/);

  assert.match(workoutData, /localizedProgressionTargets/);
  assert.match(workoutData, /getExerciseProgressionTarget/);
  assert.match(workoutData, /Keep the same steps with cleaner control\./);
  assert.match(workoutData, /Hold the same steps with cleaner control\./);

  assert.match(numericControls, /const nextHelper = error \?\? helper \?\? "";?/);
  assert.match(numericControls, /const nextHelper = helper \?\? "";?/);
});

test("progress analytics preserves mobile geometry, touch, and reduced-motion contracts", async () => {
  const css = await readRepoFile("app/globals.css");
  const immersionCard = await readRepoFile("components/progress-immersion-card.tsx");
  const performanceScreen = await readRepoFile("components/performance-analytics-screen.tsx");
  const trendsScreen = await readRepoFile("components/progress-trends-screen.tsx");

  assert.match(css, /\.analytics-chart-stack\s*\{[\s\S]*?grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(css, /\.analytics-range-chip\s*\{[\s\S]*?min-height: 44px;/);
  assert.match(css, /\.progress-mini-action\s*\{[\s\S]*?min-height: 44px;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.progress-immersion-ring\s*\{[\s\S]*?width: 100%;[\s\S]*?justify-self: stretch;[\s\S]*?justify-items: center;/);
  assert.match(css, /\.progress-immersion-ring__svg\s*\{[\s\S]*?width: 184px;[\s\S]*?height: 184px;/);
  assert.match(css, /\.progress-immersion-ring__center\s*\{[\s\S]*?inset: 110px auto auto 50%;/);

  assert.match(immersionCard, /pathLength=\{100\}/);
  assert.match(immersionCard, /strokeDasharray = `\$\{length\} \$\{length\}`/);
  assert.match(immersionCard, /progress-immersion-card__hero/);
  assert.match(immersionCard, /targetStateCopy/);
  assert.doesNotMatch(immersionCard, /target\.state\.toUpperCase\(\)/);
  assert.match(performanceScreen, /className="analytics-chart-stack"/);
  assert.match(trendsScreen, /className="analytics-chart-stack"/);
});

test("bottom navigation keeps route ownership and current semantics aligned", async () => {
  const bottomNav = await readRepoFile("components/bottom-nav.tsx");
  const nutritionScreen = await readRepoFile("components/nutrition-screen.tsx");

  for (const tab of ["today", "calendar", "nutrition", "progress", "profile"]) {
    assert.match(bottomNav, new RegExp(`id: \"${tab}\"`));
  }
  assert.match(bottomNav, /aria-current=\{tab\.id === active \? \"page\" : undefined\}/);
  assert.equal((nutritionScreen.match(/activeTab=\"nutrition\"/g) ?? []).length, 2);
  assert.doesNotMatch(nutritionScreen, /activeTab=\"calendar\"/);
});
