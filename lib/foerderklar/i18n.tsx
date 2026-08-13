"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { OfferId } from "./offers";
import { useLocaleStore } from "@/lib/use-locale-store";
import type { Locale } from "@/lib/locale";

export type { Locale };

type DeepString<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly (infer U)[]
      ? U extends string
        ? string[]
        : DeepString<U>[]
      : DeepString<T[K]>;
};

type Dict = DeepString<typeof en>;

const en = {
  brand: "FörderKlar",
  poweredBy: "Powered by skilldwork",
  nav: {
    about: "About",
    offers: "Offers",
    how: "How it works",
    results: "Results",
  },
  lang: { en: "EN", de: "DE" },
  sales: {
    title: "We find the funding programmes that fit your company",
    subtitle:
      "Company profile in — ranked shortlist of Bund, Land & EU programmes out. Or book guided application support for one programme.",
    private: "One-time service",
    clients: "180+ orders",
    fromPrice: "From €250",
    by: "By",
    provider: "FörderKlar Consulting",
    sidebarBlurb:
      "Grant clarity for German SMEs: scan relevant programmes, see what you can unlock, then either apply yourself or get application support — paid once, delivered once.",
    statsClients: "Orders",
    statsAvg: "Avg. match",
    statsDays: "Delivery",
    statsClientsVal: "180+",
    statsAvgVal: "€42k",
    statsDaysVal: "2–14d",
    chooseOffer: "Select an offer",
    ctaCheck: "Continue · €250",
    ctaApply: "Continue · €1,490",
    offerSelected: "Selected",
    priceNote: "One-time payment · no subscription",
    howTitle: "How the service runs",
    how1Title: "Choose & pay",
    how1Body: "Pick a one-time offer and connect your card.",
    how2Title: "Onboard in minutes",
    how2Body: "Company size, industry, goals — then Start Service.",
    how3Title: "Get your delivery",
    how3Body: "Receive the report. Revise with the provider if needed, then accept.",
    aboutTab: "About",
    offersTab: "Packages",
    mediaVideo: "€42k avg. funding match",
    mediaSample: "€10k–€50k digitalization",
    mediaProcess: "€25k+ typical unlock",
    mediaIndustries: "€50k–€350k ZIM / R&D",
    mediaDeliverable: "Check → Antrag → Bewilligung",
    videoPlay: "Play video",
    videoPending: "Video coming soon — cover ready for YouTube / Loom.",
    contact: "Contact",
    contactMessage: "Message",
    contactCall: "Call",
    contactHint: "Questions before you book? Reach the provider directly.",
    contactSent: "Message sent to the provider (preview).",
    contactPhone: "+49 89 1234 5678",
    aboutHeading: "About this service",
    aboutBody:
      "German SMEs rarely miss out on funding because programmes do not exist — they miss out because research is slow and opaque. We match your company profile (size, industry, location, goals) against current Bund, Land and EU programmes — e.g. digitalization support, ZIM, Forschungszulage, BAFA efficiency, INQA coaching — and deliver a ranked shortlist with sources, amount ranges, deadlines, and a clear next step.",
    whyTitle: "Why choose this service",
    why: [
      "Focused on German SME funding — not generic consulting decks",
      "Complete sources so you can apply yourself (Check package)",
      "Optional Antragsbegleitung for one programme when DIY is too heavy",
      "Unlimited revisions until you accept",
    ],
    getTitle: "What you get",
    get: [
      "Complete funding check for your company",
      "Sources and links to apply yourself (Check)",
      "Or check + guided application for one programme (€1,490)",
      "Clear next actions per programme — including current savings / grant ranges",
    ],
    processTitle: "How it works",
    process: [
      "Choose a package and complete checkout",
      "Fill in a short onboarding form about your company",
      "Receive your funding report (or application support package)",
      "Request a revision if needed, then accept the delivery",
    ],
    faqTitle: "FAQ",
    faq: [
      {
        q: "Who is this for?",
        a: "German GmbH, UG, Einzelunternehmen, and similar SMEs looking for grant or funding options.",
      },
      {
        q: "Is this a subscription?",
        a: "No. Both packages are one-time services.",
      },
      {
        q: "What does application support cost?",
        a: "€1,490 one-time for check + guided application for one selected programme — a common fixed-fee model in the market.",
      },
      {
        q: "Can I ask for changes?",
        a: "Yes — unlimited revisions. Message the provider before you accept; you can attach images or files.",
      },
    ],
  },
  offers: {
    check: {
      name: "Full Funding Check",
      tagline: "Detailed report with complete sources to apply yourself.",
      desc: "A complete funding check for your company: matching programmes across Bund, Land & EU, full sources, and a clear DIY path. €250 for this detailed report.",
      bullets: [
        "Company-based scan of relevant programmes",
        "Full sources & links to apply yourself",
        "Fit scores, amounts, and deadlines",
        "Unlimited revisions",
      ],
    },
    apply: {
      name: "Application Support",
      tagline: "Check + guided application for one programme.",
      desc: "Everything in the Full Funding Check, plus structured support to prepare and submit one funding application for your company. €1,490 one-time — the usual next step after a check when you do not want to run the Antrag alone.",
      bullets: [
        "Everything in the Full Funding Check",
        "Choose one priority programme together",
        "Document checklist, draft support & submission prep",
        "Unlimited revisions",
      ],
    },
    delivery: "Delivery",
    days: "days",
    revisions: "revisions",
    unlimitedRevisions: "Unlimited revisions",
    oneTime: "One-time",
  },
  account: {
    title: "My account",
    subtitle: "skilldwork",
    demoBadge: "Demo account",
    profile: "Profile",
    orders: "Orders",
    openOrders: "Open",
    completedOrders: "Completed",
    messages: "Messages",
    payments: "Payment methods",
    name: "Name",
    email: "Email",
    company: "Company",
    noOrders: "No orders yet.",
    noOpen: "No open orders.",
    noCompleted: "No completed orders yet.",
    status: "Status",
    offer: "Offer",
    paid: "Paid",
    card: "Card",
    addCard: "Default card",
    invoice: "Invoice sent by email",
    openService: "Open delivery",
    backToService: "Back to FörderKlar",
    withProvider: "FörderKlar Consulting",
    statuses: {
      idle: "Not started",
      running: "In progress",
      ready: "Ready to review",
      accepted: "Completed",
    },
  },
  checkout: {
    title: "Checkout",
    back: "Back to service",
    order: "Your order",
    pay: "Payment",
    cardLabel: "Card number",
    expiry: "Expiry",
    cvc: "CVC",
    nameOnCard: "Name on card",
    connect: "Pay & continue",
    connected: "Card connected",
    secure: "Preview checkout — no real charge.",
    email: "Work email",
    company: "Company name",
  },
  portal: {
    title: "Onboarding",
    subtitle: "Client portal",
    intro:
      "A few details about your company so we can prepare the right funding matches.",
    companyName: "Company name",
    industry: "Industry",
    size: "Company size",
    state: "Federal state",
    revenue: "Annual revenue (approx.)",
    goal: "What do you need funding for?",
    legalForm: "Legal form",
    start: "Start service",
    offerBadge: "Active offer",
    sizes: {
      "1-9": "1–9 employees",
      "10-49": "10–49 employees",
      "50-249": "50–249 employees",
      "250+": "250+ employees",
    },
    industries: {
      manufacturing: "Manufacturing",
      software: "Software / IT",
      energy: "Energy & climate",
      healthcare: "Healthcare",
      retail: "Retail / trade",
      services: "Professional services",
      other: "Other",
    },
    legalForms: {
      gmbh: "GmbH",
      ug: "UG",
      einzel: "Einzelunternehmen",
      gbr: "GbR",
      other: "Other",
    },
    revenues: {
      under500k: "Under €500k",
      "500k-2m": "€500k – €2m",
      "2m-10m": "€2m – €10m",
      "10m+": "€10m+",
    },
    goals: {
      digitalization: "Digitalization / software",
      hiring: "Hiring & training",
      green: "Energy efficiency / climate",
      rnd: "R&D / innovation",
      expansion: "Expansion / investment",
    },
  },
  workflow: {
    title: "Preparing your delivery",
    subtitle: "In progress",
    status: "Your order is being prepared",
    steps: {
      profile: "Reviewing company details",
      scan: "Checking funding programmes",
      score: "Ranking best matches",
      draft: "Writing next steps",
      review: "Final quality check",
      deliver: "Packaging your result",
    },
    running: "In progress…",
    revisionRunning: "Updating your delivery…",
    done: "Result ready",
    view: "View result",
  },
  results: {
    title: "Your funding matches",
    subtitle: "Delivery",
    fit: "Fit",
    amount: "Amount range",
    deadline: "Deadline",
    next: "Next step",
    revise: "Request revision",
    accept: "Accept delivery",
    accepted: "Service completed",
    acceptedBody:
      "Your service is complete. A confirmation and invoice have been sent to your email. You can find this order anytime in your skilldwork account.",
    accountCta: "Open my account",
    again: "Book another service",
    revisionTitle: "Message the provider",
    revisionHint:
      "Describe what should change. You can attach images or files for context.",
    revisionPlaceholder:
      "e.g. Please focus more on Bavaria state programmes and digitalization grants…",
    attach: "Add images or files",
    attachHint: "PNG, JPG, PDF · preview only",
    submitRevision: "Send to provider",
    cancel: "Cancel",
    basedOn: "Based on",
    employees: "employees",
    revisionNote: "Your message goes to the provider for a revised delivery",
    attachments: "Attachments",
    startAction: "Start application",
    startActionDone: "Application started",
  },
  chat: {
    title: "Chat with provider",
    placeholder: "Write a message…",
    send: "Send",
    welcome:
      "Hi — FörderKlar here. Ask anything about your matches or next steps.",
    autoReply:
      "Thanks — we got your message and will get back to you shortly.",
    open: "Open chat",
    empty: "No messages yet.",
  },
  apply: {
    title: "Start this funding path",
    subtitle: "Next step",
    intro:
      "Confirm a few details so the provider can prepare the application / next steps for this programme.",
    email: "Contact email",
    note: "Notes for the provider",
    notePlaceholder: "Anything we should know before starting…",
    submit: "Submit request",
    successTitle: "Request sent",
    successBody:
      "The provider received your request for this programme. You can track it in your account.",
    back: "Back to results",
    already: "You already started this programme.",
  },
  common: {
    continue: "Continue",
    required: "Required",
  },
} as const;

const de = {
  brand: "FörderKlar",
  poweredBy: "Powered by skilldwork",
  nav: {
    about: "Über uns",
    offers: "Angebote",
    how: "Ablauf",
    results: "Ergebnisse",
  },
  lang: { en: "EN", de: "DE" },
  sales: {
    title: "Wir finden die Förderprogramme, die zu eurem Unternehmen passen",
    subtitle:
      "Unternehmensprofil rein — gerankte Shortlist aus Bund, Land & EU raus. Oder Antragsbegleitung für ein Programm dazu buchen.",
    private: "Einmalige Dienstleistung",
    clients: "180+ Bestellungen",
    fromPrice: "Ab €250",
    by: "Von",
    provider: "FörderKlar Consulting",
    sidebarBlurb:
      "Förderklarheit für deutsche KMU: relevante Programme scannen, Spar- und Zuschusspotenzial sehen, dann selbst beantragen oder Antragsbegleitung nutzen — einmal zahlen, einmal liefern.",
    statsClients: "Bestellungen",
    statsAvg: "Ø Match",
    statsDays: "Lieferung",
    statsClientsVal: "180+",
    statsAvgVal: "€42k",
    statsDaysVal: "2–14 T.",
    chooseOffer: "Angebot wählen",
    ctaCheck: "Weiter · €250",
    ctaApply: "Weiter · €1.490",
    offerSelected: "Ausgewählt",
    priceNote: "Einmalzahlung · kein Abo",
    howTitle: "So läuft der Service",
    how1Title: "Wählen & zahlen",
    how1Body: "Einmal-Angebot wählen und Karte verbinden.",
    how2Title: "Onboarding in Minuten",
    how2Body: "Größe, Branche, Ziele — dann Service starten.",
    how3Title: "Lieferung erhalten",
    how3Body: "Bericht bekommen. Bei Bedarf mit dem Anbieter revisen, dann akzeptieren.",
    aboutTab: "Beschreibung",
    offersTab: "Pakete",
    mediaVideo: "€42k Ø Förder-Match",
    mediaSample: "€10k–€50k Digitalisierung",
    mediaProcess: "€25k+ typisch freigesetzt",
    mediaIndustries: "€50k–€350k ZIM / FuE",
    mediaDeliverable: "Check → Antrag → Bewilligung",
    videoPlay: "Video abspielen",
    videoPending: "Video folgt — Cover ist bereit für YouTube / Loom.",
    contact: "Kontakt",
    contactMessage: "Nachricht",
    contactCall: "Anrufen",
    contactHint: "Fragen vor der Buchung? Direkt den Anbieter erreichen.",
    contactSent: "Nachricht an den Anbieter gesendet (Vorschau).",
    contactPhone: "+49 89 1234 5678",
    aboutHeading: "Über diese Dienstleistung",
    aboutBody:
      "KMU scheitern selten am Bedarf — sondern an Rechercheaufwand und Intransparenz. Wir matchen euer Unternehmensprofil (Größe, Branche, Standort, Ziele) mit aktuellen Programmen von Bund, Land und EU — z. B. Digitalisierungsförderung, ZIM, Forschungszulage, BAFA Effizienz, INQA-Coaching — und liefern eine gerankte Shortlist mit Quellen, Betragsspannen, Fristen und klarem nächsten Schritt.",
    whyTitle: "Warum dieser Service",
    why: [
      "Fokus auf deutsche KMU-Förderung — keine generischen Beratungs-Decks",
      "Komplette Quellen zum selbst beantragen (Check-Paket)",
      "Optional Antragsbegleitung für ein Programm, wenn DIY zu schwer ist",
      "Unlimitierte Revisionen bis zur Annahme",
    ],
    getTitle: "Was ihr bekommt",
    get: [
      "Kompletter Fördercheck für euer Unternehmen",
      "Quellen und Links zum selbst beantragen (Check)",
      "Oder Check + Antragsbegleitung für ein Programm (€1.490)",
      "Klare nächste Schritte je Programm — inkl. aktueller Spar-/Zuschuss-Spannen",
    ],
    processTitle: "So funktioniert's",
    process: [
      "Paket wählen und Checkout abschließen",
      "Kurzes Onboarding zu eurem Unternehmen",
      "Förderbericht (oder Antragsbegleitungs-Paket) erhalten",
      "Bei Bedarf Revision anfragen, dann Lieferung akzeptieren",
    ],
    faqTitle: "FAQ",
    faq: [
      {
        q: "Für wen ist das?",
        a: "Deutsche GmbH, UG, Einzelunternehmen und vergleichbare KMU, die Förderoptionen suchen.",
      },
      {
        q: "Ist das ein Abo?",
        a: "Nein. Beide Pakete sind einmalige Dienstleistungen.",
      },
      {
        q: "Was kostet die Antragsbegleitung?",
        a: "€1.490 einmalig für Check + begleitete Antragstellung für ein ausgewähltes Programm — ein übliches Fixhonorar-Modell am Markt.",
      },
      {
        q: "Kann ich Änderungen anfragen?",
        a: "Ja — unlimitierte Revisionen. Schreibt dem Anbieter vor dem Accept; Bilder oder Dateien könnt ihr anhängen.",
      },
    ],
  },
  offers: {
    check: {
      name: "Förderkomplettcheck",
      tagline: "Ausführlicher Bericht mit kompletten Quellen zum selbst beantragen.",
      desc: "Kompletter Fördercheck für euer Unternehmen: passende Programme aus Bund, Land & EU, vollständige Quellen und klarer DIY-Pfad. €250 für diesen ausführlichen Bericht.",
      bullets: [
        "Unternehmensbezogener Scan relevanter Programme",
        "Vollständige Quellen & Links zum selbst beantragen",
        "Fit-Scores, Beträge und Fristen",
        "Unlimitierte Revisionen",
      ],
    },
    apply: {
      name: "Antragsbegleitung",
      tagline: "Check + begleitete Antragstellung für ein Programm.",
      desc: "Alles aus dem Förderkomplettcheck plus strukturierte Unterstützung, einen Förderantrag für euer Unternehmen vorzubereiten und einzureichen. €1.490 einmalig — der übliche nächste Schritt nach dem Check, wenn ihr den Antrag nicht allein fahren wollt.",
      bullets: [
        "Alles aus dem Förderkomplettcheck",
        "Gemeinsam ein Prioritätsprogramm wählen",
        "Dokumentencheckliste, Entwurfshilfe & Einreichungsvorbereitung",
        "Unlimitierte Revisionen",
      ],
    },
    delivery: "Lieferung",
    days: "Tage",
    revisions: "Revisionen",
    unlimitedRevisions: "Unlimitierte Revisionen",
    oneTime: "Einmalig",
  },
  account: {
    title: "Mein Konto",
    subtitle: "skilldwork",
    demoBadge: "Demo-Konto",
    profile: "Profil",
    orders: "Aufträge",
    openOrders: "Offen",
    completedOrders: "Erledigt",
    messages: "Nachrichten",
    payments: "Zahlungsmethoden",
    name: "Name",
    email: "E-Mail",
    company: "Unternehmen",
    noOrders: "Noch keine Aufträge.",
    noOpen: "Keine offenen Aufträge.",
    noCompleted: "Noch keine erledigten Aufträge.",
    status: "Status",
    offer: "Angebot",
    paid: "Bezahlt",
    card: "Karte",
    addCard: "Standardkarte",
    invoice: "Rechnung per E-Mail",
    openService: "Lieferung öffnen",
    backToService: "Zurück zu FörderKlar",
    withProvider: "FörderKlar Consulting",
    statuses: {
      idle: "Nicht gestartet",
      running: "In Bearbeitung",
      ready: "Zur Prüfung",
      accepted: "Abgeschlossen",
    },
  },
  checkout: {
    title: "Checkout",
    back: "Zurück zum Service",
    order: "Deine Bestellung",
    pay: "Zahlung",
    cardLabel: "Kartennummer",
    expiry: "Gültig bis",
    cvc: "CVC",
    nameOnCard: "Name auf der Karte",
    connect: "Zahlen & weiter",
    connected: "Karte verbunden",
    secure: "Vorschau-Checkout — keine echte Abbuchung.",
    email: "Geschäftliche E-Mail",
    company: "Firmenname",
  },
  portal: {
    title: "Onboarding",
    subtitle: "Client Portal",
    intro:
      "Ein paar Angaben zu eurem Unternehmen, damit wir die passenden Förderungen vorbereiten können.",
    companyName: "Firmenname",
    industry: "Branche",
    size: "Unternehmensgröße",
    state: "Bundesland",
    revenue: "Jahresumsatz (ca.)",
    goal: "Wofür braucht ihr Förderung?",
    legalForm: "Rechtsform",
    start: "Service starten",
    offerBadge: "Aktives Angebot",
    sizes: {
      "1-9": "1–9 Mitarbeitende",
      "10-49": "10–49 Mitarbeitende",
      "50-249": "50–249 Mitarbeitende",
      "250+": "250+ Mitarbeitende",
    },
    industries: {
      manufacturing: "Produktion / Industrie",
      software: "Software / IT",
      energy: "Energie & Klima",
      healthcare: "Gesundheit",
      retail: "Handel",
      services: "Dienstleistungen",
      other: "Sonstiges",
    },
    legalForms: {
      gmbh: "GmbH",
      ug: "UG",
      einzel: "Einzelunternehmen",
      gbr: "GbR",
      other: "Sonstiges",
    },
    revenues: {
      under500k: "Unter €500k",
      "500k-2m": "€500k – €2m",
      "2m-10m": "€2m – €10m",
      "10m+": "€10m+",
    },
    goals: {
      digitalization: "Digitalisierung / Software",
      hiring: "Personal & Weiterbildung",
      green: "Energieeffizienz / Klima",
      rnd: "FuE / Innovation",
      expansion: "Expansion / Investition",
    },
  },
  workflow: {
    title: "Lieferung wird vorbereitet",
    subtitle: "In Bearbeitung",
    status: "Eure Bestellung wird vorbereitet",
    steps: {
      profile: "Unternehmensdaten prüfen",
      scan: "Förderprogramme prüfen",
      score: "Beste Matches ranken",
      draft: "Nächste Schritte formulieren",
      review: "Qualitätscheck",
      deliver: "Ergebnis paketieren",
    },
    running: "In Bearbeitung…",
    revisionRunning: "Lieferung wird aktualisiert…",
    done: "Ergebnis bereit",
    view: "Ergebnis ansehen",
  },
  results: {
    title: "Eure Förder-Matches",
    subtitle: "Lieferung",
    fit: "Fit",
    amount: "Betragsspanne",
    deadline: "Frist",
    next: "Nächster Schritt",
    revise: "Revision anfragen",
    accept: "Lieferung akzeptieren",
    accepted: "Dienstleistung abgeschlossen",
    acceptedBody:
      "Eure Dienstleistung ist abgeschlossen. Bestätigung und Rechnung wurden per E-Mail versendet. Den Auftrag findet ihr jederzeit in eurem skilldwork-Konto.",
    accountCta: "Mein Konto öffnen",
    again: "Weitere Dienstleistung buchen",
    revisionTitle: "Nachricht an den Anbieter",
    revisionHint:
      "Beschreibt, was sich ändern soll. Ihr könnt Bilder oder Dateien zur Einordnung anhängen.",
    revisionPlaceholder:
      "z.B. Bitte mehr Fokus auf bayerische Landesprogramme und Digitalisierungsförderung…",
    attach: "Bilder oder Dateien hinzufügen",
    attachHint: "PNG, JPG, PDF · nur Vorschau",
    submitRevision: "An Anbieter senden",
    cancel: "Abbrechen",
    basedOn: "Basierend auf",
    employees: "Mitarbeitende",
    revisionNote: "Eure Nachricht geht an den Anbieter für eine überarbeitete Lieferung",
    attachments: "Anhänge",
    startAction: "Antrag starten",
    startActionDone: "Antrag gestartet",
  },
  chat: {
    title: "Chat mit Anbieter",
    placeholder: "Nachricht schreiben…",
    send: "Senden",
    welcome:
      "Hallo — hier ist FörderKlar. Fragt gerne zu Matches oder nächsten Schritten.",
    autoReply:
      "Danke — wir haben eure Nachricht erhalten und melden uns in Kürze.",
    open: "Chat öffnen",
    empty: "Noch keine Nachrichten.",
  },
  apply: {
    title: "Diesen Förderpfad starten",
    subtitle: "Nächster Schritt",
    intro:
      "Ein paar Angaben, damit der Anbieter den Antrag / die nächsten Schritte für dieses Programm vorbereiten kann.",
    email: "Kontakt-E-Mail",
    note: "Notiz an den Anbieter",
    notePlaceholder: "Was sollten wir vor dem Start wissen…",
    submit: "Anfrage senden",
    successTitle: "Anfrage gesendet",
    successBody:
      "Der Anbieter hat eure Anfrage für dieses Programm erhalten. Ihr findet sie in eurem Konto.",
    back: "Zurück zu den Ergebnissen",
    already: "Ihr habt diesen Pfad bereits gestartet.",
  },
  common: {
    continue: "Weiter",
    required: "Pflichtfeld",
  },
};

const dictionaries = {
  en,
  de,
} as unknown as Record<Locale, Dict>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dict;
  offerCopy: (id: OfferId) => Dict["offers"]["check"] | Dict["offers"]["apply"];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useLocaleStore();

  const value = useMemo<I18nContextValue>(() => {
    const t = dictionaries[locale];
    return {
      locale,
      setLocale,
      t,
      offerCopy: (id) => t.offers[id],
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
