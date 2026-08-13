import type { OnboardingData } from "./store";

export type GrantMatch = {
  id: string;
  name: string;
  nameDe: string;
  program: string;
  amount: string;
  deadline: string;
  fit: number;
  nextEn: string;
  nextDe: string;
  tags: string[];
};

const CATALOG: GrantMatch[] = [
  {
    id: "digital-jetzt",
    name: "Digitalization grants (Bund / Land)",
    nameDe: "Digitalisierungsförderung (Bund / Land)",
    program: "Federal / State · Digitalization",
    amount: "€10k – €50k",
    deadline: "Rolling / windows",
    fit: 92,
    nextEn: "Confirm software investment plan and gather 2 quotes.",
    nextDe: "Investitionsplan Software bestätigen und 2 Angebote einholen.",
    tags: ["digitalization", "software", "services"],
  },
  {
    id: "forschungszulage",
    name: "Research Allowance (Forschungszulage)",
    nameDe: "Forschungszulage",
    program: "Federal · R&D tax credit",
    amount: "up to 25–35% of eligible R&D",
    deadline: "After fiscal year",
    fit: 90,
    nextEn: "Document R&D hours / costs and check BSFZ eligibility.",
    nextDe: "FuE-Stunden/Kosten dokumentieren und BSFZ-Fähigkeit prüfen.",
    tags: ["rnd", "software", "manufacturing", "healthcare"],
  },
  {
    id: "inqa",
    name: "INQA Coaching",
    nameDe: "INQA-Coaching",
    program: "Federal · HR / transformation",
    amount: "up to ~80% of coaching costs",
    deadline: "Before coaching start",
    fit: 86,
    nextEn: "Define transformation topic and authorized INQA coach.",
    nextDe: "Transformationsthema und autorisierten INQA-Coach festlegen.",
    tags: ["hiring", "services", "digitalization"],
  },
  {
    id: "bayern-digital",
    name: "Bayern Digital Bonus",
    nameDe: "Digitalbonus Bayern",
    program: "Bavaria · SME",
    amount: "€3k – €10k",
    deadline: "Open window",
    fit: 88,
    nextEn: "Verify BY registration and hardware/software scope under €50k.",
    nextDe: "BY-Sitz prüfen und Hard-/Software-Umfang unter €50k definieren.",
    tags: ["digitalization", "BY", "software", "manufacturing"],
  },
  {
    id: "bafa-ee",
    name: "BAFA Energy Efficiency",
    nameDe: "BAFA Energieeffizienz",
    program: "Federal · Climate",
    amount: "€5k – €200k",
    deadline: "Before project start",
    fit: 84,
    nextEn: "Book energy consultant module and list measures.",
    nextDe: "Energieberater-Modul buchen und Maßnahmenliste erstellen.",
    tags: ["green", "energy", "manufacturing"],
  },
  {
    id: "zim",
    name: "ZIM Innovation",
    nameDe: "ZIM Innovationsförderung",
    program: "Federal · R&D",
    amount: "€50k – €350k",
    deadline: "Continuous",
    fit: 81,
    nextEn: "Outline novel R&D work packages and partner options.",
    nextDe: "Neuartige FuE-Arbeitspakete und Partneroptionen skizzieren.",
    tags: ["rnd", "software", "manufacturing", "healthcare"],
  },
  {
    id: "qcg",
    name: "Qualification & Training Support",
    nameDe: "Weiterbildungsförderung",
    program: "Federal / State · HR",
    amount: "€2k – €25k",
    deadline: "Per cohort",
    fit: 76,
    nextEn: "List roles to upskill and preferred training providers.",
    nextDe: "Rollen für Upskilling und Trainingsanbieter listen.",
    tags: ["hiring", "services", "retail"],
  },
  {
    id: "grw",
    name: "GRW Investment Aid",
    nameDe: "GRW Investitionszuschuss",
    program: "Regional · Expansion",
    amount: "€25k – €500k",
    deadline: "Before investment",
    fit: 73,
    nextEn: "Map CapEx plan and check assisted-area eligibility.",
    nextDe: "CapEx-Plan abbilden und Fördergebietsfähigkeit prüfen.",
    tags: ["expansion", "manufacturing", "retail"],
  },
  {
    id: "kfw-green",
    name: "KfW Climate Programme",
    nameDe: "KfW Klimaprogramm",
    program: "Federal · Loan / grant mix",
    amount: "€20k – €1m",
    deadline: "Via house bank",
    fit: 70,
    nextEn: "Talk to house bank about climate loan stack.",
    nextDe: "Mit Hausbank Klimakredit-Stack besprechen.",
    tags: ["green", "energy", "expansion"],
  },
  {
    id: "go-digital",
    name: "go-digital style consulting voucher",
    nameDe: "Digitalisierungsberatung (Gutschein-Logik)",
    program: "Federal · Consulting",
    amount: "€1.5k – €16k",
    deadline: "Module-based",
    fit: 69,
    nextEn: "Pick authorized consultant module for your stack.",
    nextDe: "Autorisiertes Berater-Modul für euren Stack wählen.",
    tags: ["digitalization", "software", "services", "retail"],
  },
];

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

export function matchGrants(
  data: OnboardingData,
  revisionNote: string,
  runSeed: number,
): GrantMatch[] {
  const revision = revisionNote.toLowerCase();
  const preferState =
    revision.includes("bayern") ||
    revision.includes("bavaria") ||
    revision.includes("by") ||
    data.state === "BY";
  const preferDigital =
    revision.includes("digital") ||
    data.goal === "digitalization" ||
    data.industry === "software";
  const preferGreen =
    revision.includes("klima") ||
    revision.includes("green") ||
    revision.includes("energie") ||
    data.goal === "green";

  const scored = CATALOG.map((g) => {
    let fit = g.fit;
    if (g.tags.includes(data.goal)) fit += 6;
    if (g.tags.includes(data.industry)) fit += 5;
    if (preferState && g.id.includes("bayern")) fit += 8;
    if (preferDigital && g.tags.includes("digitalization")) fit += 5;
    if (preferGreen && g.tags.includes("green")) fit += 5;
    if (data.size === "1-9" && g.amount.includes("€3k")) fit += 3;
    if (data.size === "250+" && g.id === "grw") fit += 4;
    // tiny deterministic jitter per run so revisions feel alive
    const jitter =
      (hashSeed(`${g.id}-${runSeed}-${data.companyName}`) % 7) - 3;
    fit = Math.max(55, Math.min(98, fit + jitter));
    return { ...g, fit };
  });

  return scored.sort((a, b) => b.fit - a.fit).slice(0, 4);
}

export const STATES = [
  { id: "BW", label: "Baden-Württemberg" },
  { id: "BY", label: "Bayern" },
  { id: "BE", label: "Berlin" },
  { id: "BB", label: "Brandenburg" },
  { id: "HB", label: "Bremen" },
  { id: "HH", label: "Hamburg" },
  { id: "HE", label: "Hessen" },
  { id: "MV", label: "Mecklenburg-Vorpommern" },
  { id: "NI", label: "Niedersachsen" },
  { id: "NW", label: "Nordrhein-Westfalen" },
  { id: "RP", label: "Rheinland-Pfalz" },
  { id: "SL", label: "Saarland" },
  { id: "SN", label: "Sachsen" },
  { id: "ST", label: "Sachsen-Anhalt" },
  { id: "SH", label: "Schleswig-Holstein" },
  { id: "TH", label: "Thüringen" },
] as const;
