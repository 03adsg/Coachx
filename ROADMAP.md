# CoachX — Roadmap

Roadmap deliberadamente corto. Construiremos y validaremos una fase antes de profundizar la siguiente.

## Fase 0 — Base del producto ✅

- Definir MVP, arquitectura y reglas del repo.
- Stack: Next.js/TypeScript + Supabase + OpenAI + PWA.
- Modelo mobile-first iPhone.

## Fase 1 — App shell + usuario + calendario

- Proyecto Next.js y diseño mobile-first.
- PWA instalable en iPhone.
- Supabase Auth.
- Perfil de usuario.
- Calendario mensual/semanal.
- Pulsar un día abre `/day/[date]`.
- Navegación mínima: Hoy, Calendario, Progreso, Perfil.

**Resultado:** Angie entra, inicia sesión, ve su calendario y abre cualquier día.

## Fase 2 — Pantalla diaria

- Cabecera del día y estado.
- Grupo muscular del día con ilustración.
- Tarjetas: entrenamiento, dieta, cardio/hábitos.
- Entrenamiento A/B cuando corresponda.
- Resumen simple de calorías/macros.

**Resultado:** un día contiene todo lo necesario sin navegar por múltiples pantallas.

## Fase 3 — Motor de entrenamiento y registro

- Biblioteca de ejercicios.
- Imagen/guía por ejercicio.
- Variante equivalente máquina ↔ mancuernas/peso libre.
- Series, reps, RIR, descanso y notas.
- Registro de peso y repeticiones por serie.
- Mostrar el último rendimiento al volver a ese ejercicio.
- Historial y sugerencia de progresión.

**Resultado:** la app sustituye libreta/notas durante el gimnasio.

## Fase 4 — Nutrición

- Plan diario por objetivo.
- Mínimo 3 opciones por comida con macros equivalentes.
- Training Day / Rest Day.
- Sustitución rápida de una opción.
- Lista simple de compra/meal prep después del MVP básico.

**Resultado:** Angie puede elegir qué comer sin salirse del plan.

## Fase 5 — Onboarding + seguimiento

- Formulario inicial por pasos con lógica condicional.
- Objetivos, salud, experiencia, preferencias, horarios y nutrición.
- Check-in semanal.
- Peso, medidas, fotos, sueño, energía, estrés y adherencia.
- Dashboard de progreso simple.

## Fase 6 — OpenAI Coach Engine

- OpenAI Responses API exclusivamente desde servidor.
- Salidas estructuradas y validadas.
- Generación/propuesta de rutina.
- Generación/propuesta de dieta.
- Interpretación de historial y check-ins.
- Sugerencias de progresión/adaptación.
- Guardrails: la IA propone; los datos persistidos y reglas del programa mandan.
- Cambios sensibles o de salud requieren revisión del coach.

## Fase 7 — Panel Coach

- Lista de usuarios.
- Vista de adherencia/progreso.
- Editar/asignar fases, rutinas y dieta.
- Aprobar o rechazar recomendaciones de IA.
- Alertas importantes.

## Fase 8 — Pulido y producción

- QA iPhone/Safari/PWA.
- Rendimiento y accesibilidad.
- Seguridad/RLS de Supabase.
- Privacidad, borrado/exportación de datos.
- Deploy y dominio/subdominio definitivo.

---

## Orden inmediato

**Ahora solo desarrollamos Fase 1.** No se construye la Fase 2 hasta que calendario, navegación, auth y experiencia iPhone estén sólidos.
