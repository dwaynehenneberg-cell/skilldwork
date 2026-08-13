/**
 * `outreach bericht` -- wo steht die Kampagne.
 *
 * Zeigt die Verteilung ueber die Stufen und die Quoten, auf die es ankommt:
 * Antwortquote, Erreichbarkeit am Telefon, Termine.
 */

import { ladeKontakte, ladeVerlauf, STATUS } from "../lib/store.js";
import { tabelle } from "../lib/util.js";

export const hilfe = `outreach bericht [--seit YYYY-MM-DD]

  --seit  Nur Statuswechsel ab diesem Datum in die Aktivitaetszahlen einrechnen`;

function quote(zaehler, nenner) {
  if (!nenner) return "-";
  return `${((zaehler / nenner) * 100).toFixed(1)} %`;
}

export async function fuehreAus(args) {
  const kontakte = ladeKontakte();
  if (kontakte.length === 0) {
    console.log("Noch keine Kontakte. Starte mit: outreach sammeln --ort <Ort> --branche <Kuerzel>");
    return;
  }

  const nachStatus = {};
  for (const k of kontakte) {
    nachStatus[k.status] = (nachStatus[k.status] || 0) + 1;
  }

  console.log(`Kontakte gesamt: ${kontakte.length}\n`);

  tabelle(
    ["Status", "Anzahl", "Bedeutung"],
    Object.keys(STATUS)
      .filter((s) => nachStatus[s])
      .map((s) => [s, String(nachStatus[s]), STATUS[s].beschreibung])
  );

  // Wer hat mindestens eine Mail bekommen?
  const verlauf = ladeVerlauf();
  const seit = args.seit && args.seit !== true ? String(args.seit) : null;
  const relevant = seit ? verlauf.filter((v) => v.zeitpunkt.slice(0, 10) >= seit) : verlauf;

  const erreichteIds = new Set(
    relevant.filter((v) => v.nach_status.startsWith("mail")).map((v) => v.id)
  );
  const angerufeneIds = new Set(
    relevant.filter((v) => v.nach_status.startsWith("anruf")).map((v) => v.id)
  );

  const geantwortet = kontakte.filter((k) =>
    ["geantwortet", "termin", "gespraech", "kein_interesse"].includes(k.status)
  ).length;
  const gespraeche = kontakte.filter((k) => ["gespraech", "termin"].includes(k.status)).length;
  const termine = kontakte.filter((k) => k.status === "termin").length;
  const optOuts = kontakte.filter((k) => k.status === "opt_out").length;

  console.log("");
  tabelle(
    ["Kennzahl", "Wert", "Quote"],
    [
      ["Angeschrieben (mind. 1 Mail)", String(erreichteIds.size), ""],
      ["Angerufen (mind. 1 Versuch)", String(angerufeneIds.size), ""],
      ["Reaktion jeder Art", String(geantwortet), quote(geantwortet, erreichteIds.size)],
      ["Gespraech zustande gekommen", String(gespraeche), quote(gespraeche, angerufeneIds.size)],
      ["Call vereinbart", String(termine), quote(termine, erreichteIds.size)],
      ["Widersprueche", String(optOuts), quote(optOuts, erreichteIds.size)],
    ]
  );

  console.log("");
  if (optOuts > 0 && erreichteIds.size > 0 && optOuts / erreichteIds.size > 0.03) {
    console.log(
      "Die Widerspruchsquote liegt ueber 3 Prozent. Das ist ein Signal, dass die Zielgruppe\n" +
        "oder die Ansprache nicht passt -- eher die Auswahl schaerfen als das Volumen erhoehen."
    );
  }

  const bereit = kontakte.filter((k) => k.status === "entwurf").length;
  if (bereit > 0) console.log(`${bereit} Entwuerfe warten auf den Versand: outreach heute`);

  const offen = kontakte.filter((k) => k.status === "neu").length;
  if (offen > 0) console.log(`${offen} Kontakte sind noch nicht recherchiert: outreach recherche`);
}
