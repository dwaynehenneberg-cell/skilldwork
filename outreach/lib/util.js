/** Kleinkram, den mehrere Kommandos brauchen. */

import fs from "node:fs";
import path from "node:path";
import { WURZEL } from "./store.js";

/**
 * Laedt outreach/config.json. Faellt auf config.example.json zurueck, damit ein
 * Trockenlauf ohne eigene Konfiguration moeglich ist.
 * @returns {object}
 */
export function ladeConfig() {
  const eigen = path.join(WURZEL, "config.json");
  const beispiel = path.join(WURZEL, "config.example.json");

  if (fs.existsSync(eigen)) {
    return JSON.parse(fs.readFileSync(eigen, "utf8"));
  }

  console.warn(
    "Hinweis: outreach/config.json fehlt, es gilt config.example.json.\n" +
      "         Kopiere sie und trage deine Absenderdaten ein:\n" +
      "         cp outreach/config.example.json outreach/config.json\n"
  );
  return JSON.parse(fs.readFileSync(beispiel, "utf8"));
}

/**
 * Arbeitet eine Liste mit begrenzter Parallelitaet ab. Ergebnisse behalten die
 * Reihenfolge der Eingabe.
 * @template E,A
 * @param {E[]} eintraege
 * @param {number} gleichzeitig
 * @param {(eintrag: E, index: number) => Promise<A>} arbeit
 * @returns {Promise<Array<{ok: true, wert: A} | {ok: false, fehler: Error}>>}
 */
export async function parallel(eintraege, gleichzeitig, arbeit) {
  const ergebnisse = new Array(eintraege.length);
  let naechster = 0;

  async function arbeiter() {
    while (true) {
      const i = naechster;
      naechster += 1;
      if (i >= eintraege.length) return;
      try {
        ergebnisse[i] = { ok: true, wert: await arbeit(eintraege[i], i) };
      } catch (fehler) {
        ergebnisse[i] = { ok: false, fehler };
      }
    }
  }

  const anzahl = Math.max(1, Math.min(gleichzeitig, eintraege.length));
  await Promise.all(Array.from({ length: anzahl }, arbeiter));
  return ergebnisse;
}

/**
 * Wandelt `--schluessel wert` und `--schalter` in ein Objekt.
 * Freie Argumente landen unter `_`.
 * @param {string[]} argv
 * @returns {Record<string, string|boolean|string[]>}
 */
export function leseArgumente(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const teil = argv[i];
    if (!teil.startsWith("--")) {
      args._.push(teil);
      continue;
    }
    const schluessel = teil.slice(2);
    const naechstes = argv[i + 1];
    if (naechstes === undefined || naechstes.startsWith("--")) {
      args[schluessel] = true;
    } else {
      args[schluessel] = naechstes;
      i += 1;
    }
  }
  return args;
}

/** Kuerzt einen Text auf `laenge` Zeichen, mit Auslassung. */
export function kuerze(text, laenge) {
  const s = String(text ?? "").replace(/\s+/g, " ").trim();
  return s.length <= laenge ? s : `${s.slice(0, laenge - 1)}…`;
}

/**
 * Gibt eine Tabelle mit ausgerichteten Spalten aus.
 * @param {string[]} kopf
 * @param {string[][]} zeilen
 */
export function tabelle(kopf, zeilen) {
  if (zeilen.length === 0) return;
  const breiten = kopf.map((k, i) =>
    Math.max(k.length, ...zeilen.map((z) => String(z[i] ?? "").length))
  );
  const linie = (zellen) =>
    zellen.map((z, i) => String(z ?? "").padEnd(breiten[i])).join("  ").trimEnd();

  console.log(linie(kopf));
  console.log(breiten.map((b) => "-".repeat(b)).join("  "));
  for (const zeile of zeilen) console.log(linie(zeile));
}
