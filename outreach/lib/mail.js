/**
 * Setzt die versandfertige Mail zusammen: Anrede, von Claude entworfener Text,
 * Signatur und Pflichtangaben.
 *
 * Die Pflichtangaben sind nicht optional und stehen deshalb hier im Code, nicht
 * im Prompt -- so kann kein Entwurf sie versehentlich weglassen:
 *
 *   - Impressumsangaben des Absenders
 *   - Herkunft der Daten und Hinweis auf das Widerspruchsrecht
 *     (Informationspflicht nach Art. 14 DSGVO, weil die Daten nicht beim
 *     Empfaenger selbst erhoben wurden)
 *   - Ein Weg, weitere Mails abzustellen
 *
 * Siehe outreach/docs/recht.md.
 */

/**
 * Die Anrede kommt aus dem Entwurf, weil nur dort bekannt ist, ob die Ansprache
 * auf der Website tatsaechlich belegt war. Aus einem Vornamen auf das Geschlecht
 * zu schliessen geht regelmaessig schief, deshalb ist die neutrale Anrede der
 * Standard, sobald etwas fehlt oder unplausibel aussieht.
 *
 * @param {Record<string,string>} kontakt
 * @returns {string}
 */
export function anrede(kontakt) {
  const entworfen = (kontakt.anrede || "").trim();
  if (!entworfen) return "Guten Tag,";
  if (!/^(guten tag|sehr geehrte)/i.test(entworfen)) return "Guten Tag,";
  if (/herr\s*\/\s*frau|frau\s*\/\s*herr/i.test(entworfen)) return "Guten Tag,";
  return entworfen;
}

/**
 * @param {object} config
 * @returns {string}
 */
export function signatur(config) {
  const a = config.absender || {};
  return [
    "Viele Gruesse",
    a.name,
    a.rolle,
    a.telefon ? `Tel. ${a.telefon}` : null,
    a.email,
    a.website,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * @param {Record<string,string>} kontakt
 * @param {object} config
 * @returns {string}
 */
export function pflichtangaben(kontakt, config) {
  const i = config.impressum || {};
  const a = config.absender || {};
  const herkunft = kontakt.datenherkunft || kontakt.quelle || "oeffentlich zugaengliche Quellen";

  return [
    "--",
    [i.firma, i.anschrift, i.vertreten_durch ? `Vertreten durch: ${i.vertreten_durch}` : null]
      .filter(Boolean)
      .join(" | "),
    "",
    `Ihre Kontaktdaten stammen aus: ${herkunft}. Wir schreiben Sie an, weil Ihr Taetigkeitsfeld ` +
      `zu unserem Angebot passt. Sie koennen der weiteren Nutzung Ihrer Daten jederzeit ` +
      `widersprechen -- eine formlose Antwort auf diese Mail an ${i.kontakt || a.email} genuegt, ` +
      `dann loeschen wir Ihre Daten und Sie hoeren nichts mehr von uns.`,
  ].join("\n");
}

/**
 * Baut die vollstaendige Mail fuer einen Sequenzschritt.
 * @param {Record<string,string>} kontakt
 * @param {object} config
 * @param {"mail1"|"mail2"|"mail3"} schritt
 * @returns {{betreff: string, text: string}}
 */
export function baueMail(kontakt, config, schritt) {
  let betreff;
  let koerper;

  if (schritt === "mail1") {
    betreff = kontakt.mail_betreff;
    koerper = kontakt.mail_text;
  } else if (schritt === "mail2") {
    betreff = kontakt.mail2_betreff || `Re: ${kontakt.mail_betreff}`;
    koerper = kontakt.mail2_text;
  } else {
    betreff = `Re: ${kontakt.mail_betreff}`;
    koerper = abschlussText(config);
  }

  const text = [anrede(kontakt), "", koerper, "", signatur(config), "", pflichtangaben(kontakt, config)].join("\n");

  return { betreff: betreff || "", text };
}

/**
 * Die Abschluss-Mail ist bewusst fuer alle gleich: kurz, ohne neuen Anlauf,
 * und sie macht das Nein leicht. Deshalb wird sie nicht pro Kontakt getextet.
 * @param {object} config
 */
export function abschlussText(config) {
  const a = config.angebot || {};
  return (
    `ich melde mich ein letztes Mal. Falls das Thema bei Ihnen gerade keine Rolle spielt, ` +
    `ist das voellig in Ordnung -- dann lasse ich Sie in Ruhe.\n\n` +
    `Sollte sich das aendern: ${a.call_zweck || "Ein kurzes Gespraech ueber Ihren Ablauf steht jederzeit offen."} ` +
    `Eine Zeile an mich genuegt.`
  );
}
