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
    help: string;
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
    language: string;
    primary: string;
    secondary: string;
    profile: string;
    program: string;
    today: string;
    calendar: string;
    nutrition: string;
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
    nutrition: string;
    progress: string;
    profile: string;
  };
  auth: {
    entryTitle: string;
    entrySubtitle: string;
    signIn: string;
    signUp: string;
    logout: string;
    signedInAthlete: string;
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
    hubDetail: string;
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
    notificationsDetail: string;
    programOverview: string;
    developmentMode: string;
    settingsDetail: string;
    security: string;
    securityDetail: string;
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
    profileDetail: string;
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
    movements: string;
    posteriorChainEmphasis: string;
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
      help: "Help",
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
      language: "Language",
      primary: "Primary",
      secondary: "Secondary",
      profile: "Profile",
      program: "Program",
      today: "Today",
      calendar: "Calendar",
      nutrition: "Nutrition",
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
    nav: { today: "Today", calendar: "Calendar", nutrition: "Nutrition", progress: "Progress", profile: "Profile" },
    auth: {
      entryTitle: "AthlexForce",
      entrySubtitle: "A premium training experience for athletes and coaches",
      signIn: "Sign in",
      signUp: "Sign up",
      logout: "Logout",
      signedInAthlete: "Signed in athlete"
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
      profileCaption: "Keep the same athlete details through every step.",
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
      buildingPlanSubtitle: "A calm pause while your plan is being prepared.",
      planReadyTitle: "Your Plan is Ready",
      planReadySubtitle: "Phase 1 is ready to review until you begin.",
      programTitle: "Program Overview",
      programSubtitle: "Phase 1, progress, and current structure."
    },
    profile: {
      hubTitle: "Profile",
      hubDetail: "Profile hub and core settings",
      provisionalHub: "Profile hub and core settings",
      signedInAs: "Signed in as",
      currentPlan: "Current plan",
      active: "Active",
      proposed: "Proposed",
      daysPerWeek: "Days / week",
      duration: "Duration",
      location: "Location",
      profileEditing: "Profile editing",
      notifications: "Notifications",
      notificationsDetail: "Workout, progress, and coaching reminders",
      programOverview: "Program overview",
      developmentMode: "Workspace mode",
      settingsDetail: "Language, training, and account preferences",
      security: "Security",
      securityDetail: "Password, sessions, and account access",
      profileSaved: "profile saved",
      programUpdatePending: "Program update pending",
      noPendingProgramUpdates: "No pending program updates"
    },
    coach: {
      accessDeniedTitle: "Access denied",
      accessDeniedCopy: "This account is not set up for coach access yet.",
      dashboardTitle: "Coach dashboard",
      dataNotReadyTitle: "Coach data is not ready yet",
      dataNotReadyCopy: "Coach data is not ready in this workspace yet.",
      assignedAthletesOnly: "Assigned athletes only. Review the athletes that need attention first.",
      needsAttention: "Needs attention",
      quickLinks: "Quick links",
      athletes: "Athletes",
      reviews: "Reviews",
      profile: "Profile",
      profileDetail: "Identity and current plan"
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
      sets: "Sets",
      movements: "Movements",
      posteriorChainEmphasis: "Posterior chain emphasis"
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
      back: "AtrÃ¡s",
      continue: "Continuar",
      skip: "Saltar",
      save: "Guardar",
      retry: "Reintentar",
      help: "Ayuda",
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
      signOut: "Cerrar sesiÃ³n",
      loading: "Cargando",
      language: "Idioma",
      primary: "Principal",
      secondary: "Secundaria",
      profile: "Perfil",
      program: "Programa",
      today: "Hoy",
      calendar: "Calendario",
      nutrition: "NutriciÃ³n",
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
    locale: { es: "EspaÃ±ol", ca: "CatalÃ ", en: "InglÃ©s", de: "AlemÃ¡n" },
    nav: { today: "Hoy", calendar: "Calendario", nutrition: "NutriciÃ³n", progress: "Progreso", profile: "Perfil" },
    auth: { entryTitle: "AthlexForce", entrySubtitle: "Una experiencia premium para atletas y coaches", signIn: "Entrar", signUp: "Crear cuenta", logout: "Salir", signedInAthlete: "Atleta autenticado" },
    onboarding: {
      title: "Onboarding",
      subtitle: "Configura el atleta antes de revelar el plan.",
      introTitle: "Empieza por lo bÃ¡sico",
      introSubtitle: "Configura el atleta antes de revelar el plan.",
      introBasicsTitle: "Empieza por lo bÃ¡sico",
      introBasicsCaption: "AthlexForce usa un Ãºnico contexto de atleta para perfil, objetivos, entrenamiento, nutriciÃ³n, baseline y la revelaciÃ³n del plan.",
      whatWeSetUp: "QuÃ© vamos a configurar",
      profileTitle: "Perfil",
      profileSubtitle: "Nombre, edad, altura, peso y unidades.",
      profileQuestion: "Â¿CÃ³mo te llamamos?",
      profileCaption: "MantÃ©n los mismos datos del atleta en cada paso.",
      goalsTitle: "Objetivos",
      goalsSubtitle: "Objetivo principal y prioridades ordenadas.",
      goalsQuestion: "Define el objetivo principal",
      goalsCaption: "MantÃ©n el lenguaje visual simple. El objetivo y las prioridades deben leerse bien en mÃ³vil.",
      trainingExperienceTitle: "Experiencia de entrenamiento",
      trainingExperienceSubtitle: "Frecuencia, confianza, cargas y familiaridad con movimientos.",
      trainingExperienceSummary: "Resumen de experiencia",
      trainingPreferencesTitle: "Preferencias de entrenamiento",
      trainingPreferencesSubtitle: "DÃ­as, duraciÃ³n, equipo, variedad y descanso.",
      trainingPreferencesCaption: "Anclas repetibles",
      scheduleTitle: "Horario y estilo de vida",
      scheduleSubtitle: "Trabajo, sueÃ±o, estrÃ©s, hidrataciÃ³n y ventanas de entrenamiento.",
      healthTitle: "Salud y limitaciones",
      healthSubtitle: "MantÃ©n esto tranquilo, privado y sin diagnÃ³stico.",
      nutritionTitle: "Preferencias de nutriciÃ³n",
      nutritionSubtitle: "Alergias, restricciones, rutina y flexibilidad.",
      baselineTitle: "Baseline",
      baselineSubtitle: "Medidas y fotos privadas opcionales.",
      reviewTitle: "RevisiÃ³n final",
      reviewSubtitle: "Confirma el perfil antes de construir el plan.",
      buildingPlanTitle: "Construyendo tu plan",
      buildingPlanSubtitle: "Una pausa tranquila mientras tu plan se prepara.",
      planReadyTitle: "Tu plan estÃ¡ listo",
      planReadySubtitle: "La Fase 1 estÃ¡ lista para revisar hasta que empieces.",
      programTitle: "Resumen del programa",
      programSubtitle: "Fase 1, progreso y estructura actual."
    },
    profile: {
      hubTitle: "Perfil",
      hubDetail: "Centro de perfil y ajustes base",
      provisionalHub: "Centro de perfil y ajustes base",
      signedInAs: "SesiÃ³n iniciada como",
      currentPlan: "Plan actual",
      active: "Activo",
      proposed: "Propuesto",
      daysPerWeek: "DÃ­as / semana",
      duration: "DuraciÃ³n",
      location: "UbicaciÃ³n",
      profileEditing: "EdiciÃ³n de perfil",
      notifications: "Notificaciones",
      notificationsDetail: "Recordatorios de entrenamiento, progreso y coaching",
      programOverview: "Resumen del programa",
      developmentMode: "Modo de trabajo",
      settingsDetail: "Idioma, entrenamiento y preferencias de cuenta",
      security: "Seguridad",
      securityDetail: "ContraseÃ±a, sesiones y acceso a la cuenta",
      profileSaved: "perfil guardado",
      programUpdatePending: "ActualizaciÃ³n del programa pendiente",
      noPendingProgramUpdates: "Sin actualizaciones pendientes"
    },
    coach: {
      accessDeniedTitle: "Acceso denegado",
      accessDeniedCopy: "Esta cuenta todavÃ­a no tiene acceso de coach.",
      dashboardTitle: "Panel de coach",
      dataNotReadyTitle: "Los datos del coach aÃºn no estÃ¡n listos",
      dataNotReadyCopy: "Los datos de coach todavÃ­a no estÃ¡n listos en este espacio.",
      assignedAthletesOnly: "Solo atletas asignados. Revisa primero los que necesitan atenciÃ³n.",
      needsAttention: "Necesita atenciÃ³n",
      quickLinks: "Accesos rÃ¡pidos",
      athletes: "Atletas",
      reviews: "Revisiones",
      profile: "Perfil",
      profileDetail: "Identidad y plan actual"
    },
    calendar: {
      title: "Calendario",
      previousMonth: "Mes anterior",
      nextMonth: "Mes siguiente",
      nutrition: "NutriciÃ³n",
      cardioHabits: "Cardio y hÃ¡bitos",
      viewDay: "Ver dÃ­a",
      monthFallback: "Mes actual"
    },
    today: {
      restDay: "DÃ­a de descanso",
      recoveryDay: "DÃ­a de recuperaciÃ³n",
      nextWorkout: "PrÃ³ximo entrenamiento",
      targetZones: "Zonas objetivo",
      primary: "Principal",
      secondary: "Secundaria",
      readyTomorrow: "Listo maÃ±ana",
      duration: "DuraciÃ³n",
      calories: "CalorÃ­as",
      cardio: "Cardio",
      volume: "Volumen",
      sets: "Series",
      movements: "Movimientos",
      posteriorChainEmphasis: "Ã‰nfasis en la cadena posterior"
    },
    program: {
      overview: "Resumen del programa",
      myProgram: "Mi programa",
      weeklyStructure: "Estructura semanal",
      workoutTemplates: "Plantillas de entrenamiento",
      keyMovements: "Movimientos clave",
      progression: "ProgresiÃ³n",
      nutrition: "NutriciÃ³n",
      cardio: "Cardio",
      recovery: "RecuperaciÃ³n",
      habits: "HÃ¡bitos",
      checkIn: "Check-in",
      reviewTimeline: "Calendario de revisiÃ³n",
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
      help: "Ajuda",
      close: "Tanca",
      edit: "Edita",
      review: "Revisa",
      apply: "Aplica",
      approve: "Aprova",
      reject: "Rebutja",
      startOnboarding: "ComenÃ§a l'onboarding",
      startWorkout: "ComenÃ§a l'entrenament",
      viewWorkout: "Veure entrenament",
      openSettings: "Obre els ajustos",
      signOut: "Tanca la sessiÃ³",
      loading: "Carregant",
      language: "Idioma",
      primary: "Principal",
      secondary: "SecundÃ ria",
      profile: "Perfil",
      program: "Programa",
      today: "Avui",
      calendar: "Calendari",
      nutrition: "NutriciÃ³",
      progress: "ProgrÃ©s",
      coachPanel: "Panell de coach",
      dashboard: "Tauler",
      athletes: "Atletes",
      reviews: "Revisions",
      notifications: "Notificacions",
      settings: "Ajustos",
      unauthorized: "Sense accÃ©s",
      networkFailure: "Error de xarxa",
      error: "Error",
      success: "Correcte",
      noData: "Sense dades"
    },
    locale: { es: "CastellÃ ", ca: "CatalÃ ", en: "AnglÃ¨s", de: "Alemany" },
    nav: { today: "Avui", calendar: "Calendari", nutrition: "NutriciÃ³", progress: "ProgrÃ©s", profile: "Perfil" },
    auth: { entryTitle: "AthlexForce", entrySubtitle: "Una experiÃ¨ncia premium per a atletes i coaches", signIn: "Inicia sessiÃ³", signUp: "Crea un compte", logout: "Surt", signedInAthlete: "Atleta autenticat" },
    onboarding: {
      title: "Onboarding",
      subtitle: "Configura l'atleta abans de revelar el pla.",
      introTitle: "ComenÃ§a pel bÃ sic",
      introSubtitle: "Configura l'atleta abans de revelar el pla.",
      introBasicsTitle: "ComenÃ§a pel bÃ sic",
      introBasicsCaption: "AthlexForce fa servir un Ãºnic context d'atleta per perfil, objectius, entrenament, nutriciÃ³, baseline i la revelaciÃ³ del pla.",
      whatWeSetUp: "QuÃ¨ configurarem",
      profileTitle: "Perfil",
      profileSubtitle: "Nom, edat, alÃ§ada, pes i unitats.",
      profileQuestion: "Com t'hem de dir?",
      profileCaption: "MantÃ©n les mateixes dades de l'atleta a cada pas.",
      goalsTitle: "Objectius",
      goalsSubtitle: "Objectiu principal i prioritats ordenades.",
      goalsQuestion: "Defineix l'objectiu principal",
      goalsCaption: "MantÃ©n el llenguatge visual simple. L'objectiu i les prioritats s'han de llegir bÃ© al mÃ²bil.",
      trainingExperienceTitle: "ExperiÃ¨ncia d'entrenament",
      trainingExperienceSubtitle: "FreqÃ¼Ã¨ncia, confianÃ§a, cÃ rregues i familiaritat amb moviments.",
      trainingExperienceSummary: "Resum d'experiÃ¨ncia",
      trainingPreferencesTitle: "PreferÃ¨ncies d'entrenament",
      trainingPreferencesSubtitle: "Dies, durada, equip, varietat i descans.",
      trainingPreferencesCaption: "Ancoratges repetibles",
      scheduleTitle: "Horari i estil de vida",
      scheduleSubtitle: "Feina, son, estrÃ¨s, hidrataciÃ³ i franges d'entrenament.",
      healthTitle: "Salut i limitacions",
      healthSubtitle: "MantÃ©n aixÃ² tranquil, privat i sense diagnÃ²stic.",
      nutritionTitle: "PreferÃ¨ncies de nutriciÃ³",
      nutritionSubtitle: "AlÂ·lÃ¨rgies, restriccions, rutina i flexibilitat.",
      baselineTitle: "Baseline",
      baselineSubtitle: "Mesures i fotos privades opcionals.",
      reviewTitle: "RevisiÃ³ final",
      reviewSubtitle: "Confirma el perfil abans de construir el pla.",
      buildingPlanTitle: "Construint el teu pla",
      buildingPlanSubtitle: "Una pausa tranquilÂ·la mentre el teu pla es prepara.",
      planReadyTitle: "El teu pla estÃ  llest",
      planReadySubtitle: "La Fase 1 estÃ  llesta per revisar fins que comencis.",
      programTitle: "Resum del programa",
      programSubtitle: "Fase 1, progrÃ©s i estructura actual."
    },
    profile: {
      hubTitle: "Perfil",
      hubDetail: "Centre de perfil i ajustos base",
      provisionalHub: "Centre de perfil i ajustos base",
      signedInAs: "SessiÃ³ iniciada com a",
      currentPlan: "Pla actual",
      active: "Actiu",
      proposed: "Proposat",
      daysPerWeek: "Dies / setmana",
      duration: "Durada",
      location: "UbicaciÃ³",
      profileEditing: "EdiciÃ³ de perfil",
      notifications: "Notificacions",
      notificationsDetail: "Recordatoris d'entrenament, progrÃ©s i coaching",
      programOverview: "Resum del programa",
      developmentMode: "Mode de treball",
      settingsDetail: "Idioma, entrenament i preferÃ¨ncies del compte",
      security: "Seguretat",
      securityDetail: "Contrasenya, sessions i accÃ©s al compte",
      profileSaved: "perfil desat",
      programUpdatePending: "ActualitzaciÃ³ del programa pendent",
      noPendingProgramUpdates: "Sense actualitzacions pendents"
    },
    coach: {
      accessDeniedTitle: "AccÃ©s denegat",
      accessDeniedCopy: "Aquest compte encara no tÃ© accÃ©s de coach.",
      dashboardTitle: "Tauler de coach",
      dataNotReadyTitle: "Les dades del coach encara no estan llestes",
      dataNotReadyCopy: "Les dades de coach encara no estan llestes en aquest espai.",
      assignedAthletesOnly: "NomÃ©s atletes assignats. Revisa primer els que necessiten atenciÃ³.",
      needsAttention: "Necessita atenciÃ³",
      quickLinks: "Accessos rÃ pids",
      athletes: "Atletes",
      reviews: "Revisions",
      profile: "Perfil",
      profileDetail: "Identitat i pla actual"
    },
    calendar: {
      title: "Calendari",
      previousMonth: "Mes anterior",
      nextMonth: "Mes segÃ¼ent",
      nutrition: "NutriciÃ³",
      cardioHabits: "Cardio i hÃ bits",
      viewDay: "Veure dia",
      monthFallback: "Mes actual"
    },
    today: {
      restDay: "Dia de descans",
      recoveryDay: "Dia de recuperaciÃ³",
      nextWorkout: "Proper entrenament",
      targetZones: "Zones objectiu",
      primary: "Principal",
      secondary: "SecundÃ ria",
      readyTomorrow: "A punt demÃ ",
      duration: "Durada",
      calories: "Calories",
      cardio: "Cardio",
      volume: "Volum",
      sets: "SÃ¨ries",
      movements: "Moviments",
      posteriorChainEmphasis: "Ãˆmfasi en la cadena posterior"
    },
    program: {
      overview: "Resum del programa",
      myProgram: "El meu programa",
      weeklyStructure: "Estructura setmanal",
      workoutTemplates: "Plantilles d'entrenament",
      keyMovements: "Moviments clau",
      progression: "ProgressiÃ³",
      nutrition: "NutriciÃ³",
      cardio: "Cardio",
      recovery: "RecuperaciÃ³",
      habits: "HÃ bits",
      checkIn: "Check-in",
      reviewTimeline: "Calendari de revisiÃ³",
      recentAdjustments: "Ajustos recents"
    }
  },
  de: {
    common: {
      back: "ZurÃ¼ck",
      continue: "Weiter",
      skip: "Ãœberspringen",
      save: "Speichern",
      retry: "Erneut versuchen",
      help: "Hilfe",
      close: "SchlieÃŸen",
      edit: "Bearbeiten",
      review: "PrÃ¼fen",
      apply: "Anwenden",
      approve: "Genehmigen",
      reject: "Ablehnen",
      startOnboarding: "Onboarding starten",
      startWorkout: "Training starten",
      viewWorkout: "Training ansehen",
      openSettings: "Einstellungen Ã¶ffnen",
      signOut: "Abmelden",
      loading: "LÃ¤dt",
      language: "Sprache",
      primary: "PrimÃ¤r",
      secondary: "SekundÃ¤r",
      profile: "Profil",
      program: "Programm",
      today: "Heute",
      calendar: "Kalender",
      nutrition: "ErnÃ¤hrung",
      progress: "Fortschritt",
      coachPanel: "Coach-Panel",
      dashboard: "Ãœbersicht",
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
    nav: { today: "Heute", calendar: "Kalender", nutrition: "ErnÃ¤hrung", progress: "Fortschritt", profile: "Profil" },
    auth: { entryTitle: "AthlexForce", entrySubtitle: "Ein hochwertiges Trainingserlebnis fÃ¼r Athleten und Coaches", signIn: "Anmelden", signUp: "Konto erstellen", logout: "Abmelden", signedInAthlete: "Angemeldeter Athlet" },
    onboarding: {
      title: "Onboarding",
      subtitle: "Lege das Athleten-Setup fest, bevor der Plan angezeigt wird.",
      introTitle: "Mit den Grundlagen beginnen",
      introSubtitle: "Lege das Athleten-Setup fest, bevor der Plan angezeigt wird.",
      introBasicsTitle: "Mit den Grundlagen beginnen",
      introBasicsCaption: "AthlexForce verwendet einen einheitlichen Athletenkontext fÃ¼r Profil, Ziele, Training, ErnÃ¤hrung, Baseline und Plananzeige.",
      whatWeSetUp: "Was wir einrichten",
      profileTitle: "Profil",
      profileSubtitle: "Name, Alter, GrÃ¶ÃŸe, Gewicht und Einheiten.",
      profileQuestion: "Wie sollen wir dich nennen?",
      profileCaption: "Verwende durchgehend dieselben Athletendaten.",
      goalsTitle: "Ziele",
      goalsSubtitle: "Hauptziel und geordnete PrioritÃ¤ten.",
      goalsQuestion: "Lege das Hauptziel fest",
      goalsCaption: "Halte die visuelle Sprache einfach. Ziel und PrioritÃ¤ten sollen auf MobilgerÃ¤ten klar lesbar sein.",
      trainingExperienceTitle: "Trainingserfahrung",
      trainingExperienceSubtitle: "Frequenz, Vertrauen, Lasten und Bewegungsroutine.",
      trainingExperienceSummary: "ErfahrungsÃ¼bersicht",
      trainingPreferencesTitle: "TrainingsprÃ¤ferenzen",
      trainingPreferencesSubtitle: "Tage, Dauer, Equipment, Vielfalt und Pausen.",
      trainingPreferencesCaption: "Wiederholbare Anker",
      scheduleTitle: "Zeitplan & Lebensstil",
      scheduleSubtitle: "Arbeit, Schlaf, Stress, Hydration und Trainingsfenster.",
      healthTitle: "Gesundheit & EinschrÃ¤nkungen",
      healthSubtitle: "Bleibe ruhig, privat und ohne Diagnose.",
      nutritionTitle: "ErnÃ¤hrungsprÃ¤ferenzen",
      nutritionSubtitle: "Allergien, Restriktionen, Routine und FlexibilitÃ¤t.",
      baselineTitle: "Baseline",
      baselineSubtitle: "Messungen und optionale private Fortschrittsfotos.",
      reviewTitle: "AbschlieÃŸende PrÃ¼fung",
      reviewSubtitle: "BestÃ¤tige das Profil, bevor der Plan gebaut wird.",
      buildingPlanTitle: "Plan wird erstellt",
      buildingPlanSubtitle: "Eine ruhige Pause, wÃ¤hrend dein Plan vorbereitet wird.",
      planReadyTitle: "Dein Plan ist bereit",
      planReadySubtitle: "Phase 1 ist bereit zur PrÃ¼fung, bis du startest.",
      programTitle: "ProgrammÃ¼bersicht",
      programSubtitle: "Phase 1, Fortschritt und aktuelle Struktur."
    },
    profile: {
      hubTitle: "Profil",
      hubDetail: "Profil-Hub und Grundeinstellungen",
      provisionalHub: "Profil-Hub und Grundeinstellungen",
      signedInAs: "Angemeldet als",
      currentPlan: "Aktueller Plan",
      active: "Aktiv",
      proposed: "Vorgeschlagen",
      daysPerWeek: "Tage / Woche",
      duration: "Dauer",
      location: "Ort",
      profileEditing: "Profilbearbeitung",
      notifications: "Benachrichtigungen",
      notificationsDetail: "Erinnerungen zu Training, Fortschritt und Coaching",
      programOverview: "ProgrammÃ¼bersicht",
      developmentMode: "Arbeitsmodus",
      settingsDetail: "Sprache, Training und Kontoeinstellungen",
      security: "Sicherheit",
      securityDetail: "Passwort, Sitzungen und Kontozugriff",
      profileSaved: "Profil gespeichert",
      programUpdatePending: "Programmaktualisierung ausstehend",
      noPendingProgramUpdates: "Keine ausstehenden Programmaktualisierungen"
    },
    coach: {
      accessDeniedTitle: "Zugriff verweigert",
      accessDeniedCopy: "Dieses Konto ist noch nicht fÃ¼r den Coach-Zugang eingerichtet.",
      dashboardTitle: "Coach-Ãœbersicht",
      dataNotReadyTitle: "Coach-Daten sind noch nicht bereit",
      dataNotReadyCopy: "Die Coach-Daten sind in diesem Arbeitsbereich noch nicht bereit.",
      assignedAthletesOnly: "Nur zugewiesene Athleten. PrÃ¼fe zuerst die mit Handlungsbedarf.",
      needsAttention: "BenÃ¶tigt Aufmerksamkeit",
      quickLinks: "Schnellzugriffe",
      athletes: "Athleten",
      reviews: "Reviews",
      profile: "Profil",
      profileDetail: "Identität und aktueller Plan"
    },
    calendar: {
      title: "Kalender",
      previousMonth: "Vorheriger Monat",
      nextMonth: "NÃ¤chster Monat",
      nutrition: "ErnÃ¤hrung",
      cardioHabits: "Cardio & Gewohnheiten",
      viewDay: "Tag ansehen",
      monthFallback: "Aktueller Monat"
    },
    today: {
      restDay: "Ruhetag",
      recoveryDay: "Regenerationstag",
      nextWorkout: "NÃ¤chstes Training",
      targetZones: "Zielzonen",
      primary: "PrimÃ¤r",
      secondary: "SekundÃ¤r",
      readyTomorrow: "Morgen bereit",
      duration: "Dauer",
      calories: "Kalorien",
      cardio: "Cardio",
      volume: "Volumen",
      sets: "SÃ¤tze",
      movements: "Ãœbungen",
      posteriorChainEmphasis: "Fokus auf die hintere Muskelkette"
    },
    program: {
      overview: "ProgrammÃ¼bersicht",
      myProgram: "Mein Programm",
      weeklyStructure: "Wochenstruktur",
      workoutTemplates: "Trainingsvorlagen",
      keyMovements: "KernÃ¼bungen",
      progression: "Progression",
      nutrition: "ErnÃ¤hrung",
      cardio: "Cardio",
      recovery: "Regeneration",
      habits: "Gewohnheiten",
      checkIn: "Check-in",
      reviewTimeline: "Review-Zeitplan",
      recentAdjustments: "Letzte Anpassungen"
    }
  }
};

export { messages as i18nMessages };

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
  if (preferredLocale != null) {
    return normalizeLocale(preferredLocale);
  }

  return readPersistedLocale() ?? detectBrowserLocale() ?? "es";
}

export function setLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") {
    return;
  }

  const secureAttribute = typeof window !== "undefined" && window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${localeCookieName}=${encodeURIComponent(locale)}; path=/; max-age=31536000; samesite=lax${secureAttribute}`;
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
