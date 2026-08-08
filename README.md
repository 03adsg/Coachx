# CoachX

CoachX es una app móvil-first/PWA para coaching personal de entrenamiento, nutrición y seguimiento.

## Visión MVP

Flujo principal del usuario:

**Calendario → Día → Rutina + dieta + grupos musculares → ejercicio → registro de peso/repeticiones → historial en la próxima sesión**.

La app debe sentirse como una app nativa de iPhone: muy simple, rápida, visual y con navegación mínima.

## Núcleo del producto

- Calendario mensual/semanal como entrada principal.
- Pantalla diaria con resumen de entrenamiento, dieta, cardio/hábitos y grupos musculares.
- Imágenes claras de los grupos musculares trabajados.
- Ejercicios con imagen/guía y variante equivalente de máquina o mancuernas.
- Registro por serie de peso, repeticiones y RIR.
- Recuperación automática del último registro al repetir grupo muscular/ejercicio.
- Dieta diaria con al menos 3 opciones equivalentes por comida.
- Perfil y onboarding altamente personalizado.
- OpenAI para generar/proponer rutinas, dietas e interpretar progreso.
- Supabase como fuente de verdad para usuarios, planes, registros y progreso.
- Panel de coach para revisar y aprobar cambios importantes.

## Stack propuesto

- Next.js + React + TypeScript
- Tailwind CSS
- PWA instalable en iPhone
- Supabase: Auth, Postgres y Storage
- OpenAI Responses API desde servidor
- Zod/JSON Schema para respuestas estructuradas de IA
- Vercel para despliegue inicial

## Principio de arquitectura

OpenAI **no** será la base de datos ni decidirá silenciosamente cambios críticos. La IA propone/interpreta; Supabase guarda el estado real y el coach puede aprobar ajustes.

La clave de OpenAI se mantiene exclusivamente en servidor, nunca en el navegador.

## Documentos

- `ROADMAP.md` — fases de construcción.
- `docs/PRODUCT.md` — alcance MVP y experiencia móvil.
- `docs/ARCHITECTURE.md` — arquitectura técnica resumida.
- `AGENTS.md` — reglas para agentes/Codex que trabajen en el repo.

## Estado

Proyecto inicializado. Siguiente paso: **Fase 1 — shell móvil + autenticación + calendario**.
