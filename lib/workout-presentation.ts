import type { ExerciseAlternative, ExerciseDefinition, WorkoutEquipment } from "@/lib/workout-data";

const names: Record<string, string> = {
  "Hip Thrust": "Empuje de cadera", "Romanian Deadlift": "Peso muerto rumano", "Bulgarian Split Squat": "Sentadilla búlgara",
  "Seated Leg Curl": "Curl femoral sentado", "Cable Kickback": "Patada de glúteo en polea", "Walking Lunge": "Zancada caminando",
  "Glute Drive Machine": "Máquina de empuje de glúteo", "Smith Hip Thrust": "Empuje de cadera en máquina Smith",
  "Dumbbell Hip Thrust": "Empuje de cadera con mancuernas", "Cable Pull Through": "Pull-through en polea", "Lat Pulldown": "Jalón al pecho", "Chest Press": "Press de pecho"
};
const equipment: Record<WorkoutEquipment, string> = { barbell: "BARRA", machine: "MÁQUINA", smith: "SMITH", dumbbells: "MANCUERNAS", cable: "POLEA", bodyweight: "PESO CORPORAL" };
const muscles: Record<string, string> = { glutes: "Glúteos", back: "Espalda", chest: "Pecho", hamstrings: "Isquiotibiales", quadriceps: "Cuádriceps", calves: "Pantorrillas", core: "Core" };
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
export function getLocalizedExercisePresentation(definition: ExerciseDefinition, locale: string) {
  if (locale !== "es") return { ...definition, equipmentLabel: definition.equipment.toUpperCase() };
  return { ...definition, ...(definition.id === "walking-lunge" ? walkingLunge : definition.id === "glute-drive-machine" ? gluteDriveMachine : {}), name: names[definition.name] ?? definition.name, equipmentLabel: equipment[definition.equipment], primaryMuscles: definition.primaryMuscles.map((muscle) => muscles[muscle] ?? muscle), secondaryMuscles: definition.secondaryMuscles.map((muscle) => muscles[muscle] ?? muscle), label: definition.equipment === "bodyweight" ? "PESO CORPORAL" : definition.label };
}
export function getLocalizedAlternativePresentation(alternative: ExerciseAlternative, locale: string) {
  return { ...alternative, equipmentLabel: locale === "es" ? equipment[alternative.equipment] : alternative.equipment.toUpperCase(), label: locale === "es" ? (alternative.label === "EXCELLENT" ? "EXCELENTE" : "BUENA OPCIÓN") : alternative.label };
}
