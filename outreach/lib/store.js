/**
 * Datenhaltung des Outreach-Toolkits.
 *
 * Alles liegt als CSV in outreach/data/ -- lesbar, in Excel/Numbers zu oeffnen,
 * und durch die .gitignore vom Repository ausgenommen. Es gibt bewusst keine
 * Datenbank: 300 Kontakte brauchen keine.
 *
 *   data/kontakte.csv    Einzige Wahrheit ueber jeden Kontakt
 *   data/sperrliste.csv  Widersprueche und Absagen; ueberlebt jeden Re-Import
 *   data/verlauf.csv     Append-only Protokoll aller Statuswechsel
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv, toCsv } from "./csv.js";

const HIER = path.dirname(fileURLToPath(import.meta.url));
export const WURZEL = path.resolve(HIER, "..");
export const DATEN_DIR = path.join(WURZEL, "data");

const KONTAKTE = path.join(DATEN_DIR, "kontakte.csv");
const SPERRLISTE = path.join(DATEN_DIR, "sperrliste.csv");
const VERLAUF = path.join(DATEN_DIR, "verlauf.csv");

/** Spalten der Kontaktdatei, in dieser Reihenfolge. */
export const SPALTEN = [
  "id",
  "firma",
  "website",
  "domain",
  "branche",
  "ort",
  "plz",
  "land",
  "ansprechpartner",
  "rolle",
  "email",
  "telefon",
  "kanal",
  "quelle",
  "datenherkunft",
  "erfasst_am",
  "recherche_am",
  "relevanz_score",
  "relevanz_begruendung",
  "hook",
  "ausschluss_grund",
  "anrede",
  "mail_betreff",
  "mail_text",
  "mail2_betreff",
  "mail2_text",
  "call_opener",
  "call_frage",
  "status",
  "letzte_aktion_am",
  "naechste_aktion_am",
  "notizen",
];

/**
 * Statuswerte. `aktiv` heisst: der Kontakt laeuft noch durch die Sequenz.
 * Die Endstatus beenden jede weitere Kontaktaufnahme.
 */
export const STATUS = {
  neu: { aktiv: true, beschreibung: "Erfasst, noch nicht recherchiert" },
  recherchiert: { aktiv: true, beschreibung: "Recherche liegt vor, Entwurf fehlt" },
  entwurf: { aktiv: true, beschreibung: "Mail und Call-Einstieg entworfen, noch nichts versendet" },
  mail1: { aktiv: true, beschreibung: "Erste Mail raus" },
  anruf1: { aktiv: true, beschreibung: "Erster Anrufversuch erfolgt" },
  mail2: { aktiv: true, beschreibung: "Zweite Mail raus" },
  anruf2: { aktiv: true, beschreibung: "Zweiter Anrufversuch erfolgt" },
  mail3: { aktiv: true, beschreibung: "Abschluss-Mail raus" },
  pause: { aktiv: false, beschreibung: "Sequenz durchlaufen, keine Reaktion" },
  geantwortet: { aktiv: false, beschreibung: "Hat geantwortet, Dialog laeuft ausserhalb der Sequenz" },
  gespraech: { aktiv: false, beschreibung: "Telefonisch erreicht und gesprochen" },
  termin: { aktiv: false, beschreibung: "Call vereinbart" },
  kein_interesse: { aktiv: false, beschreibung: "Absage" },
  opt_out: { aktiv: false, beschreibung: "Widerspruch gegen weitere Kontaktaufnahme" },
  unzustellbar: { aktiv: false, beschreibung: "Adresse oder Nummer falsch" },
};

/** Status, nach denen niemand mehr kontaktiert werden darf. */
export const GESPERRTE_STATUS = new Set(["opt_out", "kein_interesse", "unzustellbar"]);

function sicherstellenDatenDir() {
  fs.mkdirSync(DATEN_DIR, { recursive: true });
}

function leseCsv(datei, spalten) {
  if (!fs.existsSync(datei)) return [];
  const inhalt = fs.readFileSync(datei, "utf8");
  const { rows } = parseCsv(inhalt);
  // Fehlende Spalten auffuellen, damit spaeter hinzugekommene Felder alte Dateien nicht brechen
  return rows.map((row) => {
    const voll = {};
    for (const spalte of spalten) voll[spalte] = row[spalte] ?? "";
    return voll;
  });
}

/** @returns {Record<string,string>[]} */
export function ladeKontakte() {
  return leseCsv(KONTAKTE, SPALTEN);
}

/** @param {Record<string,string>[]} kontakte */
export function speichereKontakte(kontakte) {
  sicherstellenDatenDir();
  fs.writeFileSync(KONTAKTE, toCsv(SPALTEN, kontakte), "utf8");
}

const SPERR_SPALTEN = ["wert", "typ", "grund", "am"];

/** @returns {Set<string>} Domains und Mailadressen, die nie wieder angefasst werden. */
export function ladeSperrliste() {
  const eintraege = leseCsv(SPERRLISTE, SPERR_SPALTEN);
  return new Set(eintraege.map((e) => e.wert.toLowerCase()).filter(Boolean));
}

/**
 * @param {string} wert Domain oder Mailadresse
 * @param {string} typ "domain" | "email"
 * @param {string} grund
 */
export function ergaenzeSperrliste(wert, typ, grund) {
  if (!wert) return;
  sicherstellenDatenDir();
  const eintraege = leseCsv(SPERRLISTE, SPERR_SPALTEN);
  const normiert = wert.toLowerCase();
  if (eintraege.some((e) => e.wert.toLowerCase() === normiert)) return;
  eintraege.push({ wert: normiert, typ, grund, am: heute() });
  fs.writeFileSync(SPERRLISTE, toCsv(SPERR_SPALTEN, eintraege), "utf8");
}

const VERLAUF_SPALTEN = ["zeitpunkt", "id", "firma", "von_status", "nach_status", "notiz"];

/** Haengt einen Statuswechsel an das Protokoll an. */
export function protokolliere(kontakt, vonStatus, nachStatus, notiz = "") {
  sicherstellenDatenDir();
  const zeile = {
    zeitpunkt: new Date().toISOString(),
    id: kontakt.id,
    firma: kontakt.firma,
    von_status: vonStatus,
    nach_status: nachStatus,
    notiz,
  };
  const existiert = fs.existsSync(VERLAUF);
  if (!existiert) {
    fs.writeFileSync(VERLAUF, toCsv(VERLAUF_SPALTEN, [zeile]), "utf8");
  } else {
    const csvZeile = toCsv(VERLAUF_SPALTEN, [zeile]).split("\n").slice(1).join("\n");
    fs.appendFileSync(VERLAUF, csvZeile, "utf8");
  }
}

/** @returns {Record<string,string>[]} */
export function ladeVerlauf() {
  return leseCsv(VERLAUF, VERLAUF_SPALTEN);
}

// ---------------------------------------------------------------- Hilfsmittel

/** @returns {string} Datum als YYYY-MM-DD */
export function heute() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * @param {string|Date} basis
 * @param {number} tage
 * @returns {string} YYYY-MM-DD
 */
export function plusTage(basis, tage) {
  const d = basis instanceof Date ? new Date(basis) : new Date(`${basis}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
}

/**
 * Zieht die Domain aus einer URL oder Mailadresse. Rueckgabe klein geschrieben,
 * ohne "www.". Leerstring, wenn nichts Brauchbares drinsteht.
 * @param {string} wert
 * @returns {string}
 */
export function domainVon(wert) {
  if (!wert) return "";
  const roh = String(wert).trim().toLowerCase();
  if (!roh) return "";

  if (roh.includes("@") && !roh.includes("/")) {
    return roh.split("@").pop().replace(/^www\./, "");
  }

  try {
    const url = new URL(roh.startsWith("http") ? roh : `https://${roh}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Kombinierende Akzentzeichen, die nach NFKD uebrig bleiben (aus "Müller" wird "Muller").
 * Bewusst als RegExp-Konstruktor, damit im Quelltext keine blanken Kombinationszeichen stehen.
 */
const DIAKRITIKA = new RegExp("[\\u0300-\\u036f]", "g");

/**
 * Stabile, kurze ID aus der Domain (oder dem Firmennamen, wenn keine Domain da ist).
 * Gleiche Firma -> gleiche ID, damit ein zweiter Import nicht dupliziert.
 * @param {{domain?: string, website?: string, email?: string, firma?: string}} kontakt
 * @returns {string}
 */
export function bildeId(kontakt) {
  const basis =
    kontakt.domain ||
    domainVon(kontakt.website) ||
    domainVon(kontakt.email) ||
    (kontakt.firma || "").toLowerCase();

  const kern = basis
    .normalize("NFKD")
    .replace(DIAKRITIKA, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return kern || `kontakt-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Legt einen leeren Kontakt mit allen Spalten an.
 * @param {Partial<Record<string,string>>} felder
 * @returns {Record<string,string>}
 */
export function neuerKontakt(felder = {}) {
  const kontakt = {};
  for (const spalte of SPALTEN) kontakt[spalte] = "";
  Object.assign(kontakt, felder);

  kontakt.domain = kontakt.domain || domainVon(kontakt.website) || domainVon(kontakt.email);
  kontakt.id = kontakt.id || bildeId(kontakt);
  kontakt.status = kontakt.status || "neu";
  kontakt.erfasst_am = kontakt.erfasst_am || heute();
  kontakt.land = kontakt.land || "DE";
  // "mail" ist der Standardweg. Kontakte aus Foren oder Netzwerken (Reddit,
  // LinkedIn) bekommen ihren eigenen Kanal, damit die Mail- und Anrufsequenz
  // sie nicht anfasst -- dort gelten die Regeln der jeweiligen Plattform.
  kontakt.kanal = kontakt.kanal || "mail";

  return kontakt;
}

/** @param {Record<string,string>} kontakt */
export function istAktiv(kontakt) {
  return STATUS[kontakt.status]?.aktiv === true;
}

/**
 * Darf dieser Kontakt ueberhaupt noch angefasst werden?
 * @param {Record<string,string>} kontakt
 * @param {Set<string>} sperrliste
 */
export function istGesperrt(kontakt, sperrliste) {
  if (GESPERRTE_STATUS.has(kontakt.status)) return true;
  if (kontakt.domain && sperrliste.has(kontakt.domain.toLowerCase())) return true;
  if (kontakt.email && sperrliste.has(kontakt.email.toLowerCase())) return true;
  return false;
}
