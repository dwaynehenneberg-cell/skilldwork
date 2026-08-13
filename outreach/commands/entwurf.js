/**
 * `outreach entwurf` -- schreibt aus dem Steckbrief die Erstkontakt-Mail, die
 * Follow-up-Mail und den Telefoneinstieg, und bewertet die Relevanz.
 *
 * Ziel jeder Erstmail: ein Call von rund 15 Minuten ueber den Ablauf des
 * angeschriebenen Unternehmens. Kein Angebot, kein Preis, keine Demo.
 *
 *   outreach entwurf
 *   outreach entwurf --limit 25
 *   outreach entwurf --nur muster-gmbh.de --neu
 */

import {
  ladeKontakte,
  speichereKontakte,
  ladeSperrliste,
  istGesperrt,
  heute,
} from "../lib/store.js";
import { erstelleClient, entwirfErstkontakt, schaetzeKosten } from "../lib/claude.js";
import { leseSteckbrief } from "./recherche.js";
import { ladeConfig, parallel, kuerze, tabelle } from "../lib/util.js";

export const hilfe = `outreach entwurf [--limit <n>] [--nur <id>] [--neu] [--trocken]

  --limit    Hoechstzahl der Kontakte in diesem Durchlauf
  --nur      Nur diesen einen Kontakt
  --neu      Auch schon entworfene Kontakte neu texten (z. B. nach Aenderung der Positionierung)
  --trocken  Nur zeigen, wer bearbeitet wuerde -- kein API-Aufruf, keine Kosten`;

export async function fuehreAus(args) {
  const config = ladeConfig();
  const alle = ladeKontakte();
  const sperrliste = ladeSperrliste();

  const offen = alle.filter((k) => {
    if (istGesperrt(k, sperrliste)) return false;
    if (args.nur && args.nur !== true) return k.id === args.nur;
    if (!k.recherche_am) return false;
    if (!args.neu && k.mail_text) return false;
    return true;
  });

  const mitSteckbrief = offen.filter((k) => leseSteckbrief(k.id).trim().length > 0);
  const ohneSteckbrief = offen.length - mitSteckbrief.length;
  if (ohneSteckbrief > 0) {
    console.log(`${ohneSteckbrief} Kontakte haben keinen Steckbrief. Erst "outreach recherche" laufen lassen.`);
  }

  const limit = args.limit && args.limit !== true ? Number(args.limit) : mitSteckbrief.length;
  const arbeitsvorrat = mitSteckbrief.slice(0, Math.max(0, limit));

  if (arbeitsvorrat.length === 0) {
    console.log("Nichts zu entwerfen.");
    return;
  }

  console.log(`${arbeitsvorrat.length} Entwuerfe werden geschrieben.`);

  if (args.trocken) {
    for (const k of arbeitsvorrat) console.log(`  ${k.id}  ${kuerze(k.firma, 45)}`);
    console.log("\nTrockenlauf, kein API-Aufruf.");
    return;
  }

  const client = erstelleClient();
  const gleichzeitig = Number(config.claude?.parallel || 3);
  const minScore = Number(config.limits?.min_relevanz_score || 3);
  let fertig = 0;
  let kosten = 0;

  const ergebnisse = await parallel(arbeitsvorrat, gleichzeitig, async (kontakt) => {
    const steckbrief = leseSteckbrief(kontakt.id);
    const { entwurf, verbrauch } = await entwirfErstkontakt(client, kontakt, steckbrief, config);
    fertig += 1;
    kosten += schaetzeKosten(verbrauch);
    console.log(
      `  [${fertig}/${arbeitsvorrat.length}] ${kuerze(kontakt.firma, 40)}  Relevanz ${entwurf.relevanz_score}`
    );
    return entwurf;
  });

  const gescheitert = [];
  const uebersicht = [];

  ergebnisse.forEach((e, i) => {
    const quelle = arbeitsvorrat[i];
    if (!e?.ok) {
      gescheitert.push({ kontakt: quelle, fehler: e?.fehler });
      return;
    }

    const entwurf = e.wert;
    const kontakt = alle.find((k) => k.id === quelle.id);

    kontakt.relevanz_score = String(entwurf.relevanz_score ?? "");
    kontakt.relevanz_begruendung = entwurf.relevanz_begruendung || "";
    kontakt.ausschluss_grund = entwurf.ausschluss_grund || "";
    kontakt.hook = entwurf.hook || "";
    kontakt.anrede = entwurf.anrede || "";
    kontakt.mail_betreff = entwurf.mail_betreff || "";
    kontakt.mail_text = entwurf.mail_text || "";
    kontakt.mail2_betreff = entwurf.mail2_betreff || "";
    kontakt.mail2_text = entwurf.mail2_text || "";
    kontakt.call_opener = entwurf.call_opener || "";
    kontakt.call_frage = entwurf.call_frage || "";

    const score = Number(entwurf.relevanz_score || 0);
    const raus = Boolean(entwurf.ausschluss_grund) || score < minScore;

    if (raus) {
      kontakt.status = "kein_interesse";
      kontakt.notizen = [kontakt.notizen, `Aussortiert beim Entwurf: ${entwurf.ausschluss_grund || `Relevanz ${score} unter Mindestwert ${minScore}`}`]
        .filter(Boolean)
        .join(" | ");
    } else {
      kontakt.status = "entwurf";
      kontakt.naechste_aktion_am = heute();
    }

    uebersicht.push([
      kontakt.id,
      kuerze(kontakt.firma, 28),
      String(score),
      raus ? "aussortiert" : "bereit",
      kuerze(kontakt.mail_betreff, 40),
    ]);
  });

  speichereKontakte(alle);

  console.log("");
  tabelle(["ID", "Firma", "Relevanz", "Status", "Betreff"], uebersicht);

  const bereit = uebersicht.filter((z) => z[3] === "bereit").length;
  console.log(
    `\nBereit fuer die Ansprache: ${bereit}   Aussortiert: ${uebersicht.length - bereit}   Fehler: ${gescheitert.length}`
  );
  console.log(`Geschaetzte Kosten dieses Durchlaufs: rund ${kosten.toFixed(2)} EUR`);
  for (const g of gescheitert) {
    console.log(`  Fehler bei ${g.kontakt.id}: ${g.fehler?.message || g.fehler}`);
  }
  console.log("\nJetzt pruefen: outreach heute  (und die Entwuerfe in kontakte.csv gegenlesen)");
}
