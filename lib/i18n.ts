export const supportedLocales = ["es", "ca", "en", "de"] as const;
export type Locale = (typeof supportedLocales)[number];

export const localeCookieName = "athlexforce-locale";
export const localeStorageKey = "athlexforce-locale-v1";

type MessageTree = {
  common: {
    back: string;
    continue: string;
    skip: string;
    save: string;
    retry: string;
    close: string;
    edit: string;
    review: string;
    apply: string;
    approve: string;
    reject: string;
    startOnboarding: string;
    startWorkout: string;
    viewWorkout: string;
    openSettings: string;
    signOut: string;
    loading: string;
    profile: string;
    program: string;
    today: string;
    calendar: string;
    progress: string;
    coachPanel: string;
    dashboard: string;
    athletes: string;
    reviews: string;
    notifications: string;
    settings: string;
    unauthorized: string;
    networkFailure: string;
    error: string;
    success: string;
    noData: string;
  };
  locale: {
    es: string;
    ca: string;
    en: string;
    de: string;
  };
  nav: {
    today: string;
    calendar: string;
    progress: string;
    profile: string;
  };
  auth: {
    entryTitle: string;
    entrySubtitle: string;
    signIn: string;
    signUp: string;
    logout: string;
  };
  onboarding: {
    title: string;
    subtitle: string;
    introTitle: string;
    introSubtitle: string;
    introBasicsTitle: string;
    introBasicsCaption: string;
    whatWeSetUp: string;
    profileTitle: string;
    profileSubtitle: string;
    profileQuestion: string;
    profileCaption: string;
    goalsTitle: string;
    goalsSubtitle: string;
    goalsQuestion: string;
    goalsCaption: string;
    trainingExperienceTitle: string;
    trainingExperienceSubtitle: string;
    trainingExperienceSummary: string;
    trainingPreferencesTitle: string;
    trainingPreferencesSubtitle: string;
    trainingPreferencesCaption: string;
    scheduleTitle: string;
    scheduleSubtitle: string;
    healthTitle: string;
    healthSubtitle: string;
    nutritionTitle: string;
    nutritionSubtitle: string;
    baselineTitle: string;
    baselineSubtitle: string;
    reviewTitle: string;
    reviewSubtitle: string;
    buildingPlanTitle: string;
    buildingPlanSubtitle: string;
    planReadyTitle: string;
    planReadySubtitle: string;
    programTitle: string;
    programSubtitle: string;
  };
  profile: {
    hubTitle: string;
    provisionalHub: string;
    signedInAs: string;
    currentPlan: string;
    active: string;
    proposed: string;
    daysPerWeek: string;
    duration: string;
    location: string;
    profileEditing: string;
    notifications: string;
    programOverview: string;
    developmentMode: string;
    profileSaved: string;
    programUpdatePending: string;
    noPendingProgramUpdates: string;
  };
  coach: {
    accessDeniedTitle: string;
    accessDeniedCopy: string;
    dashboardTitle: string;
    dataNotReadyTitle: string;
    dataNotReadyCopy: string;
    assignedAthletesOnly: string;
    needsAttention: string;
    quickLinks: string;
    athletes: string;
    reviews: string;
    profile: string;
  };
  calendar: {
    title: string;
    previousMonth: string;
    nextMonth: string;
    nutrition: string;
    cardioHabits: string;
    viewDay: string;
    monthFallback: string;
  };
  today: {
    restDay: string;
    recoveryDay: string;
    nextWorkout: string;
    targetZones: string;
    primary: string;
    secondary: string;
    readyTomorrow: string;
    duration: string;
    calories: string;
    cardio: string;
    volume: string;
    sets: string;
  };
  program: {
    overview: string;
    myProgram: string;
    weeklyStructure: string;
    workoutTemplates: string;
    keyMovements: string;
    progression: string;
    nutrition: string;
    cardio: string;
    recovery: string;
    habits: string;
    checkIn: string;
    reviewTimeline: string;
    recentAdjustments: string;
  };
};

const messages: Record<Locale, MessageTree> = {
  en: {
    common: {
      back: "Back",
      continue: "Continue",
      skip: "Skip",
      save: "Save",
      retry: "Retry",
      close: "Close",
      edit: "Edit",
      review: "Review",
      apply: "Apply",
      approve: "Approve",
      reject: "Reject",
      startOnboarding: "Start onboarding",
      startWorkout: "Start workout",
      viewWorkout: "View Workout",
      openSettings: "Open Settings",
      signOut: "Sign out",
      loading: "Loading",
      profile: "Profile",
      program: "Program",
      today: "Today",
      calendar: "Calendar",
      progress: "Progress",
      coachPanel: "Coach Panel",
      dashboard: "Dashboard",
      athletes: "Athletes",
      reviews: "Reviews",
      notifications: "Notifications",
      settings: "Settings",
      unauthorized: "Unauthorized",
      networkFailure: "Network failure",
      error: "Error",
      success: "Success",
      noData: "No data"
    },
    locale: { es: "Spanish", ca: "Catalan", en: "English", de: "German" },
    nav: { today: "Today", calendar: "Calendar", progress: "Progress", profile: "Profile" },
    auth: {
      entryTitle: "AthlexForce",
      entrySubtitle: "Athlete app and coach workflow",
      signIn: "Sign in",
      signUp: "Sign up",
      logout: "Logout"
    },
    onboarding: {
      title: "Onboarding",
      subtitle: "Build the athlete setup before the plan is revealed.",
      introTitle: "Start with the basics",
      introSubtitle: "Build the athlete setup before the plan is revealed.",
      introBasicsTitle: "Start with the basics",
      introBasicsCaption: "AthlexForce uses one consistent athlete context across profile, goals, training, nutrition, baseline, and the program reveal.",
      whatWeSetUp: "What we'll set up",
      profileTitle: "Profile",
      profileSubtitle: "Name, age, height, weight, and units.",
      profileQuestion: "What should we call you?",
      profileCaption: "Use the same athlete context throughout the demo flow.",
      goalsTitle: "Goals",
      goalsSubtitle: "Main goal and ordered priorities.",
      goalsQuestion: "Set the main goal",
      goalsCaption: "Keep the visual language simple. Goal and priorities should read clearly on mobile.",
      trainingExperienceTitle: "Training Experience",
      trainingExperienceSubtitle: "Current frequency, confidence, loads, and movement familiarity.",
      trainingExperienceSummary: "Experience summary",
      trainingPreferencesTitle: "Training Preferences",
      trainingPreferencesSubtitle: "Days, duration, equipment, variety, and rest preferences.",
      trainingPreferencesCaption: "Repeatable anchors",
      scheduleTitle: "Schedule & Lifestyle",
      scheduleSubtitle: "Work pattern, sleep, stress, hydration, and training windows.",
      healthTitle: "Health & Limitations",
      healthSubtitle: "Keep this calm, private, and non-diagnostic.",
      nutritionTitle: "Nutrition Preferences",
      nutritionSubtitle: "Allergies, restrictions, routine, and flexibility.",
      baselineTitle: "Baseline",
      baselineSubtitle: "Measurements and optional private progress photos.",
      reviewTitle: "Final Review",
      reviewSubtitle: "Confirm the profile before the plan is built.",
      buildingPlanTitle: "Building Your Plan",
      buildingPlanSubtitle: "A calm processing state with deterministic fixture generation.",
      planReadyTitle: "Your Plan is Ready",
      planReadySubtitle: "Phase 1 is proposed until you start the program.",
      programTitle: "Program Overview",
      programSubtitle: "Phase 1, progress, and current structure."
    },
    profile: {
      hubTitle: "Profile",
      provisionalHub: "Provisional profile hub and foundation settings",
      signedInAs: "Signed in as",
      currentPlan: "Current plan",
      active: "Active",
      proposed: "Proposed",
      daysPerWeek: "Days / week",
      duration: "Duration",
      location: "Location",
      profileEditing: "Profile editing",
      notifications: "Notifications",
      programOverview: "Program overview",
      developmentMode: "Development mode",
      profileSaved: "profile saved",
      programUpdatePending: "Program update pending",
      noPendingProgramUpdates: "No pending program updates"
    },
    coach: {
      accessDeniedTitle: "Access denied",
      accessDeniedCopy: "This account is not configured as a coach or the coach tables are not available yet.",
      dashboardTitle: "Coach dashboard",
      dataNotReadyTitle: "Coach data is not ready yet",
      dataNotReadyCopy: "The coach tables or assignment data are unavailable in this environment.",
      assignedAthletesOnly: "Assigned athletes only. Review the athletes that need attention first.",
      needsAttention: "Needs attention",
      quickLinks: "Quick links",
      athletes: "Athletes",
      reviews: "Reviews",
      profile: "Profile"
    },
    calendar: {
      title: "Calendar",
      previousMonth: "Previous month",
      nextMonth: "Next month",
      nutrition: "Nutrition",
      cardioHabits: "Cardio & Habits",
      viewDay: "View Day",
      monthFallback: "Current month"
    },
    today: {
      restDay: "Rest Day",
      recoveryDay: "Recovery Day",
      nextWorkout: "Next Workout",
      targetZones: "Target Zones",
      primary: "Primary",
      secondary: "Secondary",
      readyTomorrow: "Ready tomorrow",
      duration: "Duration",
      calories: "Calories",
      cardio: "Cardio",
      volume: "Volume",
      sets: "Sets"
    },
    program: {
      overview: "Program Overview",
      myProgram: "My Program",
      weeklyStructure: "Weekly structure",
      workoutTemplates: "Workout templates",
      keyMovements: "Key movements",
      progression: "Progression",
      nutrition: "Nutrition",
      cardio: "Cardio",
      recovery: "Recovery",
      habits: "Habits",
      checkIn: "Check-in",
      reviewTimeline: "Review timeline",
      recentAdjustments: "Recent adjustments"
    }
  },
  es: {
    common: {
      back: "Atrás",
      continue: "Continuar",
      skip: "Saltar",
      save: "Guardar",
      retry: "Reintentar",
      close: "Cerrar",
      edit: "Editar",
      review: "Revisar",
      apply: "Aplicar",
      approve: "Aprobar",
      reject: "Rechazar",
      startOnboarding: "Empezar onboarding",
      startWorkout: "Empezar entrenamiento",
      viewWorkout: "Ver entrenamiento",
      openSettings: "Abrir ajustes",
      signOut: "Cerrar sesión",
      loading: "Cargando",
      profile: "Perfil",
      program: "Programa",
      today: "Hoy",
      calendar: "Calendario",
      progress: "Progreso",
      coachPanel: "Panel de coach",
      dashboard: "Panel",
      athletes: "Atletas",
      reviews: "Revisiones",
      notifications: "Notificaciones",
      settings: "Ajustes",
      unauthorized: "Sin acceso",
      networkFailure: "Fallo de red",
      error: "Error",
      success: "Correcto",
      noData: "Sin datos"
    },
    locale: { es: "Español", ca: "Català", en: "Inglés", de: "Alemán" },
    nav: { today: "Hoy", calendar: "Calendario", progress: "Progreso", profile: "Perfil" },
    auth: { entryTitle: "AthlexForce", entrySubtitle: "App de atleta y flujo de coach", signIn: "Entrar", signUp: "Crear cuenta", logout: "Salir" },
    onboarding: {
      title: "Onboarding",
      subtitle: "Configura el atleta antes de revelar el plan.",
      introTitle: "Empieza por lo básico",
      introSubtitle: "Configura el atleta antes de revelar el plan.",
      introBasicsTitle: "Empieza por lo básico",
      introBasicsCaption: "AthlexForce usa un único contexto de atleta para perfil, objetivos, entrenamiento, nutrición, baseline y la revelación del plan.",
      whatWeSetUp: "Qué vamos a configurar",
      profileTitle: "Perfil",
      profileSubtitle: "Nombre, edad, altura, peso y unidades.",
      profileQuestion: "¿Cómo te llamamos?",
      profileCaption: "Usa el mismo contexto de atleta durante todo el flujo.",
      goalsTitle: "Objetivos",
      goalsSubtitle: "Objetivo principal y prioridades ordenadas.",
      goalsQuestion: "Define el objetivo principal",
      goalsCaption: "Mantén el lenguaje visual simple. El objetivo y las prioridades deben leerse bien en móvil.",
      trainingExperienceTitle: "Experiencia de entrenamiento",
      trainingExperienceSubtitle: "Frecuencia, confianza, cargas y familiaridad con movimientos.",
      trainingExperienceSummary: "Resumen de experiencia",
      trainingPreferencesTitle: "Preferencias de entrenamiento",
      trainingPreferencesSubtitle: "Días, duración, equipo, variedad y descanso.",
      trainingPreferencesCaption: "Anclas repetibles",
      scheduleTitle: "Horario y estilo de vida",
      scheduleSubtitle: "Trabajo, sueño, estrés, hidratación y ventanas de entrenamiento.",
      healthTitle: "Salud y limitaciones",
      healthSubtitle: "Mantén esto tranquilo, privado y sin diagnóstico.",
      nutritionTitle: "Preferencias de nutrición",
      nutritionSubtitle: "Alergias, restricciones, rutina y flexibilidad.",
      baselineTitle: "Baseline",
      baselineSubtitle: "Medidas y fotos privadas opcionales.",
      reviewTitle: "Revisión final",
      reviewSubtitle: "Confirma el perfil antes de construir el plan.",
      buildingPlanTitle: "Construyendo tu plan",
      buildingPlanSubtitle: "Estado de procesamiento tranquilo con generación determinista.",
      planReadyTitle: "Tu plan está listo",
      planReadySubtitle: "La Fase 1 queda propuesta hasta que inicies el programa.",
      programTitle: "Resumen del programa",
      programSubtitle: "Fase 1, progreso y estructura actual."
    },
    profile: {
      hubTitle: "Perfil",
      provisionalHub: "Hub provisional de perfil y ajustes base",
      signedInAs: "Sesión iniciada como",
      currentPlan: "Plan actual",
      active: "Activo",
      proposed: "Propuesto",
      daysPerWeek: "Días / semana",
      duration: "Duración",
      location: "Ubicación",
      profileEditing: "Edición de perfil",
      notifications: "Notificaciones",
      programOverview: "Resumen del programa",
      developmentMode: "Modo desarrollo",
      profileSaved: "perfil guardado",
      programUpdatePending: "Actualización del programa pendiente",
      noPendingProgramUpdates: "Sin actualizaciones pendientes"
    },
    coach: {
      accessDeniedTitle: "Acceso denegado",
      accessDeniedCopy: "Esta cuenta no está configurada como coach o las tablas de coach aún no están disponibles.",
      dashboardTitle: "Panel de coach",
      dataNotReadyTitle: "Los datos del coach aún no están listos",
      dataNotReadyCopy: "Las tablas de coach o los datos de asignación no están disponibles en este entorno.",
      assignedAthletesOnly: "Solo atletas asignados. Revisa primero los que necesitan atención.",
      needsAttention: "Necesita atención",
      quickLinks: "Accesos rápidos",
      athletes: "Atletas",
      reviews: "Revisiones",
      profile: "Perfil"
    },
    calendar: {
      title: "Calendario",
      previousMonth: "Mes anterior",
      nextMonth: "Mes siguiente",
      nutrition: "Nutrición",
      cardioHabits: "Cardio y hábitos",
      viewDay: "Ver día",
      monthFallback: "Mes actual"
    },
    today: {
      restDay: "Día de descanso",
      recoveryDay: "Día de recuperación",
      nextWorkout: "Próximo entrenamiento",
      targetZones: "Zonas objetivo",
      primary: "Principal",
      secondary: "Secundaria",
      readyTomorrow: "Listo mañana",
      duration: "Duración",
      calories: "Calorías",
      cardio: "Cardio",
      volume: "Volumen",
      sets: "Series"
    },
    program: {
      overview: "Resumen del programa",
      myProgram: "Mi programa",
      weeklyStructure: "Estructura semanal",
      workoutTemplates: "Plantillas de entrenamiento",
      keyMovements: "Movimientos clave",
      progression: "Progresión",
      nutrition: "Nutrición",
      cardio: "Cardio",
      recovery: "Recuperación",
      habits: "Hábitos",
      checkIn: "Check-in",
      reviewTimeline: "Calendario de revisión",
      recentAdjustments: "Ajustes recientes"
    }
  },
  ca: {
    common: {
      back: "Enrere",
      continue: "Continua",
      skip: "Salta",
      save: "Desa",
      retry: "Torna-ho a provar",
      close: "Tanca",
      edit: "Edita",
      review: "Revisa",
      apply: "Aplica",
      approve: "Aprova",
      reject: "Rebutja",
      startOnboarding: "Comença l'onboarding",
      startWorkout: "Comença l'entrenament",
      viewWorkout: "Veure entrenament",
      openSettings: "Obre els ajustos",
      signOut: "Tanca la sessió",
      loading: "Carregant",
      profile: "Perfil",
      program: "Programa",
      today: "Avui",
      calendar: "Calendari",
      progress: "Progrés",
      coachPanel: "Panell de coach",
      dashboard: "Tauler",
      athletes: "Atletes",
      reviews: "Revisions",
      notifications: "Notificacions",
      settings: "Ajustos",
      unauthorized: "Sense accés",
      networkFailure: "Error de xarxa",
      error: "Error",
      success: "Correcte",
      noData: "Sense dades"
    },
    locale: { es: "Castellà", ca: "Català", en: "Anglès", de: "Alemany" },
    nav: { today: "Avui", calendar: "Calendari", progress: "Progrés", profile: "Perfil" },
    auth: { entryTitle: "AthlexForce", entrySubtitle: "App d'atleta i flux de coach", signIn: "Inicia sessió", signUp: "Crea un compte", logout: "Surt" },
    onboarding: {
      title: "Onboarding",
      subtitle: "Configura l'atleta abans de revelar el pla.",
      introTitle: "Comença pel bàsic",
      introSubtitle: "Configura l'atleta abans de revelar el pla.",
      introBasicsTitle: "Comença pel bàsic",
      introBasicsCaption: "AthlexForce fa servir un únic context d'atleta per perfil, objectius, entrenament, nutrició, baseline i la revelació del pla.",
      whatWeSetUp: "Què configurarem",
      profileTitle: "Perfil",
      profileSubtitle: "Nom, edat, alçada, pes i unitats.",
      profileQuestion: "Com t'hem de dir?",
      profileCaption: "Fes servir el mateix context d'atleta durant tot el flux.",
      goalsTitle: "Objectius",
      goalsSubtitle: "Objectiu principal i prioritats ordenades.",
      goalsQuestion: "Defineix l'objectiu principal",
      goalsCaption: "Mantén el llenguatge visual simple. L'objectiu i les prioritats s'han de llegir bé al mòbil.",
      trainingExperienceTitle: "Experiència d'entrenament",
      trainingExperienceSubtitle: "Freqüència, confiança, càrregues i familiaritat amb moviments.",
      trainingExperienceSummary: "Resum d'experiència",
      trainingPreferencesTitle: "Preferències d'entrenament",
      trainingPreferencesSubtitle: "Dies, durada, equip, varietat i descans.",
      trainingPreferencesCaption: "Ancoratges repetibles",
      scheduleTitle: "Horari i estil de vida",
      scheduleSubtitle: "Feina, son, estrès, hidratació i franges d'entrenament.",
      healthTitle: "Salut i limitacions",
      healthSubtitle: "Mantén això tranquil, privat i sense diagnòstic.",
      nutritionTitle: "Preferències de nutrició",
      nutritionSubtitle: "Al·lèrgies, restriccions, rutina i flexibilitat.",
      baselineTitle: "Baseline",
      baselineSubtitle: "Mesures i fotos privades opcionals.",
      reviewTitle: "Revisió final",
      reviewSubtitle: "Confirma el perfil abans de construir el pla.",
      buildingPlanTitle: "Construint el teu pla",
      buildingPlanSubtitle: "Estat de processament tranquil amb generació determinista.",
      planReadyTitle: "El teu pla està llest",
      planReadySubtitle: "La Fase 1 queda proposada fins que iniciïs el programa.",
      programTitle: "Resum del programa",
      programSubtitle: "Fase 1, progrés i estructura actual."
    },
    profile: {
      hubTitle: "Perfil",
      provisionalHub: "Centre provisional de perfil i ajustos base",
      signedInAs: "Sessió iniciada com a",
      currentPlan: "Pla actual",
      active: "Actiu",
      proposed: "Proposat",
      daysPerWeek: "Dies / setmana",
      duration: "Durada",
      location: "Ubicació",
      profileEditing: "Edició de perfil",
      notifications: "Notificacions",
      programOverview: "Resum del programa",
      developmentMode: "Mode desenvolupament",
      profileSaved: "perfil desat",
      programUpdatePending: "Actualització del programa pendent",
      noPendingProgramUpdates: "Sense actualitzacions pendents"
    },
    coach: {
      accessDeniedTitle: "Accés denegat",
      accessDeniedCopy: "Aquest compte no està configurat com a coach o les taules de coach encara no estan disponibles.",
      dashboardTitle: "Tauler de coach",
      dataNotReadyTitle: "Les dades del coach encara no estan llestes",
      dataNotReadyCopy: "Les taules de coach o les dades d'assignació no estan disponibles en aquest entorn.",
      assignedAthletesOnly: "Només atletes assignats. Revisa primer els que necessiten atenció.",
      needsAttention: "Necessita atenció",
      quickLinks: "Accessos ràpids",
      athletes: "Atletes",
      reviews: "Revisions",
      profile: "Perfil"
    },
    calendar: {
      title: "Calendari",
      previousMonth: "Mes anterior",
      nextMonth: "Mes següent",
      nutrition: "Nutrició",
      cardioHabits: "Cardio i hàbits",
      viewDay: "Veure dia",
      monthFallback: "Mes actual"
    },
    today: {
      restDay: "Dia de descans",
      recoveryDay: "Dia de recuperació",
      nextWorkout: "Proper entrenament",
      targetZones: "Zones objectiu",
      primary: "Principal",
      secondary: "Secundària",
      readyTomorrow: "A punt demà",
      duration: "Durada",
      calories: "Calories",
      cardio: "Cardio",
      volume: "Volum",
      sets: "Sèries"
    },
    program: {
      overview: "Resum del programa",
      myProgram: "El meu programa",
      weeklyStructure: "Estructura setmanal",
      workoutTemplates: "Plantilles d'entrenament",
      keyMovements: "Moviments clau",
      progression: "Progressió",
      nutrition: "Nutrició",
      cardio: "Cardio",
      recovery: "Recuperació",
      habits: "Hàbits",
      checkIn: "Check-in",
      reviewTimeline: "Calendari de revisió",
      recentAdjustments: "Ajustos recents"
    }
  },
  de: {
    common: {
      back: "Zurück",
      continue: "Weiter",
      skip: "Überspringen",
      save: "Speichern",
      retry: "Erneut versuchen",
      close: "Schließen",
      edit: "Bearbeiten",
      review: "Prüfen",
      apply: "Anwenden",
      approve: "Genehmigen",
      reject: "Ablehnen",
      startOnboarding: "Onboarding starten",
      startWorkout: "Training starten",
      viewWorkout: "Training ansehen",
      openSettings: "Einstellungen öffnen",
      signOut: "Abmelden",
      loading: "Lädt",
      profile: "Profil",
      program: "Programm",
      today: "Heute",
      calendar: "Kalender",
      progress: "Fortschritt",
      coachPanel: "Coach-Panel",
      dashboard: "Übersicht",
      athletes: "Athleten",
      reviews: "Reviews",
      notifications: "Benachrichtigungen",
      settings: "Einstellungen",
      unauthorized: "Kein Zugriff",
      networkFailure: "Netzwerkfehler",
      error: "Fehler",
      success: "Erfolg",
      noData: "Keine Daten"
    },
    locale: { es: "Spanisch", ca: "Katalanisch", en: "Englisch", de: "Deutsch" },
    nav: { today: "Heute", calendar: "Kalender", progress: "Fortschritt", profile: "Profil" },
    auth: { entryTitle: "AthlexForce", entrySubtitle: "Athleten-App und Coach-Workflow", signIn: "Anmelden", signUp: "Konto erstellen", logout: "Abmelden" },
    onboarding: {
      title: "Onboarding",
      subtitle: "Lege das Athleten-Setup fest, bevor der Plan angezeigt wird.",
      introTitle: "Mit den Grundlagen beginnen",
      introSubtitle: "Lege das Athleten-Setup fest, bevor der Plan angezeigt wird.",
      introBasicsTitle: "Mit den Grundlagen beginnen",
      introBasicsCaption: "AthlexForce verwendet einen einheitlichen Athletenkontext für Profil, Ziele, Training, Ernährung, Baseline und Plananzeige.",
      whatWeSetUp: "Was wir einrichten",
      profileTitle: "Profil",
      profileSubtitle: "Name, Alter, Größe, Gewicht und Einheiten.",
      profileQuestion: "Wie sollen wir dich nennen?",
      profileCaption: "Verwende denselben Athletenkontext durch den gesamten Flow.",
      goalsTitle: "Ziele",
      goalsSubtitle: "Hauptziel und geordnete Prioritäten.",
      goalsQuestion: "Lege das Hauptziel fest",
      goalsCaption: "Halte die visuelle Sprache einfach. Ziel und Prioritäten sollen auf Mobilgeräten klar lesbar sein.",
      trainingExperienceTitle: "Trainingserfahrung",
      trainingExperienceSubtitle: "Frequenz, Vertrauen, Lasten und Bewegungsroutine.",
      trainingExperienceSummary: "Erfahrungsübersicht",
      trainingPreferencesTitle: "Trainingspräferenzen",
      trainingPreferencesSubtitle: "Tage, Dauer, Equipment, Vielfalt und Pausen.",
      trainingPreferencesCaption: "Wiederholbare Anker",
      scheduleTitle: "Zeitplan & Lebensstil",
      scheduleSubtitle: "Arbeit, Schlaf, Stress, Hydration und Trainingsfenster.",
      healthTitle: "Gesundheit & Einschränkungen",
      healthSubtitle: "Bleibe ruhig, privat und ohne Diagnose.",
      nutritionTitle: "Ernährungspräferenzen",
      nutritionSubtitle: "Allergien, Restriktionen, Routine und Flexibilität.",
      baselineTitle: "Baseline",
      baselineSubtitle: "Messungen und optionale private Fortschrittsfotos.",
      reviewTitle: "Abschließende Prüfung",
      reviewSubtitle: "Bestätige das Profil, bevor der Plan gebaut wird.",
      buildingPlanTitle: "Plan wird erstellt",
      buildingPlanSubtitle: "Ruhiger Verarbeitungszustand mit deterministischer Fixture-Erzeugung.",
      planReadyTitle: "Dein Plan ist bereit",
      planReadySubtitle: "Phase 1 bleibt vorgeschlagen, bis du das Programm startest.",
      programTitle: "Programmübersicht",
      programSubtitle: "Phase 1, Fortschritt und aktuelle Struktur."
    },
    profile: {
      hubTitle: "Profil",
      provisionalHub: "Provisorischer Profil-Hub und Basiseinstellungen",
      signedInAs: "Angemeldet als",
      currentPlan: "Aktueller Plan",
      active: "Aktiv",
      proposed: "Vorgeschlagen",
      daysPerWeek: "Tage / Woche",
      duration: "Dauer",
      location: "Ort",
      profileEditing: "Profilbearbeitung",
      notifications: "Benachrichtigungen",
      programOverview: "Programmübersicht",
      developmentMode: "Entwicklungsmodus",
      profileSaved: "Profil gespeichert",
      programUpdatePending: "Programmaktualisierung ausstehend",
      noPendingProgramUpdates: "Keine ausstehenden Programmaktualisierungen"
    },
    coach: {
      accessDeniedTitle: "Zugriff verweigert",
      accessDeniedCopy: "Dieses Konto ist nicht als Coach konfiguriert oder die Coach-Tabellen sind noch nicht verfügbar.",
      dashboardTitle: "Coach-Übersicht",
      dataNotReadyTitle: "Coach-Daten sind noch nicht bereit",
      dataNotReadyCopy: "Die Coach-Tabellen oder Zuweisungsdaten sind in dieser Umgebung nicht verfügbar.",
      assignedAthletesOnly: "Nur zugewiesene Athleten. Prüfe zuerst die mit Handlungsbedarf.",
      needsAttention: "Benötigt Aufmerksamkeit",
      quickLinks: "Schnellzugriffe",
      athletes: "Athleten",
      reviews: "Reviews",
      profile: "Profil"
    },
    calendar: {
      title: "Kalender",
      previousMonth: "Vorheriger Monat",
      nextMonth: "Nächster Monat",
      nutrition: "Ernährung",
      cardioHabits: "Cardio & Gewohnheiten",
      viewDay: "Tag ansehen",
      monthFallback: "Aktueller Monat"
    },
    today: {
      restDay: "Ruhetag",
      recoveryDay: "Regenerationstag",
      nextWorkout: "Nächstes Training",
      targetZones: "Zielzonen",
      primary: "Primär",
      secondary: "Sekundär",
      readyTomorrow: "Morgen bereit",
      duration: "Dauer",
      calories: "Kalorien",
      cardio: "Cardio",
      volume: "Volumen",
      sets: "Sätze"
    },
    program: {
      overview: "Programmübersicht",
      myProgram: "Mein Programm",
      weeklyStructure: "Wochenstruktur",
      workoutTemplates: "Trainingsvorlagen",
      keyMovements: "Kernübungen",
      progression: "Progression",
      nutrition: "Ernährung",
      cardio: "Cardio",
      recovery: "Regeneration",
      habits: "Gewohnheiten",
      checkIn: "Check-in",
      reviewTimeline: "Review-Zeitplan",
      recentAdjustments: "Letzte Anpassungen"
    }
  }
};

let currentLocale: Locale = "es";
const listeners = new Set<() => void>();

export function isSupportedLocale(value: string): value is Locale {
  return (supportedLocales as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (!normalized) {
    return "es";
  }

  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("ca")) return "ca";
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("de")) return "de";
  if (isSupportedLocale(normalized)) return normalized;
  return "es";
}

export function detectBrowserLocale() {
  if (typeof navigator === "undefined") {
    return "es" as Locale;
  }

  const candidates = [...navigator.languages, navigator.language].filter(Boolean);
  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);
    if (locale) {
      return locale;
    }
  }

  return "es" as Locale;
}

export function readPersistedLocale() {
  if (typeof window === "undefined") {
    return null;
  }

  const fromStorage = window.localStorage.getItem(localeStorageKey);
  if (fromStorage) {
    return normalizeLocale(fromStorage);
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${localeCookieName}=([^;]*)`));
  if (match?.[1]) {
    return normalizeLocale(decodeURIComponent(match[1]));
  }

  return null;
}

export function getInitialLocale(preferredLocale?: string | null) {
  return normalizeLocale(preferredLocale) ?? readPersistedLocale() ?? detectBrowserLocale() ?? "es";
}

export function setLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${localeCookieName}=${encodeURIComponent(locale)}; path=/; max-age=31536000; samesite=lax`;
}

export function setCurrentLocale(nextLocale: Locale) {
  currentLocale = normalizeLocale(nextLocale);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(localeStorageKey, currentLocale);
    setLocaleCookie(currentLocale);
  }
  listeners.forEach((listener) => listener());
}

export function bootstrapLocale() {
  setCurrentLocale(getInitialLocale());
}

export function getCurrentLocale() {
  return currentLocale;
}

export function subscribeLocale(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTranslation(locale: Locale, path: string): string {
  const segments = path.split(".");
  const resolve = (tree: unknown) => segments.reduce<unknown>((value, segment) => {
    if (!value || typeof value !== "object") {
      return undefined;
    }

    return (value as Record<string, unknown>)[segment];
  }, tree);

  const localized = resolve(messages[locale]);
  const english = resolve(messages.en);
  const value = localized ?? english;
  return typeof value === "string" ? value : path;
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions & { locale?: Locale } = {}) {
  const { locale, ...dateOptions } = options;
  return new Intl.DateTimeFormat(locale ?? currentLocale, dateOptions).format(date);
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(currentLocale, options).format(value);
}
