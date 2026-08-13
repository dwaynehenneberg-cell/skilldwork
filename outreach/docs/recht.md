# Rechtsrahmen der Kaltakquise (DE/AT/CH)

Das hier ist eine Arbeitsgrundlage, keine Rechtsberatung. Bei 300 Kontakten lohnt sich
eine einmalige anwaltliche Durchsicht deiner Mailvorlage — sie kostet weniger als eine
Abmahnung.

## Warum das den Aufbau des Toolkits bestimmt

Die kurze Fassung: **Werbung per Mail und Telefon an Unternehmen ist in Deutschland
einwilligungsbedürftig.** Es gibt keine „B2B-Ausnahme", die Kaltakquise pauschal erlaubt.
Das Toolkit ist deshalb so gebaut, dass es dich zu den Schritten zwingt, die den Unterschied
zwischen vertretbar und angreifbar ausmachen.

## E-Mail — § 7 Abs. 2 Nr. 2 UWG

Werbung per elektronischer Post ohne vorherige ausdrückliche Einwilligung gilt als
unzumutbare Belästigung. Das gilt auch gegenüber Unternehmen. Die Ausnahme in § 7 Abs. 3
UWG (Bestandskundenwerbung) greift bei Kaltakquise nicht — dafür bräuchtest du eine
bestehende Geschäftsbeziehung.

**Was das praktisch heißt:** Eine unangeforderte Werbemail an ein Unternehmen ist
formal angreifbar. Der Rechtsverstoß ist ein Unterlassungsanspruch, typischerweise geltend
gemacht über eine Abmahnung mit Kostennote. Wie hoch das reale Risiko ist, hängt fast
vollständig davon ab, ob der Empfänger sich belästigt fühlt.

**Was das Risiko senkt:**

- Enger Bezug zwischen deinem Angebot und dem konkreten Geschäft des Empfängers.
  Eine Mail, die erkennbar für dieses eine Unternehmen geschrieben wurde, wird selten
  abgemahnt. Eine erkennbare Massenmail schon.
- Kleine Mengen pro Tag statt Massenversand.
- Ein Widerspruch wird sofort und endgültig umgesetzt.
- Impressumsangaben und ein klarer Absender in jeder Mail.
- Keine Verschleierung: kein irreführender Betreff, keine gefälschte Antwortadresse.

Das Toolkit setzt Impressum, Datenherkunft und Widerspruchshinweis automatisch unter jede
Mail (`lib/mail.js`) — bewusst im Code und nicht im Prompt, damit kein Entwurf sie weglassen
kann. Das Tageslimit steht in `config.json` unter `limits.mails_pro_tag`.

## Telefon — § 7 Abs. 2 Nr. 1 UWG

Werbeanrufe brauchen bei Verbrauchern die **ausdrückliche vorherige** Einwilligung, bei
sonstigen Marktteilnehmern — also Unternehmen — reicht die **mutmaßliche** Einwilligung.

Mutmaßliche Einwilligung ist keine Vermutung ins Blaue. Sie verlangt konkrete Anhaltspunkte
dafür, dass das angerufene Unternehmen gerade an diesem Angebot ein Interesse hat. Der
Bezug muss aus dessen Tätigkeit folgen, nicht aus deiner Hoffnung. „Ist ein Unternehmen,
also könnte es Software brauchen" reicht nicht.

**Deshalb erscheint im Toolkit kein Kontakt auf der Anrufliste, solange das Feld
`relevanz_begruendung` leer ist** (`lib/sequenz.js`, Funktion `darfAngerufenWerden`). Das Feld
ist deine Dokumentation: ein nachprüfbarer Sachgrund aus der Recherche, im Zweifel dein
Beleg. Behandle es nicht als Pflichtfeld zum Wegklicken — wenn dir kein Grund einfällt, ist
der Anruf der falsche Kanal.

Weiter gilt:

- **Rufnummer nicht unterdrücken.** § 120 Abs. 1 Nr. 3 TKG, Bußgeld bis 10.000 Euro.
- Sagt jemand „nicht mehr anrufen", ist das sofort und dauerhaft umzusetzen:
  `outreach status <id> opt_out`.
- Keine automatischen Anrufmaschinen, keine KI-Stimme, die sich als Mensch ausgibt.
  Das Toolkit bereitet Anrufe vor, es führt sie nicht.

## Datenschutz — DSGVO

Auch geschäftliche Kontaktdaten sind personenbezogene Daten, sobald eine Person
identifizierbar ist (`info@` meist nicht, `a.marx@` schon).

- **Rechtsgrundlage:** berechtigtes Interesse, Art. 6 Abs. 1 lit. f. Das trägt die
  Verarbeitung der Daten — es ersetzt nicht die UWG-Anforderungen an die Ansprache selbst.
  Zwei getrennte Fragen, beide müssen passen.
- **Informationspflicht, Art. 14.** Weil du die Daten nicht bei der Person selbst erhoben
  hast, musst du bei der ersten Ansprache über Herkunft, Zweck und Widerspruchsrecht
  informieren. Genau das steht im Fußtext jeder Mail; die Spalte `datenherkunft` liefert
  die Quellenangabe pro Kontakt.
- **Widerspruch, Art. 21.** Nach einem Widerspruch endet die Verarbeitung. `opt_out`
  setzt Domain und Mailadresse auf `data/sperrliste.csv`; die überlebt jeden späteren
  Import, auch wenn `kontakte.csv` neu aufgebaut wird.
- **Löschen.** Kontakte ohne Reaktion nicht unbegrenzt aufheben. Ein sinnvoller Rhythmus:
  nach Abschluss der Sequenz plus zwölf Monate löschen, die Sperrliste behalten.

## Österreich und Schweiz

- **Österreich:** § 174 TKG 2021 verlangt für Werbemails die vorherige Einwilligung, auch
  gegenüber Unternehmen — strenger als in Deutschland, mit Verwaltungsstrafe. Zusätzlich
  gibt es die ECG-Liste, eine Robinsonliste, die vor dem Versand abzugleichen ist.
- **Schweiz:** Art. 3 Abs. 1 lit. o UWG verbietet Massenwerbung ohne Einwilligung.
  Beim Telefon ist der Sterneintrag im Telefonverzeichnis zu beachten.

Wenn du zunächst nur in Deutschland ansprichst, halte `land` in `kontakte.csv` sauber —
dann kannst du AT/CH später gezielt anders behandeln.

## Was ich davon abraten würde

- Gekaufte Adresslisten. Herkunft nicht belegbar, Art. 14 nicht erfüllbar, Qualität schlecht.
- Mailadressen aus Impressen automatisiert einsammeln und ungefiltert anschreiben. Genau
  dieses Muster erzeugt Abmahnungen.
- Versand über `skilldwork.com` als Hauptdomain ohne separate Versanddomain — siehe
  `docs/quellen.md`, Abschnitt Zustellbarkeit.
- Automatisierte Anrufe jeder Art.
