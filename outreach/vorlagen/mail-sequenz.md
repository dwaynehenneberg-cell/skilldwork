# Die Mail-Sequenz

`outreach entwurf` schreibt Mail 1 und Mail 2 für jeden Kontakt einzeln. Dieses Dokument
erklärt, wonach sie gebaut sind — damit du beurteilen kannst, ob ein Entwurf taugt, bevor
du ihn abschickst.

## Das Ziel jeder Erstmail

Ein Gespräch von 15 Minuten über den **Ablauf des Angeschriebenen**. Nicht über Skilldwork.

Das ist der wichtigste Punkt und der, an dem die meisten Erstmails scheitern: Wer im
Erstkontakt sein Produkt erklärt, bittet den Leser, eine Kaufentscheidung zu treffen, über
die er nichts weiß. Wer nach dessen Ablauf fragt, bittet ihn, über sich selbst zu sprechen —
und das kostet ihn nichts.

## Aufbau von Mail 1

| Teil | Zweck | Länge |
|---|---|---|
| Betreff | Bezug auf deren Geschäft, nicht auf dein Angebot | unter 60 Zeichen |
| Satz 1 | Eine nachprüfbare Beobachtung von deren Website | 1 Satz |
| Satz 2–3 | Was Skilldwork macht, in deren Sprache, bezogen auf deren Auftragstyp | 2 Sätze |
| Schluss | Bitte um 15 Minuten, als Frage formuliert | 1–2 Sätze |
| Fußtext | Impressum, Datenherkunft, Widerspruch | setzt das Programm |

90 bis 130 Wörter. Alles darüber wird auf dem Handy nicht gelesen.

**Der erste Satz entscheidet.** Er muss zeigen, dass jemand hingeschaut hat. „Ich habe
gesehen, dass Sie Jahresabschluss und Lohnbuchhaltung als Festpreis-Pakete anbieten" ist
gut. „Ich bin auf Ihre Website gestoßen und war beeindruckt" ist eine Massenmail mit
anderen Worten.

## Was nicht hineingehört

- Preise, Angebote, Anhänge, Links auf die Preisseite
- Terminvorschläge mit Uhrzeit („Passt Dienstag 14 Uhr?") — im Erstkontakt zu forsch
- Zahlenversprechen („spart 40 % Zeit"), die du nicht belegen kannst
- „Ich hoffe, es geht Ihnen gut", „kurz zu mir", „innovatives Startup"
- Tracking-Pixel und Kurzlinks — schaden der Zustellbarkeit, siehe `docs/quellen.md`
- Zwei Bitten. Eine Mail, ein Handlungsaufruf.

## Der Takt

| Tag | Schritt | Was |
|---|---|---|
| 0 | mail1 | Vorstellung, Bezug, Bitte um 15 Minuten |
| 2 | anruf1 | Anruf mit Bezug auf die Mail |
| 5 | mail2 | Ein konkreter Impuls, Bitte wiederholt |
| 9 | anruf2 | Zweiter Versuch, andere Tageszeit |
| 14 | mail3 | Abschluss, Tür offen lassen |

Steht in `config.json` unter `sequenz` und lässt sich dort ändern.

Die Kombination aus Mail und Anruf ist der Grund, warum das funktioniert: Die Mail allein
hat eine niedrige Antwortquote, der Anruf allein wirkt aus dem Nichts. Ein Anruf zwei Tage
nach einer Mail, die erkennbar für dieses Unternehmen geschrieben wurde, ist etwas anderes
als Kaltakquise — und zwar auch rechtlich, siehe `docs/recht.md`.

## Mail 3 ist absichtlich für alle gleich

Die Abschluss-Mail wird nicht pro Kontakt getextet (`lib/mail.js`, `abschlussText`). Sie
macht das Nein leicht und nimmt Druck raus. Genau das erzeugt erfahrungsgemäß noch einmal
Antworten — aber nur, wenn sie kurz ist und keinen neuen Anlauf nimmt.

## Wenn jemand antwortet

Sequenz sofort beenden:

```
outreach status <id> geantwortet --notiz "fragt nach Preisen"
```

Ab da schreibst du von Hand. Eine Automatik, die nach einer Antwort weiter Follow-ups
schickt, ist der schnellste Weg, einen Interessenten zu verlieren.

## Qualitätsprüfung vor dem Versand

Lies die ersten zehn Entwürfe vollständig gegen. Prüfe:

1. Stimmt die Beobachtung im ersten Satz **tatsächlich**? Claude hat die Website gelesen,
   kann aber etwas fehlinterpretiert haben. Eine falsche Behauptung über deren Geschäft ist
   schlimmer als gar keine Mail.
2. Ist die Anrede korrekt? Bei Unsicherheit steht dort „Guten Tag," — das ist gewollt.
3. Würdest du auf diese Mail antworten?

Wenn mehrere Entwürfe gleich klingen, ist die Recherche zu dünn — dann liegt es an der
Zielgruppe, nicht am Prompt.
