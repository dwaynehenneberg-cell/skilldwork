/**
 * Claude-Anbindung des Toolkits.
 *
 * Zwei getrennte Schritte, bewusst nicht in einem Aufruf zusammengelegt:
 *
 *   recherchiereUnternehmen()  Liest die Website des Unternehmens und sucht bei
 *                              Bedarf nach dem Ansprechpartner. Ergebnis ist ein
 *                              kurzer Steckbrief in Textform.
 *   entwirfErstkontakt()       Schreibt aus dem Steckbrief die Erstkontakt-Mail,
 *                              die Follow-up-Mail und den Telefoneinstieg.
 *                              Ergebnis ist strukturiertes JSON.
 *
 * Der Schnitt lohnt sich, weil Recherche langsam und netzabhaengig ist, das
 * Texten aber schnell und wiederholbar -- wenn du deine Positionierung aenderst,
 * laeuft nur der zweite Schritt neu.
 */

import Anthropic from "@anthropic-ai/sdk";

/** @param {{claude?: {modell?: string}}} config */
export function modellVon(config) {
  return config.claude?.modell || "claude-opus-5";
}

/** @param {{claude?: {effort?: string}}} config */
export function effortVon(config) {
  return config.claude?.effort || "medium";
}

export function erstelleClient() {
  // Der Client liest ANTHROPIC_API_KEY aus der Umgebung, alternativ das per
  // `ant auth login` hinterlegte Profil. Kein Schluessel im Quelltext.
  return new Anthropic({ maxRetries: 4 });
}

/** Liefert den letzten Textblock einer Antwort. */
function textAus(antwort) {
  const bloecke = antwort.content.filter((b) => b.type === "text");
  return bloecke.length ? bloecke[bloecke.length - 1].text : "";
}

/**
 * Fuehrt einen Aufruf mit serverseitigen Werkzeugen aus und setzt ihn fort,
 * solange die API mit `pause_turn` pausiert (passiert bei laengeren Such- und
 * Abrufketten).
 */
async function mitFortsetzung(client, anfrage, maxFortsetzungen = 5) {
  let nachrichten = anfrage.messages;
  let antwort = await client.messages.create({ ...anfrage, messages: nachrichten });

  for (let i = 0; i < maxFortsetzungen && antwort.stop_reason === "pause_turn"; i += 1) {
    nachrichten = [...nachrichten, { role: "assistant", content: antwort.content }];
    antwort = await client.messages.create({ ...anfrage, messages: nachrichten });
  }

  return antwort;
}

// ------------------------------------------------------------------ Recherche

const SYSTEM_RECHERCHE = `Du recherchierst Unternehmen fuer eine Erstansprache und schreibst einen kurzen Steckbrief.

Arbeitsweise:
- Rufe die angegebene Website ab. Wenn kein Impressum oder keine Leistungsseite verlinkt ist, suche gezielt danach.
- Suche nach dem Namen der inhaberfuehrenden Person, wenn er nicht auf der Startseite steht.
- Halte dich an das, was tatsaechlich auf den Seiten steht. Rate nichts dazu. Was du nicht findest, markierst du als "unbekannt".

Der Steckbrief hat genau diese Abschnitte, jeweils in wenigen Saetzen:

LEISTUNG: Was verkauft dieses Unternehmen konkret? Nenne die Leistungen so, wie sie selbst benannt werden.
WIEDERKEHREND: Welcher Auftragstyp wiederholt sich hier vermutlich in aehnlicher Form? Begruende aus dem, was auf der Seite steht.
ERGEBNIS: Was bekommt ein Kunde am Ende in die Hand? Ist das digital uebergebbar (Dokument, Analyse, Konzept, Auswertung) oder rein vor Ort?
GROESSE: Anhaltspunkte zur Teamgroesse und wer entscheidet.
ANSPRECHPARTNER: Name und Rolle, falls auffindbar, sonst "unbekannt".
KONTAKT: Mailadresse und Telefonnummer aus Impressum oder Kontaktseite, sonst "unbekannt".
BELEG: Ein konkretes, nachpruefbares Detail von der Seite, auf das man sich in einer Mail beziehen kann. Ein woertliches Zitat oder eine benannte Leistung. Kein Kompliment, keine Allgemeinplaetze.
UNSICHER: Was du nicht klaeren konntest.`;

/**
 * @param {Anthropic} client
 * @param {Record<string,string>} kontakt
 * @param {object} config
 * @returns {Promise<{steckbrief: string, verbrauch: object}>}
 */
export async function recherchiereUnternehmen(client, kontakt, config) {
  const zeilen = [
    `Firma: ${kontakt.firma || "unbekannt"}`,
    kontakt.website ? `Website: ${kontakt.website}` : null,
    kontakt.ort ? `Ort: ${kontakt.ort}` : null,
    kontakt.branche ? `Branche laut Quelle: ${kontakt.branche}` : null,
    kontakt.telefon ? `Telefon laut Quelle: ${kontakt.telefon}` : null,
    kontakt.email ? `Mail laut Quelle: ${kontakt.email}` : null,
  ].filter(Boolean);

  const antwort = await mitFortsetzung(client, {
    model: modellVon(config),
    max_tokens: 16000,
    output_config: { effort: effortVon(config) },
    system: SYSTEM_RECHERCHE,
    tools: [
      { type: "web_fetch_20260209", name: "web_fetch", max_uses: 6 },
      { type: "web_search_20260209", name: "web_search", max_uses: 4 },
    ],
    messages: [
      {
        role: "user",
        content: `Recherchiere dieses Unternehmen und schreibe den Steckbrief.\n\n${zeilen.join("\n")}`,
      },
    ],
  });

  if (antwort.stop_reason === "refusal") {
    throw new Error("Anfrage wurde abgelehnt (stop_reason: refusal).");
  }

  return { steckbrief: textAus(antwort).trim(), verbrauch: antwort.usage };
}

// -------------------------------------------------------------------- Entwurf

/**
 * Der Systemprompt ist fuer alle Kontakte identisch und wird deshalb
 * zwischengespeichert (prompt caching): ab dem zweiten Kontakt kostet dieser
 * Teil nur noch rund ein Zehntel.
 */
function systemEntwurf(config) {
  const a = config.angebot || {};
  const z = config.zielgruppe || {};
  const abs = config.absender || {};

  return `Du schreibst die Erstansprache fuer Skilldwork an Dienstleister und Freelancer im deutschsprachigen Raum.

WAS SKILLDWORK IST
${a.einzeiler || ""}

Was der Kunde davon hat:
${(a.ergebnis_fuer_kunden || []).map((p) => `- ${p}`).join("\n")}

ZIEL DES ERSTKONTAKTS
Ein Telefonat oder Videocall von rund 15 Minuten. Inhalt des Calls: ${a.call_zweck || ""}
${a.kein_pitch_regel || ""}
Der Call ist der einzige Handlungsaufruf. Kein Angebot, kein Preis, kein Anhang, keine zweite Bitte.

ZIELGRUPPE
${z.beschreibung || ""}

Passt:
${(z.passt || []).map((p) => `- ${p}`).join("\n")}

Passt nicht:
${(z.passt_nicht || []).map((p) => `- ${p}`).join("\n")}

DIE ANREDE
Schreibe eine namentliche Anrede nur, wenn der Steckbrief die Ansprache belegt -- also wenn dort "Frau Dr. Marx" oder "Herr Ottens" so steht, wie es auf der Website steht. Leite das Geschlecht niemals aus einem Vornamen ab. Sobald du unsicher bist, lautet die Anrede genau "Guten Tag,". Eine falsche Anrede kostet mehr als eine neutrale.

WIE DIE MAIL KLINGT
- Deutsch, Sie-Form, 90 bis 130 Woerter im Fliesstext. Kein Betreff mit Ausrufezeichen, keine Emojis, keine Grossbuchstabenwoerter.
- Satz eins bezieht sich auf ein nachpruefbares Detail des Unternehmens aus dem Steckbrief. Kein Lob ("tolle Website"), sondern eine Beobachtung zur Arbeitsweise.
- Satz zwei bis drei: was Skilldwork macht, in der Sprache des Gegenuebers, bezogen auf dessen Auftragstyp. Nicht die Produktbeschreibung wiederholen.
- Danach die Bitte um 15 Minuten, ausdruecklich um deren Ablauf zu verstehen. Formuliere sie als Frage, nicht als Terminvorschlag mit Uhrzeit.
- Keine Behauptungen ueber Zahlen, Ersparnis oder Ergebnisse, die du nicht belegen kannst. Keine erfundenen Referenzen.
- Kein "ich hoffe, es geht Ihnen gut", kein "kurz zu mir", kein "wir sind ein innovatives Startup".

DER TELEFONEINSTIEG
Maximal 30 Sekunden vorgelesen. Wer du bist, warum genau dieses Unternehmen, und eine offene Frage zu deren Ablauf. Keine Produktvorstellung am Telefon, bevor die Person nicht gefragt hat.

RELEVANZ UND AUSSCHLUSS
Bewerte ehrlich, nicht wohlwollend. Score 5 nur, wenn der wiederkehrende Auftragstyp und das digital uebergebbare Ergebnis beide klar aus dem Steckbrief hervorgehen.
Die Begruendung muss ein nachpruefbarer Sachgrund sein, warum ausgerechnet dieses Unternehmen an diesem Angebot Interesse haben duerfte -- abgeleitet aus dessen Taetigkeit, nicht aus Vermutungen. Findest du keinen solchen Sachgrund, laesst du das Feld leer. Ein leeres Feld verhindert spaeter den Anruf; das ist so gewollt.
Traegt das Unternehmen ein Ausschlusskriterium, benenne es in ausschluss_grund und setze den Score auf 1.

ABSENDER
${abs.name || ""}${abs.rolle ? `, ${abs.rolle}` : ""}
Die Signatur setzt das Programm selbst ein. Schreibe sie nicht mit und beende den Mailtext nach der Gruss-Zeile.`;
}

/** JSON-Schema der Entwuerfe. Die API erzwingt diese Form. */
const ENTWURF_SCHEMA = {
  type: "object",
  properties: {
    relevanz_score: {
      type: "integer",
      enum: [1, 2, 3, 4, 5],
      description: "5 = klarer Treffer, 1 = passt nicht",
    },
    relevanz_begruendung: {
      type: "string",
      description:
        "Nachpruefbarer Sachgrund, warum dieses Unternehmen Interesse haben duerfte. Leer lassen, wenn kein solcher Grund belegbar ist.",
    },
    ausschluss_grund: {
      type: "string",
      description: "Ausschlusskriterium, falls eines zutrifft. Sonst leer.",
    },
    hook: {
      type: "string",
      description: "Das konkrete Detail des Unternehmens, auf das sich die Ansprache bezieht. Ein Satz.",
    },
    anrede: {
      type: "string",
      description:
        "Vollstaendige Anredezeile inklusive Komma, etwa 'Guten Tag Frau Dr. Marx,'. Nur mit Namen, wenn die Ansprache auf der Website belegt ist. Sonst genau 'Guten Tag,'.",
    },
    mail_betreff: { type: "string", description: "Betreff der ersten Mail, hoechstens 60 Zeichen" },
    mail_text: { type: "string", description: "Text der ersten Mail ohne Signatur" },
    mail2_betreff: { type: "string", description: "Betreff der Follow-up-Mail" },
    mail2_text: {
      type: "string",
      description:
        "Follow-up-Mail: ein konkreter Impuls zum Ablauf des Unternehmens, dann erneut die Bitte um den Call. Kuerzer als die erste Mail.",
    },
    call_opener: { type: "string", description: "Telefoneinstieg, hoechstens 30 Sekunden gesprochen" },
    call_frage: { type: "string", description: "Die eine offene Frage zum Ablauf, mit der das Gespraech aufgeht" },
  },
  required: [
    "relevanz_score",
    "relevanz_begruendung",
    "ausschluss_grund",
    "hook",
    "anrede",
    "mail_betreff",
    "mail_text",
    "mail2_betreff",
    "mail2_text",
    "call_opener",
    "call_frage",
  ],
  additionalProperties: false,
};

/**
 * @param {Anthropic} client
 * @param {Record<string,string>} kontakt
 * @param {string} steckbrief
 * @param {object} config
 * @returns {Promise<{entwurf: object, verbrauch: object}>}
 */
export async function entwirfErstkontakt(client, kontakt, steckbrief, config) {
  const antwort = await client.messages.create({
    model: modellVon(config),
    max_tokens: 8000,
    output_config: {
      effort: effortVon(config),
      format: { type: "json_schema", schema: ENTWURF_SCHEMA },
    },
    system: [
      {
        type: "text",
        text: systemEntwurf(config),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          `Firma: ${kontakt.firma}`,
          kontakt.ort ? `Ort: ${kontakt.ort}` : null,
          kontakt.ansprechpartner ? `Ansprechpartner: ${kontakt.ansprechpartner}` : "Ansprechpartner: unbekannt",
          "",
          "Steckbrief aus der Recherche:",
          steckbrief,
        ]
          .filter((z) => z !== null)
          .join("\n"),
      },
    ],
  });

  if (antwort.stop_reason === "refusal") {
    throw new Error("Anfrage wurde abgelehnt (stop_reason: refusal).");
  }
  if (antwort.stop_reason === "max_tokens") {
    throw new Error("Antwort wurde abgeschnitten (max_tokens). max_tokens erhoehen.");
  }

  const roh = textAus(antwort);
  let entwurf;
  try {
    entwurf = JSON.parse(roh);
  } catch {
    throw new Error(`Antwort war kein gueltiges JSON: ${roh.slice(0, 200)}`);
  }

  return { entwurf, verbrauch: antwort.usage };
}

/**
 * Rechnet den Verbrauch eines Aufrufs in Euro um.
 * Listenpreise Claude Opus 5, Stand der Erstellung: 5 USD je Mio. Eingabe-Token,
 * 25 USD je Mio. Ausgabe-Token, Cache-Lesevorgaenge etwa ein Zehntel der Eingabe.
 * Kurs grob mit 0.92 angesetzt -- das hier ist eine Groessenordnung, keine Abrechnung.
 */
export function schaetzeKosten(verbrauch) {
  if (!verbrauch) return 0;
  const eingabe = (verbrauch.input_tokens || 0) / 1e6 * 5;
  const cacheSchreiben = (verbrauch.cache_creation_input_tokens || 0) / 1e6 * 6.25;
  const cacheLesen = (verbrauch.cache_read_input_tokens || 0) / 1e6 * 0.5;
  const ausgabe = (verbrauch.output_tokens || 0) / 1e6 * 25;
  return (eingabe + cacheSchreiben + cacheLesen + ausgabe) * 0.92;
}
