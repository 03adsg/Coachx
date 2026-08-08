# CoachX — Arquitectura resumida

## Cliente

- Next.js + React + TypeScript.
- UI mobile-first, optimizada primero para iPhone/Safari.
- PWA `display: standalone` para instalar en pantalla de inicio.
- Estado de sesión y datos obtenidos desde backend/Supabase.

## Backend y datos

### Supabase

Fuente de verdad para:

- usuarios/perfiles,
- calendario,
- programas/rutinas,
- ejercicios y variantes,
- registros de series,
- planes de nutrición,
- check-ins y progreso,
- imágenes/fotos.

RLS obligatorio antes de producción: cada atleta solo ve sus datos; coach con permisos explícitos.

### OpenAI

- Integración únicamente server-side.
- Responses API.
- Structured Outputs/JSON Schema para rutinas, dietas y análisis.
- Nunca se expone `OPENAI_API_KEY` al cliente.
- La IA recibe únicamente el contexto necesario.
- Los resultados generados se validan antes de persistir.

## Flujo de entrenamiento

`calendar_day -> workout_session -> workout_exercise -> exercise_set_log`

Al abrir un ejercicio se consulta su último registro comparable y se muestra como referencia. Al completar la sesión, los nuevos sets quedan persistidos.

## Variantes

Cada ejercicio puede apuntar a una variante equivalente mediante el patrón/músculo objetivo, priorizando una alternativa de máquina y una de mancuernas/peso libre cuando tenga sentido biomecánico.

## Imágenes

Separar dos tipos:

1. **Muscle maps:** ilustraciones propias/licenciadas por grupo muscular.
2. **Exercise media:** imagen, animación o vídeo corto por ejercicio.

No depender del modelo de IA para generar la imagen cada vez; las imágenes forman parte de la biblioteca de contenido.

## Despliegue

- Vercel para web/PWA.
- Supabase para datos/auth/storage.
- Dominio recomendado: `coach.suberos.com` o enlace desde `suberos.com`.

## Regla crítica

La app debe seguir funcionando para consultar planes y registrar sesiones aunque el servicio de IA esté temporalmente indisponible. La IA mejora el coaching; no debe ser un punto único de fallo.
