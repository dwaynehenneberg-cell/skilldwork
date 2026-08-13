/**
 * `outreach status <id> <neuer-status>` -- festhalten, was passiert ist.
 *
 *   outreach status muster-gmbh.de mail1
 *   outreach status muster-gmbh.de gespraech --notiz "Inhaberin, ruft naechste Woche zurueck"
 *   outreach status muster-gmbh.de termin --notiz "Di 14:00"
 *   outreach status muster-gmbh.de opt_out
 *
 * Bei `opt_out`, `kein_interesse` und `unzustellbar` wandert die Domain
 * zusaetzlich auf die Sperrliste -- ein spaeterer Import holt den Kontakt dann
 * nicht versehentlich zurueck.
 */

import {
  ladeKontakte,
  speichereKontakte,
  ergaenzeSperrliste,
  protokolliere,
  STATUS,
  GESPERRTE_STATUS,
  heute,
  plusTage,
} from "../lib/store.js";
import { naechsterSchritt } from "../lib/sequenz.js";
import { ladeConfig } from "../lib/util.js";

export const hilfe = `outreach status <id> <status> [--notiz "..."]

  Status: ${Object.keys(STATUS).join(", ")}

  ${Object.entries(STATUS)
    .map(([name, s]) => `  ${name.padEnd(15)} ${s.beschreibung}`)
    .join("\n")}`;

export async function fuehreAus(args) {
  const [id, neuerStatus] = args._;

  if (!id || !neuerStatus) {
    console.error("Aufruf: outreach status <id> <status>\n\n" + hilfe);
    process.exitCode = 1;
    return;
  }
  if (!STATUS[neuerStatus]) {
    console.error(`Unbekannter Status "${neuerStatus}".\n\n` + hilfe);
    process.exitCode = 1;
    return;
  }

  const config = ladeConfig();
  const alle = ladeKontakte();
  const kontakt = alle.find((k) => k.id === id);

  if (!kontakt) {
    console.error(`Kein Kontakt mit der ID "${id}".`);
    process.exitCode = 1;
    return;
  }

  const vorher = kontakt.status;
  const notiz = args.notiz && args.notiz !== true ? String(args.notiz) : "";

  kontakt.status = neuerStatus;
  kontakt.letzte_aktion_am = heute();
  if (notiz) {
    kontakt.notizen = [kontakt.notizen, `${heute()}: ${notiz}`].filter(Boolean).join(" | ");
  }

  // Naechsten Faelligkeitstermin aus der Sequenz setzen
  const folgeschritt = naechsterSchritt(kontakt, config);
  if (folgeschritt) {
    kontakt.naechste_aktion_am = plusTage(heute(), folgeschritt.wartetage);
  } else if (STATUS[neuerStatus].aktiv) {
    // Sequenz durchlaufen
    kontakt.status = "pause";
    kontakt.naechste_aktion_am = "";
  } else {
    kontakt.naechste_aktion_am = "";
  }

  if (GESPERRTE_STATUS.has(neuerStatus)) {
    const grund = `${neuerStatus}${notiz ? `: ${notiz}` : ""}`;
    if (kontakt.domain) ergaenzeSperrliste(kontakt.domain, "domain", grund);
    if (kontakt.email) ergaenzeSperrliste(kontakt.email, "email", grund);
    if (neuerStatus === "opt_out") kontakt.notizen = [kontakt.notizen, `Widerspruch am ${heute()}`].filter(Boolean).join(" | ");
  }

  speichereKontakte(alle);
  protokolliere(kontakt, vorher, kontakt.status, notiz);

  console.log(`${kontakt.firma}: ${vorher} -> ${kontakt.status}`);
  if (kontakt.naechste_aktion_am) {
    const naechster = naechsterSchritt(kontakt, config);
    console.log(`Naechster Schritt: ${naechster?.schritt || "-"} am ${kontakt.naechste_aktion_am}`);
  } else {
    console.log("Keine weitere Aktion vorgesehen.");
  }
  if (GESPERRTE_STATUS.has(neuerStatus)) {
    console.log("Auf die Sperrliste gesetzt -- kuenftige Importe ueberspringen diesen Kontakt.");
  }
}
