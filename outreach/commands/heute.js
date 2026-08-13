/**
 * `outreach heute` -- der Arbeitsplan fuer den Tag.
 *
 * Oben die Mails, die rausgehen (fertig formuliert, zum Kopieren), darunter die
 * Anrufliste mit Einstieg und Frage. Wer nicht angerufen werden darf, steht
 * getrennt mit Begruendung.
 *
 *   outreach heute
 *   outreach heute --nur mail
 *   outreach heute --nur anruf
 */

import { ladeKontakte, ladeSperrliste, istGesperrt, heute as heuteDatum } from "../lib/store.js";
import { naechsterSchritt, darfAngerufenWerden } from "../lib/sequenz.js";
import { baueMail } from "../lib/mail.js";
import { ladeConfig, kuerze, tabelle } from "../lib/util.js";

export const hilfe = `outreach heute [--nur mail|anruf] [--datum YYYY-MM-DD]

  --nur     Nur Mails oder nur Anrufe zeigen
  --datum   Plan fuer ein anderes Datum (Vorschau)`;

function faellig(kontakt, stichtag) {
  if (!kontakt.naechste_aktion_am) return true;
  return kontakt.naechste_aktion_am <= stichtag;
}

export async function fuehreAus(args) {
  const config = ladeConfig();
  const stichtag = args.datum && args.datum !== true ? String(args.datum) : heuteDatum();
  const alle = ladeKontakte();
  const sperrliste = ladeSperrliste();

  const mails = [];
  const anrufe = [];
  const blockiert = [];

  for (const kontakt of alle) {
    if (istGesperrt(kontakt, sperrliste)) continue;

    const schritt = naechsterSchritt(kontakt, config);
    if (!schritt) continue;
    if (!faellig(kontakt, stichtag)) continue;

    // Kontakte aus Foren und Netzwerken laufen nicht durch die Mail- und
    // Anrufsequenz. Dort gelten die Regeln der Plattform, und eine Mailvorlage
    // waere in einer Direktnachricht ohnehin fehl am Platz.
    if (kontakt.kanal && kontakt.kanal !== "mail" && kontakt.kanal !== "telefon") {
      blockiert.push([
        kontakt.id,
        kuerze(kontakt.firma, 30),
        schritt.schritt,
        `Kanal "${kontakt.kanal}" -- nicht Teil der Mail- und Anrufsequenz`,
      ]);
      continue;
    }

    if (schritt.kanal === "mail") {
      if (!kontakt.email) {
        blockiert.push([kontakt.id, kuerze(kontakt.firma, 30), schritt.schritt, "keine Mailadresse hinterlegt"]);
        continue;
      }
      mails.push({ kontakt, schritt });
    } else {
      const pruefung = darfAngerufenWerden(kontakt);
      if (!pruefung.erlaubt) {
        blockiert.push([kontakt.id, kuerze(kontakt.firma, 30), schritt.schritt, pruefung.grund]);
        continue;
      }
      anrufe.push({ kontakt, schritt });
    }
  }

  // Beste zuerst: hoher Relevanz-Score oben
  const nachScore = (a, b) => Number(b.kontakt.relevanz_score || 0) - Number(a.kontakt.relevanz_score || 0);
  mails.sort(nachScore);
  anrufe.sort(nachScore);

  const maxMails = Number(config.limits?.mails_pro_tag || 30);
  const maxAnrufe = Number(config.limits?.anrufe_pro_tag || 15);
  const heutigeMails = mails.slice(0, maxMails);
  const heutigeAnrufe = anrufe.slice(0, maxAnrufe);

  const nurMail = args.nur === "mail";
  const nurAnruf = args.nur === "anruf";

  console.log(`Plan fuer ${stichtag}\n`);

  if (!nurAnruf) {
    console.log(`MAILS  (${heutigeMails.length} von ${mails.length} faelligen, Tageslimit ${maxMails})`);
    console.log("=".repeat(72));
    if (heutigeMails.length === 0) console.log("Keine.\n");

    for (const { kontakt, schritt } of heutigeMails) {
      const mail = baueMail(kontakt, config, schritt.schritt);
      console.log(`\n--- ${kontakt.id}  (${schritt.schritt}, Relevanz ${kontakt.relevanz_score || "?"}) ---`);
      console.log(`An:      ${kontakt.email}`);
      console.log(`Betreff: ${mail.betreff}`);
      console.log("");
      console.log(mail.text);
      console.log("");
      console.log(`Danach:  outreach status ${kontakt.id} ${schritt.schritt}`);
    }
    console.log("");
  }

  if (!nurMail) {
    console.log(`\nANRUFE  (${heutigeAnrufe.length} von ${anrufe.length} faelligen, Tageslimit ${maxAnrufe})`);
    const fenster = config.anrufzeiten?.fenster || [];
    if (fenster.length) console.log(`Zeitfenster: ${fenster.join(", ")}`);
    console.log("=".repeat(72));
    if (heutigeAnrufe.length === 0) console.log("Keine.");

    for (const { kontakt, schritt } of heutigeAnrufe) {
      console.log(`\n--- ${kontakt.id}  (${schritt.schritt}, Relevanz ${kontakt.relevanz_score || "?"}) ---`);
      console.log(`${kontakt.firma}${kontakt.ort ? `, ${kontakt.ort}` : ""}`);
      console.log(`Nummer:  ${kontakt.telefon}`);
      if (kontakt.ansprechpartner) console.log(`Fragen nach: ${kontakt.ansprechpartner}`);
      console.log(`Grund:   ${kontakt.relevanz_begruendung}`);
      console.log("");
      console.log(`Einstieg: ${kontakt.call_opener}`);
      console.log(`Frage:    ${kontakt.call_frage}`);
      console.log("");
      console.log(`Danach:  outreach status ${kontakt.id} ${schritt.schritt} --notiz "..."`);
    }
    console.log("");
  }

  if (blockiert.length) {
    console.log(`\nNICHT KONTAKTIERBAR  (${blockiert.length})`);
    console.log("=".repeat(72));
    tabelle(["ID", "Firma", "Schritt", "Grund"], blockiert);
    console.log("\nDiese Kontakte bleiben liegen, bis der Grund behoben ist.");
  }

  console.log("\nEinwaende und Gespraechsfuehrung: outreach/vorlagen/call-leitfaden.md");
}
