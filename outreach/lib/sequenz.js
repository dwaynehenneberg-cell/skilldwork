/**
 * Die Kontaktsequenz: welcher Schritt folgt auf welchen, und wie viele Tage
 * spaeter. Die Tageswerte kommen aus config.sequenz, damit du den Takt aendern
 * kannst, ohne Code anzufassen.
 */

/** Reihenfolge der Schritte. Nach dem letzten ist Schluss. */
export const SCHRITTE = ["mail1", "anruf1", "mail2", "anruf2", "mail3"];

/** Auf welchen Status folgt welcher Schritt. */
const NACH_STATUS = {
  entwurf: "mail1",
  mail1: "anruf1",
  anruf1: "mail2",
  mail2: "anruf2",
  anruf2: "mail3",
  mail3: null, // danach: pause
};

/**
 * @param {object} config
 * @returns {Record<string, {kanal: string, wartetage: number, zweck: string}>}
 */
export function sequenzPlan(config) {
  const eintraege = config.sequenz || [];
  const plan = {};

  eintraege.forEach((eintrag, i) => {
    const vorher = i === 0 ? 0 : Number(eintraege[i - 1].tag || 0);
    plan[eintrag.schritt] = {
      kanal: eintrag.kanal,
      wartetage: Math.max(0, Number(eintrag.tag || 0) - vorher),
      zweck: eintrag.zweck || "",
    };
  });

  return plan;
}

/**
 * Welcher Schritt steht fuer diesen Kontakt als naechstes an?
 * @param {Record<string,string>} kontakt
 * @param {object} config
 * @returns {{schritt: string, kanal: string, wartetage: number, zweck: string} | null}
 */
export function naechsterSchritt(kontakt, config) {
  const schritt = NACH_STATUS[kontakt.status];
  if (!schritt) return null;

  const plan = sequenzPlan(config);
  const eintrag = plan[schritt];
  if (!eintrag) return null;

  return { schritt, ...eintrag };
}

/**
 * Darf dieser Kontakt angerufen werden?
 *
 * Zwei Bedingungen, beide hart:
 *   1. Es gibt eine Telefonnummer.
 *   2. Es ist dokumentiert, warum ausgerechnet dieses Unternehmen an diesem
 *      Angebot Interesse haben duerfte.
 *
 * Punkt 2 ist der Grund, warum das Feld ueberhaupt existiert: ein Werbeanruf bei
 * einem Unternehmen setzt nach § 7 Abs. 2 Nr. 1 UWG dessen mutmassliche
 * Einwilligung voraus, und die muss sich aus konkreten Anhaltspunkten ergeben.
 * Ohne notierten Sachgrund landet der Kontakt hier nicht auf der Anrufliste.
 *
 * @param {Record<string,string>} kontakt
 * @returns {{erlaubt: boolean, grund?: string}}
 */
export function darfAngerufenWerden(kontakt) {
  if (!kontakt.telefon) {
    return { erlaubt: false, grund: "keine Telefonnummer hinterlegt" };
  }
  if (!kontakt.relevanz_begruendung || kontakt.relevanz_begruendung.trim().length < 20) {
    return {
      erlaubt: false,
      grund: "kein dokumentierter Sachgrund fuer die Kontaktaufnahme (Feld relevanz_begruendung)",
    };
  }
  return { erlaubt: true };
}
