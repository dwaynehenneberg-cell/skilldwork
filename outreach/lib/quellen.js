/**
 * Kandidatensuche ueber OpenStreetMap (Overpass API).
 *
 * OSM ist als Startpunkt gut geeignet: frei nutzbar, deckt ortsgebundene
 * Dienstleister ordentlich ab und liefert oft schon Website, Telefon und
 * Adresse. Reine Online-Freelancer stehen dort in der Regel nicht -- fuer die
 * siehe outreach/docs/quellen.md.
 *
 * Lizenz: OpenStreetMap-Daten stehen unter ODbL. Bei jeder Weitergabe der Daten
 * ist "© OpenStreetMap-Mitwirkende" anzugeben. Das Toolkit schreibt die Herkunft
 * deshalb in jede Zeile (Spalte `datenherkunft`).
 */

const ENDPUNKTE = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

/**
 * Branchenkuerzel auf OSM-Tags. Mehrere Tags werden als Vereinigung gesucht.
 * Eigene Tags gehen jederzeit ueber `--tag key=value`.
 */
export const BRANCHEN = {
  steuerberater: ["office=tax_advisor"],
  rechtsanwalt: ["office=lawyer"],
  unternehmensberatung: ["office=consulting"],
  werbeagentur: ["office=advertising_agency"],
  architekt: ["office=architect"],
  ingenieurbuero: ["office=engineer"],
  it: ["office=it", "office=telecommunication"],
  immobilien: ["office=estate_agent"],
  versicherung: ["office=insurance"],
  finanzberatung: ["office=financial_advisor", "office=financial"],
  grafik: ["office=graphic_design"],
  fotograf: ["craft=photographer", "shop=photo"],
  uebersetzer: ["office=translator", "craft=translator"],
  personalvermittlung: ["office=employment_agency"],
  energieberatung: ["office=energy_supplier", "craft=energy_consultant"],
  handwerk: ["craft=carpenter", "craft=electrician", "craft=plumber", "craft=painter"],
  physiotherapie: ["healthcare=physiotherapist"],
  coaching: ["office=educational_institution", "amenity=training"],
};

/**
 * Baut die Overpass-Abfrage.
 * @param {{ort: string, tags: string[], timeout?: number}} p
 * @returns {string}
 */
export function baueAbfrage({ ort, tags, timeout = 90 }) {
  const sicher = String(ort).replace(/["\\]/g, "");
  const teile = tags
    .map((tag) => {
      const [key, wert] = tag.split("=");
      const filter = wert ? `["${key}"="${wert}"]` : `["${key}"]`;
      return `  nwr${filter}(area.suchgebiet);`;
    })
    .join("\n");

  return [
    `[out:json][timeout:${timeout}];`,
    `area["name"="${sicher}"]["boundary"="administrative"]->.suchgebiet;`,
    "(",
    teile,
    ");",
    "out center tags;",
  ].join("\n");
}

/** Erste vorhandene Eigenschaft aus einer Liste von Schluesseln. */
function ersterWert(tags, schluessel) {
  for (const s of schluessel) {
    if (tags[s]) return String(tags[s]).trim();
  }
  return "";
}

/**
 * Uebersetzt ein Overpass-Element in die Kontaktfelder des Toolkits.
 * @param {any} element
 * @param {{branche: string, ort: string}} kontext
 */
export function alsKontakt(element, kontext) {
  const tags = element.tags || {};
  const firma = ersterWert(tags, ["name", "operator", "brand"]);
  if (!firma) return null;

  return {
    firma,
    website: ersterWert(tags, ["website", "contact:website", "url"]),
    telefon: ersterWert(tags, ["phone", "contact:phone", "contact:mobile"]),
    email: ersterWert(tags, ["email", "contact:email"]),
    ort: ersterWert(tags, ["addr:city"]) || kontext.ort,
    plz: ersterWert(tags, ["addr:postcode"]),
    land: ersterWert(tags, ["addr:country"]) || "DE",
    branche: kontext.branche,
    quelle: `openstreetmap:${element.type}/${element.id}`,
    datenherkunft: `OpenStreetMap (ODbL), abgerufen ${new Date().toISOString().slice(0, 10)}`,
  };
}

/**
 * Fragt Overpass ab und liefert Kontaktrohdaten.
 * @param {{ort: string, tags: string[], branche: string}} p
 * @returns {Promise<Record<string,string>[]>}
 */
export async function sucheKandidaten({ ort, tags, branche }) {
  const abfrage = baueAbfrage({ ort, tags });
  let letzterFehler;

  for (const endpunkt of ENDPUNKTE) {
    try {
      const antwort = await fetch(endpunkt, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "skilldwork-outreach/1.0 (Kandidatenrecherche)",
        },
        body: new URLSearchParams({ data: abfrage }).toString(),
      });

      if (!antwort.ok) {
        letzterFehler = new Error(`${endpunkt} antwortete mit ${antwort.status}`);
        continue;
      }

      const daten = await antwort.json();
      const elemente = Array.isArray(daten.elements) ? daten.elements : [];
      return elemente
        .map((element) => alsKontakt(element, { branche, ort }))
        .filter(Boolean);
    } catch (fehler) {
      letzterFehler = fehler;
    }
  }

  throw new Error(
    `Overpass nicht erreichbar. Letzter Fehler: ${letzterFehler?.message || "unbekannt"}`
  );
}
