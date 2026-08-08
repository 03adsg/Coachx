# CoachX — Product MVP

## Experiencia objetivo

CoachX debe sentirse como una app nativa de iPhone: una acción principal por pantalla, botones grandes, información visual y casi ningún texto innecesario.

## Flujo principal

1. Usuario abre la app.
2. Ve **Hoy** o el **Calendario**.
3. Pulsa un día.
4. La pantalla del día muestra:
   - grupo(s) muscular(es) + imagen,
   - rutina del día,
   - dieta del día,
   - cardio/hábitos relevantes,
   - estado/completado.
5. Pulsa un ejercicio.
6. Ve demostración, objetivo, técnica resumida y variante equivalente.
7. Registra peso y repeticiones por serie.
8. En la siguiente sesión comparable ve automáticamente el último registro.

## Navegación MVP

Barra inferior de 4 destinos:

- Hoy
- Calendario
- Progreso
- Perfil

El entrenamiento se abre desde Hoy/Calendario, no necesita tab propio inicialmente.

## Pantalla Día

Orden recomendado:

1. Fecha + saludo/estado.
2. Hero visual del grupo muscular.
3. Tarjeta **Entrenamiento**.
4. Tarjeta **Nutrición**.
5. Cardio/hábitos del día.
6. Resumen de cumplimiento.

## Entrenamiento

Cada sesión puede tener variante A/B, pero debe conservar patrones base suficientes semanas para medir progresión.

Cada ejercicio incluye:

- nombre,
- imagen/video demostrativo,
- músculos principales/secundarios,
- series,
- rango de reps,
- RIR,
- descanso,
- cues técnicos cortos,
- variante de máquina o mancuerna/peso libre,
- último registro,
- inputs de series actuales.

## Nutrición

Cada comida incluye mínimo 3 opciones con objetivo nutricional equivalente.

Ejemplo:

- Desayuno A
- Desayuno B
- Desayuno C

El usuario elige una opción y la app refleja macros/calorías del día.

## IA

La IA sirve para:

- proponer rutinas,
- proponer alternativas,
- generar opciones de comida equivalentes,
- interpretar rendimiento,
- resumir check-ins,
- sugerir ajustes.

No debe inventar historial ni reemplazar los registros persistidos.

## Regla UX

Si Angie necesita una explicación para saber dónde pulsar, la pantalla es demasiado compleja.
