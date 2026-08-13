/**
 * `outreach recherche` -- laesst Claude jedes Unternehmen anschauen und einen
 * Steckbrief schreiben.
 *
 * Claude ruft dabei selbst die Website ab (Werkzeug web_fetch) und sucht bei
 * Bedarf nach dem Ansprechpartner (web_search). Der Steckbrief landet als
 * Markdown-Datei in data/steckbriefe/<id>.md, damit die CSV lesbar bleibt.
 *
 *   outreach recherche                  alle offenen Kontakte
 *   outreach recherche --limit 20       nur die naechsten 20
 *   outreach recherche --nur muster-gmbh.de
 *   outreach recherche --neu            auch schon recherchierte nochmal
 */

import fs from "node:fs";
import path from "node:path";
import { ladeKontakte, speichereKontakte, ladeSperrliste, istGesperrt, heute, DATEN_DIR } from "../lib/store.js";
import { erstelleClient, recherchiereUnternehmen, schaetzeKosten } from "../lib/claude.js";
import { ladeConfig, parallel, kuerze } from "../lib/util.js";

export const hilfe = `outreach recherche [--limit <n>] [--nur <id>] [--neu] [--trocken]

  --limit    Hoechstzahl der Kontakte in diesem Durchlauf
  --nur      Nur diesen einen Kontakt (ID aus kontakte.csv)
  --neu      Auch bereits recherchierte Kontakte erneut bearbeiten
  --trocken  Nur zeigen, wer bearbeitet wuerde -- kein API-Aufruf, keine Kosten`;

export const STECKBRIEF_DIR = path.join(DATEN_DIR, "steckbriefe");

/** @param {string} id */
export function steckbriefPfad(id) {
  return path.join(STECKBRIEF_DIR, `${id}.md`);
}

/** @param {string} id @returns {string} */
export function leseSteckbrief(id) {
  const pfad = steckbriefPfad(id);
  return fs.existsSync(pfad) ? fs.readFileSync(pfad, "utf8") : "";
}

export async function fuehreAus(args) {
  const config = ladeConfig();
  const alle = ladeKontakte();
  const sperrliste = ladeSperrliste();

  let offen = alle.filter((k) => {
    if (istGesperrt(k, sperrliste)) return false;
    if (args.nur && args.nur !== true) return k.id === args.nur;
    if (!args.neu && k.recherche_am) return false;
    return k.status === "neu" || (args.neu && k.website);
  });

  if (!args.nur) {
    // Ohne Website kann Claude nichts abrufen -- die kommen erst dran, wenn du
    // die Adresse von Hand ergaenzt hast.
    const ohneWebsite = offen.filter((k) => !k.website);
    if (ohneWebsite.length) {
      console.log(
        `${ohneWebsite.length} Kontakte haben keine Website und werden uebersprungen. ` +
          `Website in kontakte.csv nachtragen, dann erneut laufen lassen.`
      );
    }
    offen = offen.filter((k) => k.website);
  }

  const limit = args.limit && args.limit !== true ? Number(args.limit) : offen.length;
  const arbeitsvorrat = offen.slice(0, Math.max(0, limit));

  if (arbeitsvorrat.length === 0) {
    console.log("Nichts zu recherchieren.");
    return;
  }

  console.log(`${arbeitsvorrat.length} Kontakte werden recherchiert.`);

  if (args.trocken) {
    for (const k of arbeitsvorrat) console.log(`  ${k.id}  ${kuerze(k.firma, 40)}  ${k.website}`);
    console.log("\nTrockenlauf, kein API-Aufruf.");
    return;
  }

  fs.mkdirSync(STECKBRIEF_DIR, { recursive: true });
  const client = erstelleClient();
  const gleichzeitig = Number(config.claude?.parallel || 3);
  let fertig = 0;
  let kosten = 0;

  const ergebnisse = await parallel(arbeitsvorrat, gleichzeitig, async (kontakt) => {
    const { steckbrief, verbrauch } = await recherchiereUnternehmen(client, kontakt, config);
    fs.writeFileSync(
      steckbriefPfad(kontakt.id),
      `# ${kontakt.firma}\n\nQuelle: ${kontakt.website}\nRecherchiert: ${heute()}\n\n${steckbrief}\n`,
      "utf8"
    );
    fertig += 1;
    kosten += schaetzeKosten(verbrauch);
    console.log(`  [${fertig}/${arbeitsvorrat.length}] ${kuerze(kontakt.firma, 45)}`);
    return true;
  });

  const gescheitert = [];
  ergebnisse.forEach((e, i) => {
    const kontakt = arbeitsvorrat[i];
    if (e?.ok) {
      const eintrag = alle.find((k) => k.id === kontakt.id);
      eintrag.recherche_am = heute();
      if (eintrag.status === "neu") eintrag.status = "recherchiert";
    } else {
      gescheitert.push({ kontakt, fehler: e?.fehler });
    }
  });

  speichereKontakte(alle);

  console.log(`\nFertig: ${ergebnisse.filter((e) => e?.ok).length}, Fehler: ${gescheitert.length}`);
  console.log(`Geschaetzte Kosten dieses Durchlaufs: rund ${kosten.toFixed(2)} EUR`);
  for (const g of gescheitert) {
    console.log(`  Fehler bei ${g.kontakt.id}: ${g.fehler?.message || g.fehler}`);
  }
  console.log("\nNaechster Schritt: outreach entwurf");
}
