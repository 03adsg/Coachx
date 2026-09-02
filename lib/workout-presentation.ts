import type { ExerciseAlternative, ExerciseDefinition, WorkoutEquipment } from "@/lib/workout-data";

const names: Record<string, string> = {
  "Hip Thrust": "Empuje de cadera", "Romanian Deadlift": "Peso muerto rumano", "Bulgarian Split Squat": "Sentadilla búlgara",
  "Seated Leg Curl": "Curl femoral sentado", "Cable Kickback": "Patada de glúteo en polea", "Walking Lunge": "Zancada caminando",
  "Glute Drive Machine": "Máquina de empuje de glúteo", "Smith Hip Thrust": "Empuje de cadera en máquina Smith",
  "Dumbbell Hip Thrust": "Empuje de cadera con mancuernas", "Cable Pull Through": "Pull-through en polea", "Lat Pulldown": "Jalón al pecho", "Chest Press": "Press de pecho"
};
const equipment: Record<WorkoutEquipment, string> = { barbell: "BARRA", machine: "MÁQUINA", smith: "SMITH", dumbbells: "MANCUERNAS", cable: "POLEA", bodyweight: "PESO CORPORAL" };
const muscles: Record<string, string> = { glutes: "Glúteos", back: "Espalda", chest: "Pecho", hamstrings: "Isquiotibiales", quadriceps: "Cuádriceps", calves: "Pantorrillas", core: "Core" };
const localePresentation: Record<string, { names: Record<string, string>; equipment: Record<WorkoutEquipment, string>; muscles: Record<string, string> }> = {
  es: { names, equipment, muscles },
  ca: {
    names: { "Hip Thrust": "Hip thrust", "Romanian Deadlift": "Pes mort romanès", "Bulgarian Split Squat": "Esquat búlgar", "Seated Leg Curl": "Curl femoral assegut", "Cable Kickback": "Patada de glutis a la politja", "Walking Lunge": "Gambada caminant", "Glute Drive Machine": "Màquina d'empenta de glutis", "Smith Hip Thrust": "Hip thrust a la màquina Smith", "Dumbbell Hip Thrust": "Hip thrust amb manuelles", "Cable Pull Through": "Pull-through a la politja", "Lat Pulldown": "Jaló al pit", "Chest Press": "Press de pit" },
    equipment: { barbell: "BARRA", machine: "MÀQUINA", smith: "SMITH", dumbbells: "MANUELLES", cable: "POLITJA", bodyweight: "PES CORPORAL" },
    muscles: { glutes: "Glutis", back: "Esquena", chest: "Pectoral", hamstrings: "Isquiotibials", quadriceps: "Quàdriceps", calves: "Bessons", core: "Core" }
  },
  en: {
    names: {},
    equipment: { barbell: "Barbell", machine: "Machine", smith: "Smith machine", dumbbells: "Dumbbells", cable: "Cable", bodyweight: "Bodyweight" },
    muscles: { glutes: "Glutes", back: "Back", chest: "Chest", hamstrings: "Hamstrings", quadriceps: "Quadriceps", calves: "Calves", core: "Core" }
  },
  de: {
    names: { "Hip Thrust": "Hip Thrust", "Romanian Deadlift": "Rumänisches Kreuzheben", "Bulgarian Split Squat": "Bulgarische Kniebeuge", "Seated Leg Curl": "Beinbeugen im Sitzen", "Cable Kickback": "Kabel-Kickback", "Walking Lunge": "Ausfallschritt im Gehen", "Glute Drive Machine": "Glute-Drive-Maschine", "Smith Hip Thrust": "Hip Thrust an der Smith-Maschine", "Dumbbell Hip Thrust": "Hip Thrust mit Kurzhanteln", "Cable Pull Through": "Kabel-Pull-through", "Lat Pulldown": "Latzug", "Chest Press": "Brustpresse" },
    equipment: { barbell: "Langhantel", machine: "Maschine", smith: "Smith-Maschine", dumbbells: "Kurzhanteln", cable: "Kabelzug", bodyweight: "Körpergewicht" },
    muscles: { glutes: "Gesäß", back: "Rücken", chest: "Brust", hamstrings: "Beinbeuger", quadriceps: "Quadrizeps", calves: "Waden", core: "Rumpf" }
  }
};
const walkingLunge = {
  summary: "Zancadas dinámicas para trabajar glúteos y piernas con control.",
  setup: ["Colócate erguido y activa suavemente el abdomen", "Da un paso largo manteniendo el talón delantero apoyado", "Mantén el torso alineado"],
  howToDo: ["Da un paso hacia delante", "Desciende con control", "Impúlsate con la pierna delantera y continúa caminando"],
  coachCues: ["Controla la longitud del paso", "Mantén el equilibrio", "Empuja el suelo"],
  commonMistakes: ["Paso demasiado corto", "La rodilla se desplaza hacia dentro", "Inclinar demasiado el torso hacia delante"]
};
const gluteDriveMachine = {
  setup: ["Siéntate y fija bien la pelvis", "Coloca el apoyo sobre el pliegue de la cadera", "Sitúa los pies para mantener las tibias verticales al bloquear"],
  howToDo: ["Empuja con los talones", "Contrae los glúteos", "Controla la fase de descenso"],
  coachCues: ["Mantén las costillas abajo", "No arquees la espalda en exceso", "Haz una pausa arriba"],
  commonMistakes: ["Acelerar las repeticiones", "No completar el bloqueo", "Cargar demasiado la zona lumbar"]
};
function humanizeSemanticValue(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}
export function getLocalizedExercisePresentation(definition: ExerciseDefinition, locale: string) {
  const presentation = localePresentation[locale] ?? localePresentation.en;
  const localizedNames = locale === "es" ? names : presentation.names;
  const instructionOverrides = locale === "es" ? (definition.id === "walking-lunge" ? walkingLunge : definition.id === "glute-drive-machine" ? gluteDriveMachine : {}) : {};
  const equipmentLabel = presentation.equipment[definition.equipment] ?? humanizeSemanticValue(definition.equipment);
  const localizedLastPerformance = definition.lastPerformance?.replace(/^Bodyweight/i, equipmentLabel);
  return { ...definition, ...instructionOverrides, name: localizedNames[definition.name] ?? definition.name, equipmentLabel, primaryMuscles: definition.primaryMuscles.map((muscle) => presentation.muscles[muscle] ?? humanizeSemanticValue(muscle)), secondaryMuscles: definition.secondaryMuscles.map((muscle) => presentation.muscles[muscle] ?? humanizeSemanticValue(muscle)), lastPerformance: localizedLastPerformance, label: equipmentLabel };
}
export function getLocalizedAlternativePresentation(alternative: ExerciseAlternative, locale: string) {
  const presentation = localePresentation[locale] ?? localePresentation.en;
  return { ...alternative, equipmentLabel: presentation.equipment[alternative.equipment] ?? humanizeSemanticValue(alternative.equipment), label: locale === "es" ? (alternative.label === "EXCELLENT" ? "EXCELENTE" : "BUENA OPCIÓN") : locale === "ca" ? (alternative.label === "EXCELLENT" ? "EXCEL·LENT" : "BONA OPCIÓ") : locale === "de" ? (alternative.label === "EXCELLENT" ? "AUSGEZEICHNET" : "GUTE OPTION") : alternative.label };
}
