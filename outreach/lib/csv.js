/**
 * Minimaler, korrekter CSV-Leser/Schreiber (RFC 4180).
 * Bewusst ohne Abhaengigkeit, damit das Toolkit nur ein einziges npm-Paket braucht.
 *
 * Unterstuetzt: Anfuehrungszeichen, doppelte Anfuehrungszeichen als Escape,
 * Zeilenumbrueche innerhalb von Feldern, CRLF und LF.
 */

/**
 * Zerlegt CSV-Text in ein Array von Zeilen (jede Zeile ein Array von Feldern).
 * @param {string} text
 * @returns {string[][]}
 */
export function parseRows(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  // BOM entfernen (Excel schreibt gern eins an den Anfang)
  if (text.charCodeAt(0) === 0xfeff) i = 1;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }

    if (ch === "\r") {
      i += 1;
      continue;
    }

    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }

    field += ch;
    i += 1;
  }

  // Letzte Zeile, falls die Datei ohne Zeilenumbruch endet
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * Liest CSV mit Kopfzeile in ein Array von Objekten.
 * @param {string} text
 * @returns {{ header: string[], rows: Record<string,string>[] }}
 */
export function parseCsv(text) {
  const raw = parseRows(text).filter(
    (r) => !(r.length === 1 && r[0].trim() === "")
  );
  if (raw.length === 0) return { header: [], rows: [] };

  const header = raw[0].map((h) => h.trim());
  const rows = raw.slice(1).map((cells) => {
    const obj = {};
    header.forEach((key, idx) => {
      obj[key] = (cells[idx] ?? "").trim();
    });
    return obj;
  });

  return { header, rows };
}

/**
 * Escaped ein einzelnes Feld.
 * @param {unknown} value
 * @returns {string}
 */
function escapeField(value) {
  const str = value === undefined || value === null ? "" : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Schreibt Objekte als CSV. Die Spaltenreihenfolge kommt aus `header`.
 * @param {string[]} header
 * @param {Record<string, unknown>[]} rows
 * @returns {string}
 */
export function toCsv(header, rows) {
  const lines = [header.map(escapeField).join(",")];
  for (const row of rows) {
    lines.push(header.map((key) => escapeField(row[key])).join(","));
  }
  return lines.join("\n") + "\n";
}
