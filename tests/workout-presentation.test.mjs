import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import * as ts from "typescript";

const sourcePath = path.resolve("lib/workout-presentation.ts");
const outputPath = path.join(tmpdir(), `athlexforce-workout-presentation-${Date.now()}.mjs`);
const source = await readFile(sourcePath, "utf8");
await writeFile(outputPath, ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: sourcePath
}).outputText, "utf8");
const presentation = await import(pathToFileURL(outputPath).href);

const definition = {
  id: "glute-drive-machine",
  name: "Glute Drive Machine",
  equipment: "machine",
  primaryMuscles: ["glutes"],
  secondaryMuscles: ["hamstrings"],
  setup: ["Set up"],
  howToDo: ["Move"],
  coachCues: ["Brace"],
  commonMistakes: ["Rush"],
  summary: "Summary"
};

test("semantic exercise presentation humanizes equipment and muscles in every locale", () => {
  const expected = {
    es: ["MÁQUINA", "Glúteos"],
    ca: ["MÀQUINA", "Glutis"],
    en: ["Machine", "Glutes"],
    de: ["Maschine", "Gesäß"]
  };

  for (const [locale, [equipment, muscle]] of Object.entries(expected)) {
    const localized = presentation.getLocalizedExercisePresentation(definition, locale);
    assert.equal(localized.equipmentLabel, equipment);
    assert.equal(localized.primaryMuscles[0], muscle);
    assert.notEqual(localized.label, "MACHINE");
  }
});

test("unknown semantic values fall back deterministically without crashing", () => {
  const unknown = presentation.getLocalizedExercisePresentation({ ...definition, equipment: "unknown", primaryMuscles: ["unknown"] }, "de");
  assert.equal(unknown.equipmentLabel, "Unknown");
  assert.equal(unknown.primaryMuscles[0], "Unknown");
});

await rm(outputPath, { force: true });
