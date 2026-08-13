#!/usr/bin/env node
/**
 * Einstiegspunkt des Outreach-Toolkits.
 *
 *   node outreach/bin/outreach.js <kommando> [optionen]
 *
 * Der uebliche Weg durch die Kommandos:
 *   sammeln / import  ->  recherche  ->  entwurf  ->  heute  ->  status  ->  bericht
 */

import { leseArgumente } from "../lib/util.js";

const KOMMANDOS = {
  sammeln: () => import("../commands/sammeln.js"),
  import: () => import("../commands/importieren.js"),
  recherche: () => import("../commands/recherche.js"),
  entwurf: () => import("../commands/entwurf.js"),
  heute: () => import("../commands/heute.js"),
  status: () => import("../commands/status.js"),
  export: () => import("../commands/export.js"),
  bericht: () => import("../commands/bericht.js"),
};

const UEBERSICHT = `Skilldwork Outreach

  outreach sammeln     Kandidaten aus OpenStreetMap holen
  outreach import      Eigene CSV-Liste uebernehmen
  outreach recherche   Claude liest die Websites und schreibt Steckbriefe
  outreach entwurf     Claude schreibt Mails, Telefoneinstieg und Relevanzbewertung
  outreach heute       Arbeitsplan fuer heute: Mails zum Kopieren, Anrufliste
  outreach status      Festhalten, was passiert ist
  outreach export      CSV fuer Google Sheets oder Excel schreiben
  outreach bericht     Stand der Kampagne und Quoten

  outreach <kommando> --hilfe   Optionen des Kommandos

Vor dem ersten Lauf:
  cd outreach && npm install
  cp config.example.json config.json    und darin die Absenderdaten eintragen
  export ANTHROPIC_API_KEY=...          fuer recherche und entwurf

Rechtliches vor dem ersten Versand lesen: outreach/docs/recht.md`;

async function main() {
  const [, , kommando, ...rest] = process.argv;

  if (!kommando || kommando === "--hilfe" || kommando === "-h" || kommando === "hilfe") {
    console.log(UEBERSICHT);
    return;
  }

  const laden = KOMMANDOS[kommando];
  if (!laden) {
    console.error(`Unbekanntes Kommando "${kommando}".\n\n${UEBERSICHT}`);
    process.exitCode = 1;
    return;
  }

  const modul = await laden();
  const args = leseArgumente(rest);

  if (args.hilfe || args.h) {
    console.log(modul.hilfe);
    return;
  }

  await modul.fuehreAus(args);
}

main().catch((fehler) => {
  console.error(`\nAbgebrochen: ${fehler.message}`);
  if (process.env.OUTREACH_DEBUG) console.error(fehler);
  process.exitCode = 1;
});
