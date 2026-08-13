/**
 * `outreach sammeln` -- Kandidaten aus OpenStreetMap holen und in kontakte.csv legen.
 *
 *   outreach sammeln --ort Hamburg --branche steuerberater
 *   outreach sammeln --ort "Landkreis Harburg" --tag office=consulting
 *   outreach sammeln --ort Lueneburg --branche werbeagentur --trocken
 */

import {
  ladeKontakte,
  speichereKontakte,
  ladeSperrliste,
  neuerKontakt,
  domainVon,
} from "../lib/store.js";
import { BRANCHEN, sucheKandidaten, baueAbfrage } from "../lib/quellen.js";
import { tabelle, kuerze } from "../lib/util.js";

export const hilfe = `outreach sammeln --ort <Ort> [--branche <Kuerzel> | --tag key=value] [--trocken]

  --ort       Name der Gemeinde, Stadt oder des Landkreises, wie in OpenStreetMap
  --branche   Kuerzel aus der Branchenliste (siehe unten)
  --tag       Eigener OSM-Tag, mehrfach durch Komma getrennt: --tag office=it,office=consulting
  --trocken   Nur die Abfrage und die Treffer zeigen, nichts speichern

  Branchen: ${Object.keys(BRANCHEN).join(", ")}`;

export async function fuehreAus(args) {
  const ort = args.ort;
  if (!ort || ort === true) {
    console.error("Fehlt: --ort\n\n" + hilfe);
    process.exitCode = 1;
    return;
  }

  let tags;
  let branche;
  if (args.tag && args.tag !== true) {
    tags = String(args.tag).split(",").map((t) => t.trim()).filter(Boolean);
    branche = args.branche && args.branche !== true ? String(args.branche) : tags[0];
  } else if (args.branche && args.branche !== true) {
    branche = String(args.branche);
    tags = BRANCHEN[branche];
    if (!tags) {
      console.error(`Unbekannte Branche "${branche}".\nBekannt: ${Object.keys(BRANCHEN).join(", ")}`);
      process.exitCode = 1;
      return;
    }
  } else {
    console.error("Fehlt: --branche oder --tag\n\n" + hilfe);
    process.exitCode = 1;
    return;
  }

  if (args.trocken) {
    console.log("Overpass-Abfrage:\n");
    console.log(baueAbfrage({ ort, tags }));
    console.log("");
  }

  console.log(`Suche ${tags.join(", ")} in "${ort}" …`);
  const roh = await sucheKandidaten({ ort, tags, branche });
  console.log(`${roh.length} Eintraege in OpenStreetMap gefunden.\n`);

  const bestand = ladeKontakte();
  const sperrliste = ladeSperrliste();
  const bekannteIds = new Set(bestand.map((k) => k.id));

  const neue = [];
  const uebersprungen = { doppelt: 0, gesperrt: 0, ohneKontaktweg: 0 };

  for (const eintrag of roh) {
    const kandidat = neuerKontakt(eintrag);

    if (!kandidat.website && !kandidat.email && !kandidat.telefon) {
      uebersprungen.ohneKontaktweg += 1;
      continue;
    }
    if (bekannteIds.has(kandidat.id)) {
      uebersprungen.doppelt += 1;
      continue;
    }
    const domain = kandidat.domain || domainVon(kandidat.website);
    if (
      (domain && sperrliste.has(domain)) ||
      (kandidat.email && sperrliste.has(kandidat.email.toLowerCase()))
    ) {
      uebersprungen.gesperrt += 1;
      continue;
    }

    bekannteIds.add(kandidat.id);
    neue.push(kandidat);
  }

  tabelle(
    ["ID", "Firma", "Website", "Telefon"],
    neue.slice(0, 15).map((k) => [k.id, kuerze(k.firma, 32), kuerze(k.website, 34), k.telefon])
  );
  if (neue.length > 15) console.log(`… und ${neue.length - 15} weitere`);

  console.log(
    `\nNeu: ${neue.length}   Doppelt: ${uebersprungen.doppelt}   ` +
      `Gesperrt: ${uebersprungen.gesperrt}   Ohne Kontaktweg: ${uebersprungen.ohneKontaktweg}`
  );

  if (args.trocken) {
    console.log("\nTrockenlauf, nichts gespeichert.");
    return;
  }

  if (neue.length > 0) {
    speichereKontakte([...bestand, ...neue]);
    console.log(`\nGespeichert in outreach/data/kontakte.csv (Bestand jetzt ${bestand.length + neue.length}).`);
    console.log("Naechster Schritt: outreach recherche");
  }
}
