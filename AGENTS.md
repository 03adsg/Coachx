# CoachX — Agent Rules

Estas reglas aplican a cualquier agente/Codex que trabaje en este repositorio.

## Prioridades

1. Mobile-first iPhone antes que desktop.
2. UX extremadamente simple.
3. No romper historial de entrenamientos ni datos del usuario.
4. Supabase es la fuente de verdad; OpenAI no lo es.
5. OpenAI solo server-side y con salidas estructuradas validadas.
6. No crear funcionalidades fuera de la fase activa del `ROADMAP.md` salvo petición explícita.
7. Evitar sobrearquitectura: construir el mínimo sólido y extensible.

## UX

- Una acción primaria por pantalla.
- Barra inferior máxima de 4 destinos en MVP.
- Targets táctiles cómodos para iPhone.
- No esconder datos esenciales detrás de menús complejos.
- Calendario y pantalla del día son el centro del producto.

## Entrenamiento

- Mantener historial de peso/reps/RIR por serie.
- Mostrar último registro comparable en la siguiente sesión.
- Variantes deben preservar el patrón/objetivo del ejercicio.
- No rotar ejercicios base de forma aleatoria solo por variedad.

## Nutrición

- Cada comida del plan debe admitir al menos 3 opciones equivalentes cuando el programa lo especifique.
- Guardar objetivos y elecciones del usuario; no inferir consumo real sin registro.

## Seguridad

- Nunca exponer secrets en frontend.
- RLS en tablas con datos de usuario.
- Validar inputs del cliente y outputs de IA.
- Información de salud requiere cautela y revisión del coach cuando corresponda.

## Definition of Done

Una tarea no está terminada si funciona solo en desktop. Debe validarse como mínimo en viewport iPhone y mantener navegación, persistencia y estados de carga/error coherentes.
