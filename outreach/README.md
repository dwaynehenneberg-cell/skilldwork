# Skilldwork Outreach

Werkzeug, um Dienstleister und Freelancer zu finden, sie einzeln recherchiert anzuschreiben
und die Anrufe vorzubereiten. Ziel jedes Erstkontakts ist **ein Gespräch von 15 Minuten
über den Ablauf des Angeschriebenen** — nicht der Verkauf.

Automatisiert werden Auswahl, Recherche, Texten und Nachhalten. Den Versand und die Anrufe
machst du selbst; warum, steht unten unter [Was bewusst nicht automatisiert ist](#was-bewusst-nicht-automatisiert-ist).

## Einrichten

```bash
cd outreach
npm install
cp config.example.json config.json     # Absenderdaten, Impressum, Angebot eintragen
export ANTHROPIC_API_KEY=sk-ant-...    # für recherche und entwurf
```

`config.json` und alle Daten unter `data/` sind von der Versionsverwaltung ausgenommen.

**Vor dem ersten Versand lesen:** [`docs/recht.md`](docs/recht.md). Kaltakquise per Mail und
Telefon ist in Deutschland einwilligungsbedürftig, und das Werkzeug ist um diese Regeln
herum gebaut.

## Der Ablauf

```
sammeln / import  →  recherche  →  entwurf  →  heute  →  status  →  bericht
```

```bash
# 1. Kandidaten finden
node bin/outreach.js sammeln --ort Hamburg --branche steuerberater
node bin/outreach.js import --datei ~/Downloads/liste.csv --quelle "IHK-Verzeichnis"

# 2. Claude liest jede Website und schreibt einen Steckbrief
node bin/outreach.js recherche --limit 50

# 3. Claude schreibt Mails, Telefoneinstieg und bewertet die Relevanz
node bin/outreach.js entwurf --limit 50

# 4. Arbeitsplan für heute: fertige Mails zum Kopieren, Anrufliste mit Einstieg
node bin/outreach.js heute

# 5. Festhalten, was passiert ist
node bin/outreach.js status marx-partner-de mail1
node bin/outreach.js status marx-partner-de termin --notiz "Di 14:00"

# 6. Stand der Dinge
node bin/outreach.js bericht
```

Jedes Kommando kennt `--hilfe`. `recherche` und `entwurf` kennen `--trocken` — damit siehst
du, wer bearbeitet würde, ohne einen API-Aufruf auszulösen.

## Wo was liegt

| Pfad | Inhalt |
|---|---|
| `data/kontakte.csv` | Alle Kontakte. Die eine Wahrheit. In Excel oder Numbers zu öffnen. |
| `data/steckbriefe/<id>.md` | Was Claude über jedes Unternehmen herausgefunden hat |
| `data/sperrliste.csv` | Widersprüche und Absagen. Überlebt jeden Re-Import. |
| `data/verlauf.csv` | Protokoll aller Statuswechsel |
| `config.json` | Absender, Angebot, Zielgruppe, Tageslimits, Sequenztakt |
| `docs/recht.md` | UWG und DSGVO, und wie sie den Aufbau bestimmen |
| `docs/quellen.md` | Woher die Unternehmen kommen, plus Zustellbarkeit |
| `vorlagen/mail-sequenz.md` | Aufbau der Mails, Qualitätsprüfung vor dem Versand |
| `vorlagen/call-leitfaden.md` | Gesprächseinstieg, Einwände, Vorzimmer |

## Google Sheets oder Excel

```bash
node bin/outreach.js export --vorlage        # nur die Kopfzeile plus Beispielzeile
node bin/outreach.js export                  # alle Kontakte
node bin/outreach.js export --min-relevanz 4 # nur die starken Treffer
```

Die fertige Datei liegt in `export/`. In Google Sheets: *Datei → Importieren → Hochladen*,
Trennzeichen „Komma", Importort „Aktuelles Blatt ersetzen".

`vorlage-google-sheet.csv` im Projektordner ist dieselbe Vorlage, schon fertig zum Import.

## Kanäle

Die Spalte `kanal` steuert, ob ein Kontakt durch die Mail- und Anrufsequenz läuft:

- `mail` (Standard) und `telefon` — laufen durch die Sequenz
- alles andere, etwa `reddit` oder `linkedin` — erscheint **nicht** im Tagesplan

Kontakte aus Foren und Netzwerken brauchen eine Direktnachricht in der Sprache der Plattform,
und dort gelten deren Regeln. Eine Mailvorlage wäre in einer Reddit-DM ohnehin fehl am Platz.
Sie stehen trotzdem in derselben Datei, damit du einen Überblick behältst.

## Was das Toolkit dich zu tun zwingt

Zwei Stellen sind absichtlich unbequem:

**Kein Anruf ohne notierten Grund.** Steht in der Spalte `relevanz_begruendung` kein
nachprüfbarer Sachgrund, erscheint der Kontakt nicht auf der Anrufliste — er wandert unter
„nicht kontaktierbar" mit Begründung. Ein Werbeanruf bei einem Unternehmen setzt dessen
mutmaßliche Einwilligung voraus (§ 7 Abs. 2 Nr. 1 UWG), und die braucht konkrete
Anhaltspunkte. Fällt dir kein Grund ein, ist der Anruf der falsche Kanal.

**Ein Widerspruch ist endgültig.** `outreach status <id> opt_out` setzt Domain und
Mailadresse auf die Sperrliste. Die liegt getrennt von den Kontakten und überlebt es auch,
wenn `kontakte.csv` gelöscht und neu aufgebaut wird.

## Kosten

Pro Kontakt zwei Claude-Aufrufe: einmal Recherche mit Website-Abruf, einmal Texten.
Größenordnung **3 bis 8 Cent pro Kontakt**, also rund 10 bis 25 Euro für 300 Kontakte.

Zwei Dinge drücken das: Der Systemprompt beim Texten ist für alle Kontakte gleich und wird
zwischengespeichert, ab dem zweiten Kontakt kostet er noch etwa ein Zehntel. Und `effort`
steht in `config.json` auf `medium`. Nach jedem Durchlauf wird die geschätzte Summe
ausgegeben.

## Was bewusst nicht automatisiert ist

**Der Versand.** Das Werkzeug schreibt Mails, es verschickt sie nicht. 300 Mails über
`skilldwork.com` können die Zustellbarkeit deiner gesamten Geschäftskommunikation
beschädigen — der häufigste und teuerste Fehler bei Kaltakquise. Aus einem echten Postfach
verschickt, in kleinen Mengen, sieht deine Post für Spamfilter aus wie das, was sie sein
soll: persönlich. Siehe `docs/quellen.md`, Abschnitt Zustellbarkeit.

**Der Anruf.** Automatisierte Werbeanrufe sind in Deutschland unzulässig, und eine
synthetische Stimme zerstört genau das Vertrauen, das im Gespräch entstehen soll. Das
Werkzeug bereitet den Anruf vor — Einstieg, Frage, Einwände, Protokoll — und du führst ihn.

**Antworten.** Sobald jemand antwortet, endet die Sequenz. Ein Follow-up, das nach einer
Antwort weiterläuft, ist der schnellste Weg, einen Interessenten zu verlieren.

## Technisches

Eigenständiges Teilpaket mit eigenem `package.json` und eigenem `node_modules`, getrennt
von der Next.js-App im Projektstamm. Node 20 oder neuer. Einzige Abhängigkeit ist
`@anthropic-ai/sdk`; CSV-Verarbeitung und Ablaufsteuerung sind im Ordner selbst.
