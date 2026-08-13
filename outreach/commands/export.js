/**
 * `outreach export` -- schreibt die Kontakte als CSV, das sich direkt in Google
 * Sheets oder Excel importieren laesst.
 *
 * In Google Sheets: Datei -> Importieren -> Hochladen, Trennzeichen "Komma",
 * und "Aktuelles Blatt ersetzen" waehlen, damit die Kopfzeile stimmt.
 *
 *   outreach export --vorlage        nur die Kopfzeile plus eine Beispielzeile
 *   outreach export                  alle Kontakte
 *   outreach export --min-relevanz 4 nur die starken Treffer
 *   outreach export --status entwurf
 */

import fs from "node:fs";
import path from "node:path";
import { ladeKontakte, WURZEL, heute } from "../lib/store.js";
import { baueMail } from "../lib/mail.js";
import { toCsv } from "../lib/csv.js";
import { ladeConfig } from "../lib/util.js";

export const hilfe = `outreach export [--vorlage] [--status <status>] [--min-relevanz <n>] [--datei <pfad>]

  --vorlage       Nur Kopfzeile und eine als BEISPIEL markierte Zeile
  --status        Nur Kontakte mit diesem Status
  --min-relevanz  Nur Kontakte ab diesem Relevanz-Score
  --datei         Zielpfad (Standard: outreach/export/leads-<datum>.csv)`;

/** Spalten der Tabelle, in der Reihenfolge, in der man sie beim Arbeiten braucht. */
export const SHEET_SPALTEN = [
  "Status",
  "Kanal",
  "Relevanz",
  "Firma",
  "Ort",
  "Branche",
  "Website",
  "Ansprechpartner",
  "Rolle",
  "E-Mail",
  "Telefon",
  "Relevanz-Begruendung",
  "Aufhaenger",
  "Mail 1 Betreff",
  "Mail 1 Text",
  "Mail 2 Betreff",
  "Mail 2 Text",
  "Telefon-Einstieg",
  "Telefon-Frage",
  "Naechste Aktion am",
  "Letzte Aktion am",
  "Notizen",
  "ID",
  "Datenherkunft",
];

/**
 * @param {Record<string,string>} kontakt
 * @param {object} config
 * @returns {Record<string,string>}
 */
export function alsSheetZeile(kontakt, config) {
  // Mail-Texte inklusive Anrede, Signatur und Pflichtangaben exportieren --
  // was in der Tabelle steht, ist genau das, was rausgeht.
  const mail1 = kontakt.mail_text ? baueMail(kontakt, config, "mail1") : { betreff: "", text: "" };
  const mail2 = kontakt.mail2_text ? baueMail(kontakt, config, "mail2") : { betreff: "", text: "" };

  return {
    Status: kontakt.status,
    Kanal: kontakt.kanal,
    Relevanz: kontakt.relevanz_score,
    Firma: kontakt.firma,
    Ort: kontakt.ort,
    Branche: kontakt.branche,
    Website: kontakt.website,
    Ansprechpartner: kontakt.ansprechpartner,
    Rolle: kontakt.rolle,
    "E-Mail": kontakt.email,
    Telefon: kontakt.telefon,
    "Relevanz-Begruendung": kontakt.relevanz_begruendung,
    Aufhaenger: kontakt.hook,
    "Mail 1 Betreff": mail1.betreff,
    "Mail 1 Text": mail1.text,
    "Mail 2 Betreff": mail2.betreff,
    "Mail 2 Text": mail2.text,
    "Telefon-Einstieg": kontakt.call_opener,
    "Telefon-Frage": kontakt.call_frage,
    "Naechste Aktion am": kontakt.naechste_aktion_am,
    "Letzte Aktion am": kontakt.letzte_aktion_am,
    Notizen: kontakt.notizen,
    ID: kontakt.id,
    Datenherkunft: kontakt.datenherkunft,
  };
}

/** Eine als solche erkennbare Beispielzeile fuer die leere Vorlage. */
export const BEISPIELZEILE = {
  Status: "entwurf",
  Kanal: "mail",
  Relevanz: "4",
  Firma: "BEISPIEL — diese Zeile nach dem ersten echten Import loeschen",
  Ort: "Hamburg",
  Branche: "steuerberater",
  Website: "https://beispiel-kanzlei.de",
  Ansprechpartner: "unbekannt",
  Rolle: "",
  "E-Mail": "kontakt@beispiel-kanzlei.de",
  Telefon: "+49 40 000000",
  "Relevanz-Begruendung":
    "Kanzlei bietet laut Leistungsseite Jahresabschluss und Lohnbuchhaltung als feste Pakete an — wiederkehrender Auftragstyp mit digital uebergebbarem Ergebnis.",
  Aufhaenger: "Beschreibt auf der Leistungsseite drei feste Pakete statt Stundensaetze.",
  "Mail 1 Betreff": "Kurz zu Ihren wiederkehrenden Mandaten",
  "Mail 1 Text": "(wird von outreach entwurf gefuellt)",
  "Mail 2 Betreff": "",
  "Mail 2 Text": "",
  "Telefon-Einstieg": "(wird von outreach entwurf gefuellt)",
  "Telefon-Frage": "Wie laeuft bei Ihnen heute ein Jahresabschluss von der Anfrage bis zur Uebergabe?",
  "Naechste Aktion am": "",
  "Letzte Aktion am": "",
  Notizen: "",
  ID: "beispiel-kanzlei.de",
  Datenherkunft: "Beispiel, keine echten Daten",
};

export async function fuehreAus(args) {
  const config = ladeConfig();

  let zeilen;
  let standardName;

  if (args.vorlage) {
    zeilen = [BEISPIELZEILE];
    standardName = "vorlage.csv";
  } else {
    let kontakte = ladeKontakte();

    if (args.status && args.status !== true) {
      kontakte = kontakte.filter((k) => k.status === args.status);
    }
    if (args["min-relevanz"] && args["min-relevanz"] !== true) {
      const min = Number(args["min-relevanz"]);
      kontakte = kontakte.filter((k) => Number(k.relevanz_score || 0) >= min);
    }

    kontakte.sort(
      (a, b) =>
        Number(b.relevanz_score || 0) - Number(a.relevanz_score || 0) ||
        a.firma.localeCompare(b.firma, "de")
    );

    zeilen = kontakte.map((k) => alsSheetZeile(k, config));
    standardName = `leads-${heute()}.csv`;
  }

  const ziel =
    args.datei && args.datei !== true
      ? String(args.datei)
      : path.join(WURZEL, "export", standardName);

  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  fs.writeFileSync(ziel, toCsv(SHEET_SPALTEN, zeilen), "utf8");

  console.log(`${zeilen.length} Zeile(n) geschrieben nach:\n  ${ziel}\n`);
  console.log("In Google Sheets einlesen:");
  console.log("  1. Tabelle oeffnen");
  console.log("  2. Datei -> Importieren -> Hochladen, diese Datei waehlen");
  console.log('  3. Importort "Aktuelles Blatt ersetzen", Trennzeichen "Komma"');
  console.log("  4. Importieren");
}
