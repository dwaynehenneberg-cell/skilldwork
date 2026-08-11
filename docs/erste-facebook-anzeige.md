# Die erste Facebook-Anzeige

Eine Schritt-für-Schritt-Anleitung für die erste Kampagne, geschrieben für
jemanden, der noch nie eine Anzeige geschaltet hat. Der strategische Rahmen
steht in `meta-ads-playbook.md`; hier geht es um die konkrete Reihenfolge und um
die Anzeige selbst.

Zielseite ist die deutsche Landing Page `skilldwork.com/de`.

## Teil 1 — Eine Anzeige, die nicht nach KI aussieht

### Die Verräter

Facebook-Feeds sind 2026 voll mit generierten Anzeigen, und die Zielgruppe
erkennt sie in einer halben Sekunde. Die Muster:

- **Dreierfiguren.** „Schneller, einfacher, planbarer." Drei parallele Adjektive
  sind das häufigste Erkennungszeichen.
- **Keine Spezifika.** Kein Name, keine Zahl, kein Ort, kein Datum. Der Text
  würde für jede Firma der Branche funktionieren.
- **Keine Meinung.** Nichts, dem jemand widersprechen könnte.
- **Rhetorische Fragen** als Einstieg: „Kennst du das Gefühl, wenn …?"
- **Emoji-Bullets** und Absätze exakt gleicher Länge.
- **Bilder** mit zu glattem Licht, symmetrischen Gesichtern, generischen
  Laptop-Schreibtisch-Szenen.

### Was stattdessen funktioniert

Ein Detail, das nur der Absender wissen kann. Eine krumme Zahl (17 Kunden, nicht
„über 15"). Ein Satz, der mit „Und" anfängt. Eine Behauptung mit Kante. Ein
echtes Gesicht.

### Das Format für die erste Anzeige

Ein Video mit dem Handy, 25–35 Sekunden, ein Take, gesprochen statt abgelesen.
Gründe: ein echtes Gesicht ist derzeit das Einzige, was nicht nach KI aussehen
kann; es kostet nichts; und beim lauten Sprechen fallen die falschen Sätze von
selbst auf.

Praktisch: Handy quer auf einen Bücherstapel, Fenster seitlich statt im Rücken,
zweiter oder dritter Take. Der erste ist steif, der fünfte klingt auswendig
gelernt.

### Der Skript-Rahmen

| Sekunde | Was passiert |
| --- | --- |
| 0–3 | Eine Aussage, die die Zielgruppe sofort als ihr Problem erkennt. Kein „Hallo, ich bin …" |
| 3–10 | Der konkrete Moment. Eine Szene, keine Kategorie. |
| 10–25 | Was Skilldwork macht, in einem Satz, so wie man es einem Freund erklärt |
| 25–32 | Was nach dem Klick passiert. Ehrlich und klein. |

### Rohentwurf

Die eckigen Klammern sind die Stellen, an denen die Anzeige echt wird — sie
brauchen einen realen Fall, keine erfundenen Zahlen.

> Wenn du deinen Dienst zum zwanzigsten Mal auf genau die gleiche Weise
> ausgeführt hast, hast du kein Marketingproblem. Du hast ein Lieferproblem.
>
> Ich hab mit einem [Beruf] gearbeitet, der [konkrete Aufgabe] gemacht hat. Jedes
> Mal die gleichen vier Mails, die gleiche Rückfrage, das gleiche Dokument. [X]
> Stunden pro Kunde, davon vielleicht eine, in der er wirklich etwas entschieden
> hat.
>
> Wir haben das einmal auseinandergenommen und als Workflow gebaut.
> Verkaufsseite, Onboarding, Ausführung, Korrekturschleife. Er trifft weiter die
> Entscheidungen, die nur er treffen kann. Der Rest läuft.
>
> Wenn du sowas hast — einen Dienst, den du dauernd wiederholst — lass uns eine
> halbe Stunde drüber reden. Kein Pitch, ich will nur sehen, ob's überhaupt geht.

Keine Dreierfigur, kein Superlativ, ein Satz beginnt mit „Und". „Du hast ein
Lieferproblem" ist eine Behauptung, der man widersprechen kann — genau das ist
der Punkt.

### Der Begleittext

Der Primärtext über dem Video wird auf dem Handy nach etwa zwei Zeilen
abgeschnitten. Die erste Zeile muss also allein stehen können:

> Der Teil deiner Arbeit, den du zum zwanzigsten Mal gleich machst, ist der Teil,
> der nicht mehr von dir kommen muss.
>
> Wir bauen daraus einen digitalen Workflow: Verkaufsseite, Onboarding,
> Ausführung, Korrekturen. Du behältst Marketing und die Entscheidungen, die
> Erfahrung brauchen.
>
> 30 Minuten, ein Dienst, kein Pitch.

**Überschrift:** Ein Dienst, der ohne dich läuft
**Button:** Termin buchen

## Teil 2 — Einrichtung, in dieser Reihenfolge

Vor der ersten Anzeige. Die Schritte 3 und 4 sind der häufigste Grund, warum
eine Kampagne scheinbar null Conversions bringt.

1. **Meta Business Suite** unter business.facebook.com anlegen, falls noch nicht
   vorhanden. Ein Business-Portfolio, darin die Facebook-Seite und ein
   Werbekonto.
2. **Pixel anlegen:** Events Manager → Datenquellen → Pixel erstellen. Die ID ist
   eine lange Zahl. Sie kommt in Vercel als `NEXT_PUBLIC_META_PIXEL_ID`, danach
   neu deployen — die Variable wird beim Build eingebacken.
3. **Domain verifizieren:** Business-Einstellungen → Markensicherheit → Domains →
   `skilldwork.com` per DNS-Eintrag bestätigen.
4. **Aggregated Event Measurement:** Events Manager → Gesamtwirkung von Events
   konfigurieren. Reihenfolge: `Schedule` an Position 1, `ViewContent` an 2,
   `PageView` an 3. Für iOS-Nutzer, die Tracking abgelehnt haben, wird nur das
   oberste Event gemeldet.
5. **Zahlungsmethode** im Werbekonto hinterlegen.
6. **Testen:** Meta Pixel Helper installieren, `skilldwork.com/de` öffnen,
   Messung erlauben → `PageView`. Kalender öffnen → `ViewContent`. Testtermin
   buchen → `Schedule` in den Testereignissen prüfen, danach Termin absagen.

Erst wenn Schritt 6 durchläuft, lohnt sich Budget.

## Teil 3 — Die Kampagne anlegen

Werbeanzeigenmanager → Erstellen.

**Kampagnenebene**

- Ziel: **Umsatz** (heißt je nach Kontoversion auch „Conversions")
- Kampagnenname: `meta-conv-de-01`
- Advantage+ Kampagnenbudget: aus. Budget lieber auf Anzeigengruppenebene.

**Anzeigengruppe**

- Conversion-Ereignis: **`Schedule`** — nicht `Lead`, die Seite feuert für Meta
  kein `Lead`
- Budget: 20 € pro Tag, Laufzeit mindestens 14 Tage
- Standorte: Deutschland, Österreich, Schweiz
- Alter: 25–55
- Detailliertes Targeting: leer lassen (Advantage+ Zielgruppe). Bei einer
  deutschen Anzeige mit klarer Ansprache erledigt das Video die Auswahl besser
  als eine Interessenliste.
- Platzierungen: Advantage+ Platzierungen, nicht manuell auswählen
- Attribution: 7 Tage Klick, 1 Tag Aufruf

**Anzeige**

- Format: Einzelbild oder Video → das Vertikalvideo hochladen (9:16, für Reels
  und Stories)
- Primärtext, Überschrift, Button: siehe oben
- Website-URL:
  `https://skilldwork.com/de?utm_source=facebook&utm_medium=paid_social&utm_campaign=meta-conv-de-01&utm_content=lieferproblem-video-a`
- URL-Parameter automatisch anhängen: aus (die UTMs stehen schon in der URL)

Zwei Anzeigen in derselben Anzeigengruppe, nicht in zwei Gruppen — sonst
konkurrieren sie um dasselbe Budget und keine der beiden lernt.

## Teil 4 — Die ersten zwei Wochen

- **Tag 1–7: nichts anfassen.** Jede Änderung an einer Anzeigengruppe startet die
  Lernphase neu und wirft weg, was sie gelernt hat. Das ist der teuerste
  Anfängerfehler.
- **Tag 7:** Link-CTR ansehen. Unter 0,8 % ist das Creative das Problem, nicht die
  Zielgruppe. Neues Video, gleiche Anzeigengruppe.
- **Tag 14:** Kosten pro gebuchtem Termin gegen den vorher festgelegten Zielwert
  halten. Zielwert = Abschlussquote × Auftragswert × akzeptable Amortisation.
- **Laufend:** Kommentare beantworten. Und die Zahl der Calendly-Buchungen mit
  `utm_medium=paid_social` gegen die von Meta gemeldeten `Schedule`-Events
  halten. Meta meldet durch iOS und Consent systematisch weniger — die
  Calendly-Zahl ist die Wahrheit.

## Offen vor dem Start

- **Impressum.** Für Werbung, die sich an Nutzer in Deutschland richtet, ist eine
  Anbieterkennzeichnung nach § 5 DDG Pflicht, inklusive ladungsfähiger Anschrift.
  Die Seite `/de/impressum` existiert noch nicht, weil dafür die Postadresse
  fehlt.
- **Rechtliche Prüfung der Datenschutzseite.** `/de/datenschutz` ist eine
  inhaltsgleiche Übersetzung der englischen Fassung, keine anwaltlich geprüfte
  Erklärung.
