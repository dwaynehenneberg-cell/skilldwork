/**
 * `outreach import` -- eigene Liste (CSV aus Excel, Sheets, einem Verzeichnis)
 * in kontakte.csv uebernehmen.
 *
 *   outreach import --datei ~/Downloads/messe-teilnehmer.csv --quelle "Messe Hamburg 2026"
 *
 * Spaltennamen werden geraten: firma/name/unternehmen/company, website/url/homepage,
 * email/e-mail/mail, telefon/phone/tel, ort/stadt/city, plz/zip, ansprechpartner/kontakt.
 * Alles, was nicht zugeordnet werden kann, landet gesammelt in "notizen".
 */

import fs from "node:fs";
import { parseCsv } from "../lib/csv.js";
import {
  ladeKontakte,
  speichereKontakte,
  ladeSperrliste,
  neuerKontakt,
  heute,
} from "../lib/store.js";
import { tabelle, kuerze } from "../lib/util.js";

export const hilfe = `outreach import --datei <pfad.csv> [--quelle <Bezeichnung>] [--trocken]

  --datei    CSV mit Kopfzeile
  --quelle   Woher die Liste stammt. Landet in der Spalte datenherkunft.
  --trocken  Nur zeigen, was passieren wuerde`;

const ZUORDNUNG = {
  firma: ["firma", "name", "unternehmen", "company", "firmenname", "betrieb"],
  website: ["website", "url", "homepage", "webseite", "web", "internet"],
  email: ["email", "e-mail", "mail", "e_mail", "mailadresse"],
  telefon: ["telefon", "phone", "tel", "telefonnummer", "festnetz", "mobil"],
  ort: ["ort", "stadt", "city", "standort"],
  plz: ["plz", "zip", "postleitzahl", "postcode"],
  land: ["land", "country"],
  branche: ["branche", "kategorie", "industry", "segment"],
  ansprechpartner: ["ansprechpartner", "kontakt", "contact", "vorname nachname", "person", "handle"],
  rolle: ["rolle", "position", "funktion", "titel"],
  kanal: ["kanal", "channel"],
  relevanz_begruendung: ["problem", "bedarf", "anlass", "relevanz", "relevanz-begruendung"],
  quelle: ["quelle", "source", "fundstelle"],
};

function normiere(schluessel) {
  return String(schluessel).toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Baut aus der Kopfzeile eine Abbildung Quellspalte -> Zielfeld.
 * @param {string[]} kopf
 */
export function ordneSpaltenZu(kopf) {
  const abbildung = {};
  for (const spalte of kopf) {
    const n = normiere(spalte);
    for (const [ziel, kandidaten] of Object.entries(ZUORDNUNG)) {
      if (kandidaten.includes(n) && !Object.values(abbildung).includes(ziel)) {
        abbildung[spalte] = ziel;
        break;
      }
    }
  }
  return abbildung;
}

export async function fuehreAus(args) {
  const datei = args.datei;
  if (!datei || datei === true) {
    console.error("Fehlt: --datei\n\n" + hilfe);
    process.exitCode = 1;
    return;
  }
  if (!fs.existsSync(datei)) {
    console.error(`Datei nicht gefunden: ${datei}`);
    process.exitCode = 1;
    return;
  }

  const { header, rows } = parseCsv(fs.readFileSync(datei, "utf8"));
  if (rows.length === 0) {
    console.error("Die Datei enthaelt keine Datenzeilen.");
    process.exitCode = 1;
    return;
  }

  const abbildung = ordneSpaltenZu(header);
  const zugeordnet = Object.entries(abbildung);
  const rest = header.filter((h) => !abbildung[h]);

  console.log("Spaltenzuordnung:");
  for (const [quelle, ziel] of zugeordnet) console.log(`  ${quelle}  ->  ${ziel}`);
  if (rest.length) console.log(`  Nicht zugeordnet (wandert nach notizen): ${rest.join(", ")}`);
  if (!Object.values(abbildung).includes("firma")) {
    console.error("\nKeine Spalte fuer den Firmennamen erkannt. Benenne sie in 'firma' um.");
    process.exitCode = 1;
    return;
  }
  console.log("");

  const quelle = args.quelle && args.quelle !== true ? String(args.quelle) : `Import ${datei}`;
  const bestand = ladeKontakte();
  const sperrliste = ladeSperrliste();
  const bekannteIds = new Set(bestand.map((k) => k.id));

  const neue = [];
  const uebersprungen = { doppelt: 0, gesperrt: 0, ohneFirma: 0 };

  for (const zeile of rows) {
    const felder = {};
    for (const [quellSpalte, ziel] of zugeordnet) felder[ziel] = zeile[quellSpalte] || "";

    if (!felder.firma) {
      uebersprungen.ohneFirma += 1;
      continue;
    }

    const notizen = rest
      .filter((h) => zeile[h])
      .map((h) => `${h}: ${zeile[h]}`)
      .join(" | ");

    // Eine Quellenspalte in der Datei ist genauer als die pauschale Angabe auf
    // der Kommandozeile und hat deshalb Vorrang.
    const zeilenQuelle = felder.quelle || quelle;

    const kandidat = neuerKontakt({
      ...felder,
      notizen,
      quelle: zeilenQuelle,
      datenherkunft: `${quelle}${felder.quelle ? ` (${felder.quelle})` : ""}, uebernommen ${heute()}`,
    });

    if (bekannteIds.has(kandidat.id)) {
      uebersprungen.doppelt += 1;
      continue;
    }
    if (
      (kandidat.domain && sperrliste.has(kandidat.domain)) ||
      (kandidat.email && sperrliste.has(kandidat.email.toLowerCase()))
    ) {
      uebersprungen.gesperrt += 1;
      continue;
    }

    bekannteIds.add(kandidat.id);
    neue.push(kandidat);
  }

  tabelle(
    ["ID", "Firma", "Mail", "Telefon"],
    neue.slice(0, 15).map((k) => [k.id, kuerze(k.firma, 32), kuerze(k.email, 30), k.telefon])
  );
  if (neue.length > 15) console.log(`… und ${neue.length - 15} weitere`);

  console.log(
    `\nNeu: ${neue.length}   Doppelt: ${uebersprungen.doppelt}   ` +
      `Gesperrt: ${uebersprungen.gesperrt}   Ohne Firmenname: ${uebersprungen.ohneFirma}`
  );

  if (args.trocken) {
    console.log("\nTrockenlauf, nichts gespeichert.");
    return;
  }

  if (neue.length > 0) {
    speichereKontakte([...bestand, ...neue]);
    console.log(`\nGespeichert (Bestand jetzt ${bestand.length + neue.length}).`);
  }
}
