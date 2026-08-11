// Every visitor-facing string, per locale. The English site lives at `/`, the
// German one at `/de`, each with its own root layout so the html lang attribute
// is right for the page being read.

export type Locale = "en" | "de";

export const PRIVACY_PATH: Record<Locale, string> = {
  en: "/privacy",
  de: "/de/datenschutz",
};

type StepCopy = { label: string; title: string; summary: string };

export type Copy = {
  themeToggle: string;
  consent: {
    label: string;
    text: string;
    learnMore: string;
    decline: string;
    accept: string;
    reopen: string;
  };
  hero: {
    eyebrow: string;
    title: string;
  };
  booking: {
    primary: string;
    primaryNote: string;
    secondary: string;
    unavailable: string;
    intro: string;
    loading: string;
    error: string;
    openScheduler: string;
    done: string;
  };
  workflow: {
    eyebrow: string;
    title: string;
    subtitle: string;
    hintCompact: string;
    hintWide: string;
    systemLabel: string;
    legendAutomated: string;
    legendYou: string;
    legendClientPage: string;
    executionLabel: string;
    completedRun: string;
    footer: string;
    footerCta: string;
    steps: Record<"build" | "market" | "fulfill" | "improve", StepCopy>;
    salesPage: { title: string; offer: string; choose: string };
    portal: { title: string; start: string };
    result: { title: string; revise: string; accept: string };
    build: { eyebrow: string; title: string; note: string; cta: string };
    marketing: { title: string; note: string; nextClient: string };
    workflowNode: {
      eyebrow: string;
      title: string;
      note: string;
      yourInput: string;
      revisionAgent: string;
    };
    improvement: {
      eyebrow: string;
      title: string;
      note: string;
      caption: string;
    };
    revisionReturn: string;
    improvementReturn: string;
  };
  mission: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
  };
  footer: { privacy: string };
};

export const COPY: Record<Locale, Copy> = {
  en: {
    themeToggle: "Toggle color theme",
    consent: {
      label: "Privacy choices",
      text: "Allow optional Reddit and Meta measurement for visits and completed bookings.",
      learnMore: "Learn more",
      decline: "No thanks",
      accept: "Allow",
      reopen: "Privacy choices",
    },
    hero: {
      eyebrow: "For freelancers, agencies, and expert service businesses",
      title: "Turn your service into an automatable workflow.",
    },
    booking: {
      primary: "Build your workflow",
      primaryNote: "Starts with a 30-minute workflow fit call",
      secondary: "See how it works",
      unavailable: "Booking is temporarily unavailable.",
      intro:
        "Pick a time that works for you. It’s a workflow fit call — bring one repeatable service.",
      loading: "Loading available times…",
      error: "The scheduler did not load in this page.",
      openScheduler: "Open scheduling page",
      done: "Thanks — your call is booked. We look forward to talking to you.",
    },
    workflow: {
      eyebrow: "How it works",
      title: "Build. Market. Fulfill. Improve.",
      subtitle:
        "Four connected steps turn your service into a system that delivers and learns.",
      hintCompact: "Scroll to explore",
      hintWide: "Hover to focus",
      systemLabel: "Skilldwork service system",
      legendAutomated: "Automated",
      legendYou: "Handled by you",
      legendClientPage: "Client page",
      executionLabel: "Automated service execution",
      completedRun: "Completed run",
      footer:
        "You create demand. Skilldwork delivers each service and improves the next run.",
      footerCta: "Build your workflow",
      steps: {
        build: {
          label: "01 · Build",
          title: "Build your workflow",
          summary:
            "We turn your service into a Sales Page and automated delivery workflow.",
        },
        market: {
          label: "02 · Market",
          title: "Create demand",
          summary:
            "You focus on marketing while one link brings clients into the system.",
        },
        fulfill: {
          label: "03 · Fulfill",
          title: "Deliver the result",
          summary:
            "Onboarding, delivery, results, and revisions run through one connected workflow.",
        },
        improve: {
          label: "04 · Improve",
          title: "Improve every run",
          summary:
            "Every completed client order helps the system deliver the next one better.",
        },
      },
      salesPage: { title: "Sales Page", offer: "Offer", choose: "Choose offer" },
      portal: { title: "Client Portal", start: "Start service" },
      result: { title: "Result", revise: "Revise", accept: "Accept" },
      build: {
        eyebrow: "Start here",
        title: "Build your workflow",
        note: "Sales Page + delivery",
        cta: "Book a call",
      },
      marketing: {
        title: "Marketing",
        note: "Handled by you",
        nextClient: "↻ Next client",
      },
      workflowNode: {
        eyebrow: "Execution",
        title: "Workflow",
        note: "process → deliver",
        yourInput: "Your input if needed",
        revisionAgent: "Revision Agent",
      },
      improvement: {
        eyebrow: "Completed runs",
        title: "Improvement Agent",
        note: "Improves future delivery",
        caption: "Better with every run",
      },
      revisionReturn: "Revision returns to workflow",
      improvementReturn: "Improved workflow returns to execution",
    },
    mission: {
      eyebrow: "Our mission",
      title: "The last humans working.",
      lead: "The best providers in their field won’t keep doing the job themselves. They’ll build and optimize the agent-workflows that do it.",
      body: "Our mission is to give clients everywhere access to the best services in the world — by making it easy for the most skilled providers to build, run and sell agent-run services at scale, without giving up what made them the best.",
    },
    footer: { privacy: "Privacy" },
  },

  de: {
    themeToggle: "Farbschema wechseln",
    consent: {
      label: "Datenschutz-Einstellungen",
      text: "Optionale Messung von Reddit und Meta für Besuche und abgeschlossene Buchungen erlauben.",
      learnMore: "Mehr erfahren",
      decline: "Nein danke",
      accept: "Erlauben",
      reopen: "Datenschutz",
    },
    hero: {
      eyebrow: "Für Freelancer, Agenturen und Expertendienstleister",
      title: "Mach aus deinem Dienst einen Workflow, der ohne dich läuft.",
    },
    booking: {
      primary: "Workflow bauen",
      primaryNote: "Startet mit einem 30-Minuten-Gespräch",
      secondary: "So funktioniert’s",
      unavailable: "Die Buchung ist gerade nicht verfügbar.",
      intro:
        "Such dir eine Zeit aus, die dir passt. Es geht um einen Dienst, den du ständig wiederholst — bring den mit.",
      loading: "Verfügbare Zeiten werden geladen…",
      error: "Der Kalender konnte auf dieser Seite nicht geladen werden.",
      openScheduler: "Buchungsseite öffnen",
      done: "Danke — dein Termin steht. Wir freuen uns aufs Gespräch.",
    },
    workflow: {
      eyebrow: "So funktioniert’s",
      title: "Bauen. Vermarkten. Ausführen. Verbessern.",
      subtitle:
        "Vier Schritte machen aus deinem Dienst ein System, das liefert und dazulernt.",
      hintCompact: "Scrollen zum Erkunden",
      hintWide: "Zum Fokussieren drüberfahren",
      systemLabel: "Das Skilldwork-System",
      legendAutomated: "Automatisiert",
      legendYou: "Von dir",
      legendClientPage: "Kundenseite",
      executionLabel: "Automatisierte Ausführung",
      completedRun: "Durchlauf fertig",
      footer:
        "Du schaffst Nachfrage. Skilldwork liefert jeden Auftrag und macht den nächsten besser.",
      footerCta: "Workflow bauen",
      steps: {
        build: {
          label: "01 · Bauen",
          title: "Deinen Workflow bauen",
          summary:
            "Wir machen aus deinem Dienst eine Verkaufsseite und einen automatisierten Ablauf.",
        },
        market: {
          label: "02 · Vermarkten",
          title: "Nachfrage schaffen",
          summary:
            "Du kümmerst dich ums Marketing, ein Link bringt Kunden ins System.",
        },
        fulfill: {
          label: "03 · Ausführen",
          title: "Das Ergebnis liefern",
          summary:
            "Onboarding, Ausführung, Ergebnis und Korrekturen laufen in einem Ablauf.",
        },
        improve: {
          label: "04 · Verbessern",
          title: "Jeden Durchlauf verbessern",
          summary:
            "Jeder abgeschlossene Auftrag hilft dem System, den nächsten besser zu liefern.",
        },
      },
      salesPage: {
        title: "Verkaufsseite",
        offer: "Angebot",
        choose: "Angebot wählen",
      },
      portal: { title: "Kundenportal", start: "Dienst starten" },
      result: { title: "Ergebnis", revise: "Korrektur", accept: "Annehmen" },
      build: {
        eyebrow: "Hier starten",
        title: "Deinen Workflow bauen",
        note: "Verkaufsseite + Lieferung",
        cta: "Termin buchen",
      },
      marketing: {
        title: "Marketing",
        note: "Machst du",
        nextClient: "↻ Nächster Kunde",
      },
      workflowNode: {
        eyebrow: "Ausführung",
        title: "Workflow",
        note: "verarbeiten → liefern",
        yourInput: "Dein Input, falls nötig",
        revisionAgent: "Korrektur-Agent",
      },
      improvement: {
        eyebrow: "Fertige Durchläufe",
        title: "Verbesserungs-Agent",
        note: "Verbessert künftige Durchläufe",
        caption: "Mit jedem Durchlauf besser",
      },
      revisionReturn: "Korrektur geht zurück in den Workflow",
      improvementReturn: "Verbesserter Workflow geht zurück in die Ausführung",
    },
    mission: {
      eyebrow: "Unsere Mission",
      title: "Die letzten Menschen, die arbeiten.",
      lead: "Die Besten in ihrem Fach werden die Arbeit nicht ewig selbst machen. Sie bauen die Agenten-Workflows, die sie erledigen, und verbessern sie.",
      body: "Unsere Mission ist, Kunden überall Zugang zu den besten Diensten der Welt zu geben — indem wir es den besten Anbietern leicht machen, agentengeführte Dienste zu bauen, zu betreiben und zu verkaufen, ohne aufzugeben, was sie zu den Besten gemacht hat.",
    },
    footer: { privacy: "Datenschutz" },
  },
};
