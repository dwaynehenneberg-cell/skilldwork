import type { Locale } from "./locale";
import type { PlanId } from "./pricing";

type DeepString<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly (infer U)[]
      ? U extends string
        ? string[]
        : DeepString<U>[]
      : DeepString<T[K]>;
};

const en = {
  lang: { label: "Language", en: "EN", de: "DE" },
  nav: {
    privacy: "Privacy",
    agb: "Terms",
    pricing: "Pricing",
  },
  home: {
    eyebrow: "For freelancers, agencies, and expert service businesses",
    title: "Turn your service into an automatable workflow.",
  },
  booking: {
    thanks: "Thanks — your call is booked. We look forward to talking to you.",
    pickTime:
      "Pick a time that works for you. It’s a workflow fit call — bring one repeatable service.",
    loading: "Loading available times…",
    loadError: "The scheduler did not load in this page.",
    openScheduling: "Open scheduling page",
    ctaPrimary: "Build your workflow",
    ctaSub: "Starts with a 30-minute workflow fit call",
    unavailable: "Booking is temporarily unavailable.",
    seeHow: "See how it works",
  },
  mission: {
    eyebrow: "Our mission",
    title: "The last humans working.",
    lead:
      "The best providers in their field won’t keep doing the job themselves. They’ll build and optimize the agent-workflows that do it.",
    body:
      "Our mission is to give clients everywhere access to the best services in the world — by making it easy for the most skilled providers to build, run and sell agent-run services at scale, without giving up what made them the best.",
  },
  workflow: {
    eyebrow: "How it works",
    title: "Build. Market. Fulfill. Improve.",
    lead: "Four connected steps turn your service into a system that delivers and learns.",
    scroll: "Scroll to explore",
    hover: "Hover to focus",
    system: "Skilldwork service system",
    legendAutomated: "Automated",
    legendYou: "Handled by you",
    legendClient: "Client page",
    footer:
      "You create demand. Skilldwork delivers each service and improves the next run.",
    cta: "Build your workflow",
    completedRun: "Completed run",
    returnImprove: "Improved workflow returns to execution",
    returnRevision: "Revision returns to workflow",
    automatedExec: "Automated service execution",
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
    nodes: {
      startHere: "Start here",
      buildTitle: "Build your workflow",
      buildSub: "Sales Page + delivery",
      bookCall: "Book a call",
      marketing: "Marketing",
      handledByYou: "Handled by you",
      nextClient: "↻ Next client",
      salesPage: "Sales Page",
      offer: "Offer",
      chooseOffer: "Choose offer",
      clientPortal: "Client Portal",
      startService: "Start service",
      result: "Result",
      revise: "Revise",
      accept: "Accept",
      execution: "Execution",
      workflow: "Workflow",
      processDeliver: "process → deliver",
      yourInput: "Your input if needed",
      revisionAgent: "Revision Agent",
      completedRuns: "Completed runs",
      improvementAgent: "Improvement Agent",
      improvesFuture: "Improves future delivery",
      betterEveryRun: "Better with every run",
    },
  },
  pricingPage: {
    eyebrow: "Pricing",
    title: "Select your plan",
    lead:
      "Turn your service into digital workflows — unlimited Workflow Builds, Client journey apps, and Provider Workspace. Plans scale by Sales Pages and concurrent Service Runs.",
    compareEyebrow: "Compare",
    compareTitle: "What’s included",
    compareLead:
      "Same platform on every plan. Hover a feature for a short explanation. Limits scale with Sales Pages and concurrent Service Runs.",
    feature: "Feature",
    included: "Included",
    faqEyebrow: "FAQ",
    faqTitle: "Common questions",
    monthly: "Monthly",
    yearly: "Yearly",
    billingLabel: "Billing period",
    perMonth: "/ month",
    billedYearly: "billed yearly",
    yearlySave: "save",
    monthsFree: "2 months free",
    mostPopular: "Most popular",
    linkSoon: "Link coming soon",
    beyond: "Beyond Business",
    faqs: [
      {
        q: "What is a Sales Page?",
        a: "Your result-based landing page where Clients choose an Offer and start purchase. Freelancer includes one active Sales Page; Offers on that page are unlimited on every plan.",
      },
      {
        q: "What is a concurrent Service Run?",
        a: "How many full Client journeys can process at the same time. Extra runs queue until a slot frees up. We limit concurrency instead of monthly run buckets because each run uses dedicated capacity.",
      },
      {
        q: "What is the transaction fee?",
        a: "A percentage of Client payments processed through Skilldwork. Freelancer is 10%; Pro and Business are 2.9%. Custom Solution fees are negotiated.",
      },
      {
        q: "How does support work?",
        a: "Every plan includes direct support from the Skilldwork team.",
      },
    ],
  },
  plans: {
    freelancer: {
      description: "One Sales Page, unlimited Offers — ship your first digital service.",
      ctaMonthly: "Start monthly",
      ctaYearly: "Start yearly",
      highlights: [
        {
          text: "Unlimited Workflow Builds",
          tip: "Build and iterate as many digital workflows as you need. You are not charged per Workflow Build.",
        },
        {
          text: "1 active Sales Page, unlimited Offers",
          tip: "A Sales Page is your result-based landing page where Clients choose an Offer. Offers on that page are unlimited.",
        },
        {
          text: "2 concurrent Service Runs",
          tip: "How many Client journeys can run at once (purchase through delivery). Extra runs wait until a slot frees up.",
        },
        {
          text: "Unlimited users",
          tip: "Invite your team freely. Admin roles for permissions start on Pro.",
        },
        {
          text: "Client journey apps",
          tip: "Client-facing apps cover the full cycle: Sales Page → purchase & onboarding → delivery & revisions → wrap-up, upsells, and retention.",
        },
        {
          text: "Provider Workspace",
          tip: "Your internal app for CRM, delivery, Workflow Builds, Sales Page & onboarding editors, Revision Agent, and Improvement Agent suggestions.",
        },
        {
          text: "10% transaction fee",
          tip: "Percentage of Client payments processed through Skilldwork.",
        },
      ],
    },
    "freelancer-pro": {
      description:
        "More Sales Pages, lower fees, and room to run services in production.",
      ctaMonthly: "Start Pro monthly",
      ctaYearly: "Start Pro yearly",
      highlights: [
        {
          text: "Unlimited Workflow Builds",
          tip: "Build and iterate as many digital workflows as you need. You are not charged per Workflow Build.",
        },
        {
          text: "3 active Sales Pages, unlimited Offers",
          tip: "A Sales Page is your result-based landing page where Clients choose an Offer. Offers on each page are unlimited.",
        },
        {
          text: "8 concurrent Service Runs",
          tip: "How many Client journeys can run at once (purchase through delivery). Extra runs wait until a slot frees up.",
        },
        {
          text: "Unlimited users + Admin roles",
          tip: "Invite your whole team. Admin roles let you control permissions and access.",
        },
        {
          text: "Client journey apps",
          tip: "Client-facing apps cover the full cycle: Sales Page → purchase & onboarding → delivery & revisions → wrap-up, upsells, and retention.",
        },
        {
          text: "Provider Workspace",
          tip: "Your internal app for CRM, delivery, Workflow Builds, Sales Page & onboarding editors, Revision Agent, and Improvement Agent suggestions.",
        },
        {
          text: "Custom domain + Affiliate links",
          tip: "Run Sales Pages on your domain and reward partners who refer Clients.",
        },
        {
          text: "2.9% transaction fee",
          tip: "Percentage of Client payments processed through Skilldwork.",
        },
      ],
    },
    agency: {
      description:
        "Ten active Sales Pages for teams running multiple client services.",
      ctaMonthly: "Start Business monthly",
      ctaYearly: "Start Business yearly",
      highlights: [
        {
          text: "Unlimited Workflow Builds",
          tip: "Build and iterate as many digital workflows as you need. You are not charged per Workflow Build.",
        },
        {
          text: "10 active Sales Pages, unlimited Offers",
          tip: "A Sales Page is your result-based landing page where Clients choose an Offer. Offers on each page are unlimited.",
        },
        {
          text: "20 concurrent Service Runs",
          tip: "How many Client journeys can run at once (purchase through delivery). Extra runs wait until a slot frees up.",
        },
        {
          text: "Unlimited users + Admin roles",
          tip: "Invite your whole team. Admin roles let you control permissions and access.",
        },
        {
          text: "Client journey apps",
          tip: "Client-facing apps cover the full cycle: Sales Page → purchase & onboarding → delivery & revisions → wrap-up, upsells, and retention.",
        },
        {
          text: "Provider Workspace",
          tip: "Your internal app for CRM, delivery, Workflow Builds, Sales Page & onboarding editors, Revision Agent, and Improvement Agent suggestions.",
        },
        {
          text: "Custom domain + Affiliate links",
          tip: "Run Sales Pages on your domain and reward partners who refer Clients.",
        },
        {
          text: "2.9% transaction fee",
          tip: "Percentage of Client payments processed through Skilldwork.",
        },
      ],
    },
    custom: {
      description:
        "Self-hosted, white-label, compliance, or limits beyond Business — we design it with you.",
      ctaMonthly: "Book a call",
      ctaYearly: "Book a call",
      highlights: [
        {
          text: "Unlimited Workflow Builds",
          tip: "Build and iterate as many digital workflows as you need. You are not charged per Workflow Build.",
        },
        {
          text: "Custom Sales Page & concurrency limits",
          tip: "We size active Sales Pages and concurrent Service Runs to your operation.",
        },
        {
          text: "Unlimited users + Admin roles",
          tip: "Invite your whole team with permission controls.",
        },
        {
          text: "Self-hosted or dedicated cloud",
          tip: "Run on your infrastructure or a dedicated environment when compliance requires it.",
        },
      ],
    },
  } satisfies Record<
    PlanId,
    {
      description: string;
      ctaMonthly: string;
      ctaYearly: string;
      highlights: { text: string; tip: string }[];
    }
  >,
  featureLabels: {
    "Workflow Builds": "Workflow Builds",
    "Active Sales Pages": "Active Sales Pages",
    "Offers per Sales Page": "Offers per Sales Page",
    "Concurrent Service Runs": "Concurrent Service Runs",
    Users: "Users",
    "Admin roles": "Admin roles",
    "Client journey apps": "Client journey apps",
    "Provider Workspace": "Provider Workspace",
    "Transaction fee": "Transaction fee",
    "Custom domain": "Custom domain",
    "Affiliate links": "Affiliate links",
    "Workflow history": "Workflow history",
  },
  featureTips: {
    "Workflow Builds":
      "Build and iterate as many digital workflows as you need. You are not charged per Workflow Build.",
    "Active Sales Pages":
      "Result-based landing pages where Clients choose an Offer and start purchase.",
    "Offers per Sales Page": "Purchasable result scopes on a Sales Page — unlimited on every plan.",
    "Concurrent Service Runs":
      "How many Client journeys can run at once. Extra runs wait until a slot frees up.",
    Users: "Invite your whole team on every plan.",
    "Admin roles": "Permission controls for who can edit workflows, billing, and Client work. Included from Pro.",
    "Client journey apps":
      "Client-facing apps for Sales Page → onboarding → delivery & revisions → wrap-up, upsells, and retention.",
    "Provider Workspace":
      "Internal app for CRM, delivery, Workflow Builds, editors, Revision Agent, and Improvement Agent suggestions.",
    "Transaction fee": "Percentage of Client payments processed through Skilldwork.",
    "Custom domain": "Serve Sales Pages on your own domain.",
    "Affiliate links": "Reward partners who refer Clients.",
    "Workflow history": "How long past workflow versions and run history are retained.",
  },
  featureValues: {
    Unlimited: "Unlimited",
    Custom: "Custom",
    "7 days": "7 days",
    "30 days": "30 days",
    "90 days": "90 days",
  },
  privacy: {
    title: "Privacy",
    intro:
      "This notice explains how Skilldwork handles personal data you provide through our website, a lead form on Facebook, Instagram or Reddit, or our Calendly booking link.",
    updated: "Last updated: August 12, 2026",
    sections: [
      {
        title: "1. Controller",
        paragraphs: [
          "Dwayne Henneberg (Skilldwork)\nEmail: hello@skilldwork.com",
        ],
      },
      {
        title: "2. Data we process",
        paragraphs: [
          "Depending on how you contact us, we may process your name, email address, phone number, company or role, message, appointment details, and any other information you choose to provide. When you visit our website, limited technical data such as your IP address, browser or device information, requested page, and date and time may also be processed to deliver the site securely.",
          "If you allow advertising measurement, the Reddit Pixel also processes information about page visits and completed bookings, together with online identifiers and device or browser information, so we can measure whether a Reddit advertisement led to a booking.",
        ],
      },
      {
        title: "3. How and why we use your data",
        paragraphs: [
          "We use your data to respond to your inquiry, contact you about the offer you requested, schedule and manage a call, and prepare any requested services. Processing is based on steps you ask us to take before entering into a contract (Art. 6(1)(b) GDPR), or on your consent where a form specifically requests it (Art. 6(1)(a) GDPR). We process limited technical website data based on our legitimate interest in providing a secure and reliable website (Art. 6(1)(f) GDPR). Reddit advertising measurement is activated only with your consent (Art. 6(1)(a) GDPR). You may change that choice at any time via “Privacy choices” or withdraw consent by emailing us.",
        ],
      },
      {
        title: "4. Platforms and service providers",
        paragraphs: [
          "The provider of the channel you use may process your data to operate its service. This may include Meta, Reddit, Calendly for scheduling, and Vercel for website hosting. Their own privacy notices provide details about their processing. Skilldwork does not sell your personal data.",
        ],
      },
      {
        title: "5. Advertising measurement",
        paragraphs: [
          "The Reddit Pixel is disabled until you select “Allow measurement.” If enabled, it records a page visit and, after Calendly confirms that an appointment was scheduled, a lead event. Declining does not limit the website or booking function. Your choice is stored in your browser so we can respect it on later visits.",
        ],
      },
      {
        title: "6. Retention",
        paragraphs: [
          "We retain personal data only for as long as necessary to handle your inquiry, booking, or resulting business relationship. We delete it when the purpose no longer applies or you withdraw consent, unless a legal retention obligation requires otherwise.",
        ],
      },
      {
        title: "7. Your rights",
        paragraphs: [
          "Subject to the legal requirements, you have the right to access, correct, erase, restrict the processing of, and receive a copy of your data. You may also withdraw your consent and lodge a complaint with a competent data protection authority. To exercise your rights, email the address above.",
        ],
      },
      {
        title: "8. Voluntary submission",
        paragraphs: [
          "Providing personal data is voluntary. Without the details needed to respond or arrange a meeting, we may be unable to handle your request. Skilldwork does not use automated decision-making or profiling for these purposes.",
        ],
      },
    ],
  },
  agb: {
    title: "Terms of Service",
    intro:
      "Terms of Service for using the Skilldwork platform, including subscriptions, waitlist onboarding, and payments via Stripe.",
    updated: "Last updated: August 12, 2026",
    sections: [
      {
        title: "1. Provider",
        paragraphs: [
          "Dwayne Henneberg (Skilldwork)\nEmail: hello@skilldwork.com",
        ],
      },
      {
        title: "2. Scope",
        paragraphs: [
          "These Terms apply to all contracts between the Provider and businesses as well as freelancers (“Customer” / Service Provider) concerning access to the Skilldwork software platform (SaaS), related digital workflows, Sales Pages, Client Portal, Provider Workspace, and associated services. Conflicting terms of the Customer apply only if the Provider expressly agrees to them in writing.",
        ],
      },
      {
        title: "3. Service description",
        paragraphs: [
          "Skilldwork provides a platform that lets the Customer turn their service into a digital workflow and offer it via a result-based Sales Page. Scope and limits (e.g. active Sales Pages, concurrent Service Runs, seats) follow the selected plan on the Pricing page or an individual agreement (Custom Solution). The Provider owes availability of the platform within the agreed scope, not the commercial success of the Customer’s individual Clients.",
        ],
      },
      {
        title: "4. Waitlist, contract formation, and Stripe",
        paragraphs: [
          "Skilldwork currently operates a waitlist. Completing the order flow via the Provider’s Stripe Payment Link or Stripe Checkout places the Customer on the waitlist and sets up payment processing (including collecting or authorizing a payment method). It does not by itself start the paid subscription period.",
          "Onboarding and activation of the Product/Service may follow later — typically within up to two (2) weeks after the order. The Service starts when onboarding is completed / access is activated. Only then is the fee charged bindingly and the subscription (or agreed billing period) begins.",
          "Until that charge, no binding subscription fee is due solely because of waitlist placement, unless a different arrangement is agreed in writing. If activation cannot reasonably take place within that timeframe, the Provider will inform the Customer; the Customer may then cancel the waitlist order without a binding charge for the plan fee.",
          "By completing checkout, the Customer confirms they have read these Terms and the Privacy Policy. Individual Custom Solution offers are formed by acceptance of an offer or written confirmation after a consultation.",
        ],
      },
      {
        title: "5. Prices, billing, and transaction fees",
        paragraphs: [
          "The prices shown on the Pricing page at the time of the order apply (monthly or yearly). Payments are processed via Stripe. The Customer authorizes Stripe and/or the Provider to collect due amounts using the stored payment method once the Service has started as described in section 4. In addition to the plan fee, a transaction fee may apply to Client payments processed through Skilldwork; the percentage depends on the plan. All prices are exclusive of statutory VAT where VAT applies, unless stated otherwise.",
        ],
      },
      {
        title: "6. Term and termination",
        paragraphs: [
          "Monthly subscriptions renew for another month unless cancelled before the end of the current period. Yearly subscriptions renew for another year under the same conditions. Cancellation may be made via the Stripe customer portal (where provided) or by email to the address above and takes effect at the end of the current billing period. There is no entitlement to a pro‑rata refund of periods already paid, unless mandatory law requires otherwise. Until the first binding charge under section 4, waitlist cancellation ends the order without a plan-fee charge.",
        ],
      },
      {
        title: "7. Customer obligations",
        paragraphs: [
          "The Customer remains responsible for marketing, the content of their Sales Pages, offers to their Clients, and all contractual and legal duties toward their Clients. The Customer must ensure that content and workflows they upload do not infringe third-party rights and are not used for unlawful purposes. Access credentials must be kept confidential; the Customer is liable for misuse attributable to them.",
        ],
      },
      {
        title: "8. Customer’s Clients",
        paragraphs: [
          "Contracts for services offered by the Customer are solely between the Customer and their Clients. Skilldwork is a technical platform and not a party to that service relationship unless expressly agreed otherwise. Client payments via Stripe are processed on behalf of / within the payment setup of the Customer or the platform integration.",
        ],
      },
      {
        title: "9. Availability and usage limits",
        paragraphs: [
          "The Provider strives for high availability but does not guarantee uninterrupted use. Maintenance windows and outages may occur. Plan limits — especially concurrent Service Runs and active Sales Pages — are part of the service. If limits are exceeded, the Provider may throttle or queue further parallel runs until capacity is free, or point the Customer to a higher plan or Custom Solution.",
        ],
      },
      {
        title: "10. Liability",
        paragraphs: [
          "The Provider is liable without limitation for intent and gross negligence and for damage arising from injury to life, body, or health. For slight negligence, the Provider is liable only for breach of essential contractual duties (cardinal duties), and liability is limited to foreseeable, typical damage. Liability for indirect damage and lost profits is excluded in cases of slight negligence to the extent permitted by law. Liability under the Product Liability Act remains unaffected.",
        ],
      },
      {
        title: "11. Privacy",
        paragraphs: [
          "Information on processing of personal data is set out in the Privacy Policy. Where the Customer processes personal data of their Clients via the platform, they act as an independent controller toward those Clients unless a separate data-processing agreement is concluded.",
        ],
      },
      {
        title: "12. Changes to these Terms",
        paragraphs: [
          "The Provider may amend these Terms where required to adapt to changes in law, case law, or platform features, and where this does not unreasonably disadvantage the Customer. Material changes will be communicated by email or in the platform. If the Customer does not object within 30 days of notice, the amended Terms are deemed accepted; this will be stated in the notice.",
        ],
      },
      {
        title: "13. Final provisions",
        paragraphs: [
          "The law of the Federal Republic of Germany applies, excluding the UN Convention on Contracts for the International Sale of Goods. If the Customer is a merchant, a legal entity under public law, or a special fund under public law, the place of jurisdiction is the Provider’s registered seat, to the extent permitted by law. If any provision is invalid, the remaining provisions remain in effect.",
        ],
      },
    ],
  },
};

const de: DeepString<typeof en> = {
  lang: { label: "Sprache", en: "EN", de: "DE" },
  nav: {
    privacy: "Datenschutz",
    agb: "AGB",
    pricing: "Preise",
  },
  home: {
    eyebrow: "Für Freelancer, Agenturen und Experten-Dienstleister",
    title: "Mach aus deiner Dienstleistung einen automatisierbaren Workflow.",
  },
  booking: {
    thanks: "Danke — dein Call ist gebucht. Wir freuen uns auf das Gespräch.",
    pickTime:
      "Wähle einen Termin, der passt. Es ist ein Workflow-Fit-Call — bring eine wiederholbare Dienstleistung mit.",
    loading: "Verfügbare Zeiten werden geladen…",
    loadError: "Der Terminplaner hat auf dieser Seite nicht geladen.",
    openScheduling: "Terminseite öffnen",
    ctaPrimary: "Workflow aufbauen",
    ctaSub: "Startet mit einem 30-minütigen Workflow-Fit-Call",
    unavailable: "Buchung ist vorübergehend nicht verfügbar.",
    seeHow: "So funktioniert’s",
  },
  mission: {
    eyebrow: "Unsere Mission",
    title: "The last humans working.",
    lead:
      "Die besten Anbieter in ihrem Feld werden die Arbeit nicht dauerhaft selbst machen. Sie bauen und optimieren die Agent-Workflows, die sie erledigen.",
    body:
      "Unsere Mission: Clients überall Zugang zu den besten Services der Welt zu geben — indem wir den besten Providern einfach machen, agent-betriebene Services zu bauen, zu betreiben und zu verkaufen, ohne das aufzugeben, was sie zu den Besten gemacht hat.",
  },
  workflow: {
    eyebrow: "So funktioniert’s",
    title: "Build. Market. Fulfill. Improve.",
    lead:
      "Vier verbundene Schritte machen aus deiner Dienstleistung ein System, das liefert und lernt.",
    scroll: "Scrollen zum Erkunden",
    hover: "Hover zum Fokussieren",
    system: "Skilldwork Service-System",
    legendAutomated: "Automatisiert",
    legendYou: "Von dir übernommen",
    legendClient: "Client-Seite",
    footer:
      "Du erzeugst Nachfrage. Skilldwork liefert jeden Service und verbessert den nächsten Lauf.",
    cta: "Workflow aufbauen",
    completedRun: "Abgeschlossener Lauf",
    returnImprove: "Verbesserter Workflow kehrt zur Ausführung zurück",
    returnRevision: "Revision kehrt zum Workflow zurück",
    automatedExec: "Automatisierte Service-Ausführung",
    steps: {
      build: {
        label: "01 · Build",
        title: "Workflow aufbauen",
        summary:
          "Wir machen aus deiner Dienstleistung eine Sales Page und einen automatisierten Delivery-Workflow.",
      },
      market: {
        label: "02 · Market",
        title: "Nachfrage erzeugen",
        summary:
          "Du fokussierst dich auf Marketing, während ein Link Clients ins System bringt.",
      },
      fulfill: {
        label: "03 · Fulfill",
        title: "Ergebnis liefern",
        summary:
          "Onboarding, Delivery, Results und Revisionen laufen in einem verbundenen Workflow.",
      },
      improve: {
        label: "04 · Improve",
        title: "Jeden Lauf verbessern",
        summary:
          "Jeder abgeschlossene Client-Auftrag hilft dem System, den nächsten besser zu liefern.",
      },
    },
    nodes: {
      startHere: "Hier starten",
      buildTitle: "Workflow aufbauen",
      buildSub: "Sales Page + Delivery",
      bookCall: "Call buchen",
      marketing: "Marketing",
      handledByYou: "Von dir übernommen",
      nextClient: "↻ Nächster Client",
      salesPage: "Sales Page",
      offer: "Angebot",
      chooseOffer: "Angebot wählen",
      clientPortal: "Client Portal",
      startService: "Service starten",
      result: "Ergebnis",
      revise: "Revidieren",
      accept: "Annehmen",
      execution: "Ausführung",
      workflow: "Workflow",
      processDeliver: "prozessieren → liefern",
      yourInput: "Dein Input bei Bedarf",
      revisionAgent: "Revision Agent",
      completedRuns: "Abgeschlossene Läufe",
      improvementAgent: "Improvement Agent",
      improvesFuture: "Verbessert künftige Delivery",
      betterEveryRun: "Besser mit jedem Lauf",
    },
  },
  pricingPage: {
    eyebrow: "Preise",
    title: "Wähle deinen Plan",
    lead:
      "Mach aus deinem Service digitale Workflows — unbegrenzte Workflow Builds, Client-Journey-Apps und Provider Workspace. Pläne skalieren über Sales Pages und gleichzeitige Service Runs.",
    compareEyebrow: "Vergleich",
    compareTitle: "Was enthalten ist",
    compareLead:
      "Dieselbe Plattform in jedem Plan. Hover über ein Feature für eine kurze Erklärung. Limits skalieren mit Sales Pages und gleichzeitigen Service Runs.",
    feature: "Feature",
    included: "Enthalten",
    faqEyebrow: "FAQ",
    faqTitle: "Häufige Fragen",
    monthly: "Monatlich",
    yearly: "Jährlich",
    billingLabel: "Abrechnungszeitraum",
    perMonth: "/ Monat",
    billedYearly: "jährlich abgerechnet",
    yearlySave: "Ersparnis",
    monthsFree: "2 Monate gratis",
    mostPopular: "Am beliebtesten",
    linkSoon: "Link folgt bald",
    beyond: "Über Business hinaus",
    faqs: [
      {
        q: "Was ist eine Sales Page?",
        a: "Deine ergebnisbasierte Landingpage, auf der Clients ein Offer wählen und den Kauf starten. Freelancer enthält eine aktive Sales Page; Offers auf dieser Seite sind in jedem Plan unbegrenzt.",
      },
      {
        q: "Was ist ein gleichzeitiger Service Run?",
        a: "Wie viele vollständige Client-Journeys (Kauf → Onboarding → Workflow → optional Human-in-the-loop → Ergebnis) gleichzeitig laufen können. Weitere Läufe warten in der Queue, bis ein Slot frei wird. Wir limitieren Concurrency statt monatlicher Run-Budgets, weil jeder Lauf dedizierte Kapazität nutzt.",
      },
      {
        q: "Was ist die Transaktionsgebühr?",
        a: "Ein Prozentsatz der Client-Zahlungen über Skilldwork. Freelancer: 10 %; Pro und Business: 2,9 %. Custom Solution nach Vereinbarung.",
      },
      {
        q: "Wie funktioniert Support?",
        a: "Jeder Plan enthält direkten Support vom Skilldwork-Team.",
      },
    ],
  },
  plans: {
    freelancer: {
      description:
        "Eine Sales Page, unbegrenzte Offers — bring deinen ersten digitalen Service live.",
      ctaMonthly: "Monatlich starten",
      ctaYearly: "Jährlich starten",
      highlights: [
        {
          text: "Unbegrenzte Workflow Builds",
          tip: "Baue und iteriere so viele digitale Workflows wie du brauchst. Pro Workflow Build wird nichts berechnet.",
        },
        {
          text: "1 aktive Sales Page, unbegrenzte Offers",
          tip: "Eine Sales Page ist deine ergebnisbasierte Landingpage, auf der Clients ein Offer wählen. Offers auf dieser Seite sind unbegrenzt.",
        },
        {
          text: "2 gleichzeitige Service Runs",
          tip: "Wie viele Client-Journeys gleichzeitig laufen können (Kauf bis Auslieferung). Weitere Läufe warten, bis ein Slot frei wird.",
        },
        {
          text: "Unbegrenzte Users",
          tip: "Lade dein Team frei ein. Admin-Rollen für Berechtigungen starten ab Pro.",
        },
        {
          text: "Client-Journey-Apps",
          tip: "Client-seitige Apps decken den vollen Zyklus ab: Sales Page → Kauf & Onboarding → Auslieferung & Revisionen → Abschluss, Upsells und Bindung.",
        },
        {
          text: "Provider Workspace",
          tip: "Deine interne App für CRM, Auslieferung, Workflow Builds, Sales-Page- & Onboarding-Editoren, Revision Agent und Improvement-Agent-Vorschläge.",
        },
        {
          text: "10 % Transaktionsgebühr",
          tip: "Prozentsatz der Client-Zahlungen über Skilldwork.",
        },
      ],
    },
    "freelancer-pro": {
      description:
        "Mehr Sales Pages, niedrigere Gebühren und Raum für Services in Production.",
      ctaMonthly: "Pro monatlich starten",
      ctaYearly: "Pro jährlich starten",
      highlights: [
        {
          text: "Unbegrenzte Workflow Builds",
          tip: "Baue und iteriere so viele digitale Workflows wie du brauchst. Pro Workflow Build wird nichts berechnet.",
        },
        {
          text: "3 aktive Sales Pages, unbegrenzte Offers",
          tip: "Eine Sales Page ist deine ergebnisbasierte Landingpage, auf der Clients ein Offer wählen. Offers auf jeder Seite sind unbegrenzt.",
        },
        {
          text: "8 gleichzeitige Service Runs",
          tip: "Wie viele Client-Journeys gleichzeitig laufen können (Kauf bis Auslieferung). Weitere Läufe warten, bis ein Slot frei wird.",
        },
        {
          text: "Unbegrenzte Users + Admin-Rollen",
          tip: "Lade dein ganzes Team ein. Admin-Rollen steuern Berechtigungen und Zugriffe.",
        },
        {
          text: "Client-Journey-Apps",
          tip: "Client-seitige Apps decken den vollen Zyklus ab: Sales Page → Kauf & Onboarding → Auslieferung & Revisionen → Abschluss, Upsells und Bindung.",
        },
        {
          text: "Provider Workspace",
          tip: "Deine interne App für CRM, Auslieferung, Workflow Builds, Sales-Page- & Onboarding-Editoren, Revision Agent und Improvement-Agent-Vorschläge.",
        },
        {
          text: "Custom Domain + Affiliate-Links",
          tip: "Sales Pages auf deiner Domain und Partner, die Clients empfehlen, belohnen.",
        },
        {
          text: "2,9 % Transaktionsgebühr",
          tip: "Prozentsatz der Client-Zahlungen über Skilldwork.",
        },
      ],
    },
    agency: {
      description:
        "Zehn aktive Sales Pages für Teams mit mehreren Client-Services.",
      ctaMonthly: "Business monatlich starten",
      ctaYearly: "Business jährlich starten",
      highlights: [
        {
          text: "Unbegrenzte Workflow Builds",
          tip: "Baue und iteriere so viele digitale Workflows wie du brauchst. Pro Workflow Build wird nichts berechnet.",
        },
        {
          text: "10 aktive Sales Pages, unbegrenzte Offers",
          tip: "Eine Sales Page ist deine ergebnisbasierte Landingpage, auf der Clients ein Offer wählen. Offers auf jeder Seite sind unbegrenzt.",
        },
        {
          text: "20 gleichzeitige Service Runs",
          tip: "Wie viele Client-Journeys gleichzeitig laufen können (Kauf bis Auslieferung). Weitere Läufe warten, bis ein Slot frei wird.",
        },
        {
          text: "Unbegrenzte Users + Admin-Rollen",
          tip: "Lade dein ganzes Team ein. Admin-Rollen steuern Berechtigungen und Zugriffe.",
        },
        {
          text: "Client-Journey-Apps",
          tip: "Client-seitige Apps decken den vollen Zyklus ab: Sales Page → Kauf & Onboarding → Auslieferung & Revisionen → Abschluss, Upsells und Bindung.",
        },
        {
          text: "Provider Workspace",
          tip: "Deine interne App für CRM, Auslieferung, Workflow Builds, Sales-Page- & Onboarding-Editoren, Revision Agent und Improvement-Agent-Vorschläge.",
        },
        {
          text: "Custom Domain + Affiliate-Links",
          tip: "Sales Pages auf deiner Domain und Partner, die Clients empfehlen, belohnen.",
        },
        {
          text: "2,9 % Transaktionsgebühr",
          tip: "Prozentsatz der Client-Zahlungen über Skilldwork.",
        },
      ],
    },
    custom: {
      description:
        "Self-hosted, White-Label, Compliance oder Limits über Business — wir designen es mit dir.",
      ctaMonthly: "Call buchen",
      ctaYearly: "Call buchen",
      highlights: [
        {
          text: "Unbegrenzte Workflow Builds",
          tip: "Baue und iteriere so viele digitale Workflows wie du brauchst. Pro Workflow Build wird nichts berechnet.",
        },
        {
          text: "Individuelle Sales-Page- & Concurrency-Limits",
          tip: "Wir dimensionieren aktive Sales Pages und gleichzeitige Service Runs nach eurem Betrieb.",
        },
        {
          text: "Unbegrenzte Users + Admin-Rollen",
          tip: "Lade dein ganzes Team mit Berechtigungssteuerung ein.",
        },
        {
          text: "Self-hosted oder dedizierte Cloud",
          tip: "Auf eurer Infrastruktur oder in einer dedizierten Umgebung, wenn Compliance das verlangt.",
        },
      ],
    },
  },
  featureLabels: {
    "Workflow Builds": "Workflow Builds",
    "Active Sales Pages": "Aktive Sales Pages",
    "Offers per Sales Page": "Offers pro Sales Page",
    "Concurrent Service Runs": "Gleichzeitige Service Runs",
    Users: "Users",
    "Admin roles": "Admin-Rollen",
    "Client journey apps": "Client-Journey-Apps",
    "Provider Workspace": "Provider Workspace",
    "Transaction fee": "Transaktionsgebühr",
    "Custom domain": "Custom Domain",
    "Affiliate links": "Affiliate-Links",
    "Workflow history": "Workflow-Historie",
  },
  featureTips: {
    "Workflow Builds":
      "Baue und iteriere so viele digitale Workflows wie du brauchst. Pro Workflow Build wird nichts berechnet.",
    "Active Sales Pages":
      "Ergebnisbasierte Landingpages, auf denen Clients ein Offer wählen und den Kauf starten.",
    "Offers per Sales Page":
      "Kaufbare Ergebnis-Scopes auf einer Sales Page — in jedem Plan unbegrenzt.",
    "Concurrent Service Runs":
      "Wie viele Client-Journeys gleichzeitig laufen können. Weitere Läufe warten, bis ein Slot frei wird.",
    Users: "Lade dein ganzes Team in jedem Plan ein.",
    "Admin roles":
      "Berechtigungen dafür, wer Workflows, Billing und Client-Arbeit bearbeiten darf. Ab Pro enthalten.",
    "Client journey apps":
      "Client-seitige Apps für Sales Page → Onboarding → Auslieferung & Revisionen → Abschluss, Upsells und Bindung.",
    "Provider Workspace":
      "Interne App für CRM, Auslieferung, Workflow Builds, Editoren, Revision Agent und Improvement-Agent-Vorschläge.",
    "Transaction fee": "Prozentsatz der Client-Zahlungen über Skilldwork.",
    "Custom domain": "Sales Pages auf deiner eigenen Domain.",
    "Affiliate links": "Partner belohnen, die Clients empfehlen.",
    "Workflow history": "Wie lange Workflow-Versionen und Run-Historie behalten werden.",
  },
  featureValues: {
    Unlimited: "Unbegrenzt",
    Custom: "Individuell",
    "7 days": "7 Tage",
    "30 days": "30 Tage",
    "90 days": "90 Tage",
  },
  privacy: {
    title: "Datenschutz",
    intro:
      "Dieser Hinweis erklärt, wie Skilldwork personenbezogene Daten verarbeitet, die du über unsere Website, ein Lead-Formular auf Facebook, Instagram oder Reddit oder unseren Calendly-Buchungslink angibst.",
    updated: "Stand: 12. August 2026",
    sections: [
      {
        title: "1. Verantwortlicher",
        paragraphs: [
          "Dwayne Henneberg (Skilldwork)\nE-Mail: hello@skilldwork.com",
        ],
      },
      {
        title: "2. Welche Daten wir verarbeiten",
        paragraphs: [
          "Je nachdem, wie du uns kontaktierst, können wir deinen Namen, E-Mail-Adresse, Telefonnummer, Unternehmen oder Rolle, Nachricht, Termindetails und weitere Angaben verarbeiten, die du uns mitteilst. Beim Besuch unserer Website können begrenzte technische Daten wie IP-Adresse, Browser- oder Geräteinformationen, aufgerufene Seite sowie Datum und Uhrzeit verarbeitet werden, um die Website sicher bereitzustellen.",
          "Wenn du Werbemessung erlaubst, verarbeitet das Reddit Pixel außerdem Informationen zu Seitenbesuchen und abgeschlossenen Buchungen sowie Online-Kennungen und Geräte-/Browserdaten, damit wir messen können, ob eine Reddit-Anzeige zu einer Buchung geführt hat.",
        ],
      },
      {
        title: "3. Zwecke und Rechtsgrundlagen",
        paragraphs: [
          "Wir nutzen deine Daten, um auf deine Anfrage zu antworten, dich zum gewünschten Angebot zu kontaktieren, Calls zu planen und zu verwalten sowie gewünschte Leistungen vorzubereiten. Die Verarbeitung erfolgt zur Durchführung vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO) oder auf Grundlage deiner Einwilligung, wenn ein Formular diese ausdrücklich einholt (Art. 6 Abs. 1 lit. a DSGVO). Begrenzte technische Website-Daten verarbeiten wir aufgrund unseres berechtigten Interesses an einer sicheren und zuverlässigen Website (Art. 6 Abs. 1 lit. f DSGVO). Reddit-Werbemessung erfolgt nur mit Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst diese Wahl jederzeit über „Privacy choices“ ändern oder die Einwilligung per E-Mail widerrufen.",
        ],
      },
      {
        title: "4. Plattformen und Dienstleister",
        paragraphs: [
          "Der Anbieter des von dir genutzten Kanals kann deine Daten zur Bereitstellung seines Dienstes verarbeiten. Dazu können Meta, Reddit, Calendly für Terminplanung und Vercel für das Hosting gehören. Details stehen in deren eigenen Datenschutzhinweisen. Skilldwork verkauft deine personenbezogenen Daten nicht.",
        ],
      },
      {
        title: "5. Werbemessung",
        paragraphs: [
          "Das Reddit Pixel ist deaktiviert, bis du „Allow measurement“ wählst. Wenn aktiviert, erfasst es einen Seitenbesuch und nach Bestätigung eines gebuchten Calendly-Termins ein Lead-Event. Ablehnen schränkt Website oder Buchung nicht ein. Deine Wahl wird im Browser gespeichert, damit wir sie bei späteren Besuchen respektieren.",
        ],
      },
      {
        title: "6. Speicherdauer",
        paragraphs: [
          "Personenbezogene Daten speichern wir nur so lange, wie es zur Bearbeitung deiner Anfrage, Buchung oder der daraus entstehenden Geschäftsbeziehung erforderlich ist. Wir löschen sie, wenn der Zweck entfällt oder du die Einwilligung widerrufst, sofern keine gesetzliche Aufbewahrungspflicht entgegensteht.",
        ],
      },
      {
        title: "7. Deine Rechte",
        paragraphs: [
          "Soweit die gesetzlichen Voraussetzungen vorliegen, hast du Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Du kannst Einwilligungen widerrufen und dich bei einer zuständigen Aufsichtsbehörde beschweren. Zur Ausübung deiner Rechte schreibe an die oben genannte Adresse.",
        ],
      },
      {
        title: "8. Freiwilligkeit",
        paragraphs: [
          "Die Angabe personenbezogener Daten ist freiwillig. Ohne die für Antwort oder Terminplanung nötigen Angaben können wir deine Anfrage ggf. nicht bearbeiten. Skilldwork setzt für diese Zwecke keine automatisierte Entscheidungsfindung oder Profiling ein.",
        ],
      },
    ],
  },
  agb: {
    title: "AGB",
    intro:
      "Allgemeine Geschäftsbedingungen für die Nutzung der Skilldwork-Plattform, einschließlich Abonnements, Wartelisten-Onboarding und Zahlungen über Stripe.",
    updated: "Stand: 12. August 2026",
    sections: [
      {
        title: "1. Anbieter",
        paragraphs: [
          "Dwayne Henneberg (Skilldwork)\nE-Mail: hello@skilldwork.com",
        ],
      },
      {
        title: "2. Geltungsbereich",
        paragraphs: [
          "Diese AGB gelten für alle Verträge zwischen dem Anbieter und Unternehmern sowie freiberuflich Tätigen („Kunde“ / Service Provider) über den Zugang zur Skilldwork-Softwareplattform (SaaS), zugehörige Digitale Workflows, Sales Pages, Client Portal, Provider Workspace und damit verbundene Leistungen. Entgegenstehende Bedingungen des Kunden gelten nur, wenn der Anbieter ihnen ausdrücklich schriftlich zustimmt.",
        ],
      },
      {
        title: "3. Leistungsbeschreibung",
        paragraphs: [
          "Skilldwork stellt eine Plattform bereit, mit der der Kunde seine Dienstleistung in einen digitalen Workflow überführen und über eine result-basierte Sales Page anbieten kann. Umfang und Limits (z. B. aktive Sales Pages, gleichzeitige Service Runs, Sitze) ergeben sich aus dem gewählten Plan auf der Pricing-Seite bzw. aus einer individuellen Vereinbarung (Custom Solution). Der Anbieter schuldet die Bereitstellung der Plattform im vertraglich vereinbarten Rahmen, nicht den wirtschaftlichen Erfolg einzelner Clients des Kunden.",
        ],
      },
      {
        title: "4. Warteliste, Vertragsschluss und Stripe",
        paragraphs: [
          "Skilldwork betreibt derzeit eine Warteliste. Mit Abschluss des Bestellprozesses über den vom Anbieter bereitgestellten Stripe-Payment-Link bzw. Stripe-Checkout wird der Kunde auf die Warteliste gesetzt und die Zahlungsabwicklung eingerichtet (einschließlich Erfassung oder Autorisierung einer Zahlungsmethode). Damit beginnt noch nicht die bezahlte Abonnementlaufzeit.",
          "Onboarding und Freischaltung des Produkts/Services können später erfolgen — in der Regel innerhalb von bis zu zwei (2) Wochen nach der Bestellung. Der Service startet mit abgeschlossenem Onboarding bzw. aktiviertem Zugang. Erst dann wird das Entgelt verbindlich abgebucht und das Abonnement (bzw. der vereinbarte Abrechnungszeitraum) beginnt.",
          "Bis zu dieser Abbuchung entsteht allein durch die Aufnahme in die Warteliste keine verbindliche Plan-Gebühr, soweit nichts anderes schriftlich vereinbart ist. Kann die Aktivierung in diesem Zeitraum vernünftigerweise nicht erfolgen, informiert der Anbieter den Kunden; der Kunde kann die Wartelisten-Bestellung dann ohne verbindliche Plan-Gebühr stornieren.",
          "Mit Abschluss des Checkouts bestätigt der Kunde, diese AGB und die Datenschutzerklärung zur Kenntnis genommen zu haben. Individuelle Angebote (Custom Solution) kommen durch Annahme eines Angebots oder schriftliche Bestätigung nach einem Beratungsgespräch zustande.",
        ],
      },
      {
        title: "5. Preise, Abrechnung und Transaktionsgebühren",
        paragraphs: [
          "Es gelten die zum Zeitpunkt der Bestellung auf der Pricing-Seite ausgewiesenen Preise (monatlich oder jährlich). Zahlungen werden über Stripe abgewickelt. Der Kunde ermächtigt Stripe bzw. den Anbieter, fällige Beträge über die hinterlegte Zahlungsmethode einzuziehen, sobald der Service gemäß Ziffer 4 gestartet ist. Zusätzlich zur Plan-Gebühr kann eine Transaktionsgebühr auf Client-Zahlungen über Skilldwork anfallen; der Prozentsatz richtet sich nach dem Plan. Alle Preise verstehen sich zuzüglich der gesetzlichen Umsatzsteuer, sofern nicht anders angegeben und sofern Umsatzsteuer anfällt.",
        ],
      },
      {
        title: "6. Laufzeit und Kündigung",
        paragraphs: [
          "Monatliche Abonnements verlängern sich jeweils um einen weiteren Monat, sofern sie nicht vor Ablauf der laufenden Periode gekündigt werden. Jährliche Abonnements verlängern sich um ein weiteres Jahr unter denselben Bedingungen. Die Kündigung kann über den Stripe-Kundenbereich (sofern bereitgestellt) oder per E-Mail an die oben genannte Adresse erfolgen und wird zum Ende der laufenden Abrechnungsperiode wirksam. Ein Anspruch auf anteilige Rückerstattung bereits gezahlter Perioden besteht nicht, soweit gesetzlich nichts anderes zwingend vorgeschrieben ist. Bis zur ersten verbindlichen Abbuchung nach Ziffer 4 beendet die Kündigung der Warteliste die Bestellung ohne Plan-Gebühr.",
        ],
      },
      {
        title: "7. Pflichten des Kunden",
        paragraphs: [
          "Der Kunde bleibt verantwortlich für Marketing, Inhalte seiner Sales Pages, Angebote an seine Clients sowie für alle vertraglichen und gesetzlichen Pflichten gegenüber seinen Clients. Der Kunde stellt sicher, dass von ihm eingestellte Inhalte und Workflows keine Rechte Dritter verletzen und keine rechtswidrigen Zwecke verfolgen. Zugangsdaten sind geheim zu halten; der Kunde haftet für deren missbräuchliche Nutzung, soweit er sie zu vertreten hat.",
        ],
      },
      {
        title: "8. Clients des Kunden",
        paragraphs: [
          "Verträge über die vom Kunden angebotenen Leistungen kommen ausschließlich zwischen dem Kunden und dessen Clients zustande. Skilldwork ist technische Plattform und nicht Vertragspartner dieser Leistungsbeziehung, sofern nicht ausdrücklich anders vereinbart. Abwicklung von Client-Zahlungen über Stripe erfolgt im Auftrag bzw. im Rahmen der eingerichteten Zahlungswege des Kunden bzw. der Plattformintegration.",
        ],
      },
      {
        title: "9. Verfügbarkeit und Nutzungslimits",
        paragraphs: [
          "Der Anbieter bemüht sich um eine hohe Verfügbarkeit der Plattform, schuldet aber keine unterbrechungsfreie Nutzung. Wartungsfenster und Störungen sind möglich. Plan-Limits — insbesondere gleichzeitige Service Runs und aktive Sales Pages — sind Bestandteil der Leistung. Bei Überschreitung kann der Anbieter weitere parallele Läufe drosseln oder zurückstellen, bis Kapazität frei wird, oder auf ein höheres Kontingent bzw. Custom Solution verweisen.",
        ],
      },
      {
        title: "10. Haftung",
        paragraphs: [
          "Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit. Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), und die Haftung ist auf den vorhersehbaren, vertragstypischen Schaden begrenzt. Die Haftung für mittelbare Schäden und entgangenen Gewinn ist in Fällen leichter Fahrlässigkeit ausgeschlossen, soweit gesetzlich zulässig. Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.",
        ],
      },
      {
        title: "11. Datenschutz",
        paragraphs: [
          "Informationen zur Verarbeitung personenbezogener Daten enthält die Datenschutzerklärung. Soweit der Kunde personenbezogene Daten seiner Clients über die Plattform verarbeitet, handelt er als eigener Verantwortlicher gegenüber seinen Clients, sofern nicht gesondert eine Auftragsverarbeitung vereinbart wird.",
        ],
      },
      {
        title: "12. Änderungen der AGB",
        paragraphs: [
          "Der Anbieter kann diese AGB ändern, soweit dies zur Anpassung an geänderte Rechtslage, Rechtsprechung oder Plattformfunktionen erforderlich ist und den Kunden nicht unangemessen benachteiligt. Über wesentliche Änderungen wird der Kunde per E-Mail oder in der Plattform informiert. Widerspricht der Kunde nicht innerhalb von 30 Tagen nach Zugang der Mitteilung, gelten die geänderten AGB als angenommen; hierauf wird in der Mitteilung hingewiesen.",
        ],
      },
      {
        title: "13. Schlussbestimmungen",
        paragraphs: [
          "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand der Sitz des Anbieters, soweit gesetzlich zulässig. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
        ],
      },
    ],
  },
};

export type SiteDict = DeepString<typeof en>;

export const siteDictionaries: Record<Locale, SiteDict> = {
  en: en as SiteDict,
  de,
};
