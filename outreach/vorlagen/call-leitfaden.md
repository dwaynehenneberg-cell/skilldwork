# Telefonleitfaden

Ziel des Anrufs ist ein Termin für ein 15-Minuten-Gespräch über den Ablauf des Gegenübers.
Nicht: Skilldwork erklären. Wer am Telefon das Produkt erklärt, bekommt keinen Termin —
er bekommt ein „schicken Sie mal Unterlagen".

`outreach heute` gibt für jeden Anruf den passenden Einstieg und die Einstiegsfrage aus.
Dieses Dokument ist das, was danach kommt.

## Vor dem Wählen

- Nummer **nicht** unterdrücken (§ 120 TKG).
- Steckbrief kurz überfliegen: `outreach/data/steckbriefe/<id>.md`.
- Die Begründung, warum du gerade dort anrufst, muss dir klar sein. Steht in der Spalte
  `relevanz_begruendung`. Wenn sie leer ist, erscheint der Kontakt gar nicht erst auf der
  Liste — das ist Absicht, siehe `docs/recht.md`.

## Die ersten 20 Sekunden

Drei Sätze, dann die Frage. Nicht mehr.

1. Wer du bist, mit Firmenname.
2. Warum ausgerechnet dieses Unternehmen — der konkrete Aufhänger von deren Website.
3. Was du willst, offen und klein: ein kurzes Gespräch über deren Ablauf.
4. Die Frage.

Beispiel:

> „Frau Dr. Marx, Dwayne Henneberg von Skilldwork. Ich habe gesehen, dass Sie
> Jahresabschluss und Lohnbuchhaltung als Festpreis-Pakete anbieten, und rufe deshalb an.
> Ich schaue mir gerade an, wie Kanzleien mit festen Paketen ihre wiederkehrenden Mandate
> abwickeln. Wie läuft bei Ihnen heute ein Jahresabschluss von der Anfrage bis zur Übergabe?"

Danach: **schweigen und zuhören.** Wenn die Person anfängt zu erzählen, ist der Anruf
gelungen. Notiere mit — was du hier hörst, ist mehr wert als der Termin.

## Am Vorzimmer vorbei

Nicht tricksen. Klar sagen, worum es geht:

> „Ich würde gern kurz mit Frau Dr. Marx sprechen — es geht darum, wie Sie Ihre
> Festpreis-Mandate abwickeln. Wann erreiche ich sie am besten?"

Wenn die Antwort „schicken Sie eine Mail" lautet: annehmen, nach der direkten Adresse
fragen, Rückrufzeitpunkt vereinbaren. Dann `outreach status <id> anruf1 --notiz "..."`.

## Einwände

**„Wir haben kein Interesse."**
> „Verstehe. Darf ich eine Frage stellen, bevor ich auflege: Liegt das daran, dass Sie
> Ihre Abläufe schon so haben, wie Sie sie wollen — oder ist das Thema gerade einfach
> nicht dran?"

Die Antwort trennt „nie" von „nicht jetzt". Bei „nie": `kein_interesse` setzen und Schluss.

**„Schicken Sie mal Unterlagen."**
> „Mache ich gern. Damit ich nicht das Falsche schicke: Welcher Auftragstyp kostet Sie
> aktuell am meisten Zeit?"

Eine Antwort reicht, um die Mail brauchbar zu machen. Kommt keine, ist es eine höfliche
Absage — dann respektieren.

**„Wir machen das alles schon digital."**
> „Das glaube ich sofort. Mich interessiert weniger die Software als die Übergabepunkte:
> Wie oft müssen Sie bei einem laufenden Auftrag noch selbst eingreifen, um ihn
> weiterlaufen zu lassen?"

**„Keine Zeit."**
> „Klar. Ich rufe an, weil es genau darum geht. Passt Donnerstag früh besser, oder soll
> ich in zwei Wochen nochmal?"

**„Was kostet das?"**
> „Das kann ich seriös erst sagen, wenn ich Ihren Ablauf kenne — deshalb die 15 Minuten.
> Die Preisliste steht offen auf skilldwork.com/pricing, falls Sie vorab schauen wollen."

**„Woher haben Sie meine Nummer?"**
Immer wahrheitsgemäß und ohne Ausweichen antworten. Die Quelle steht in der Spalte
`datenherkunft`. Wenn die Person das kritisch fragt, ist das Gespräch faktisch beendet —
dann Widerspruch anbieten und `opt_out` setzen.

## Wenn ein Termin zustande kommt

- Datum, Uhrzeit und Kanal sofort bestätigen.
- Innerhalb einer Stunde eine schriftliche Bestätigung mit Kalendereinladung.
- Eine Zeile dazu, worüber gesprochen wird — sonst sinkt die Erscheinungsquote.
- `outreach status <id> termin --notiz "Di 14:00, Videocall"`

## Danach, immer

```
outreach status <id> anruf1 --notiz "nicht erreicht, Rückruf Do vormittag"
outreach status <id> gespraech --notiz "Inhaberin, Ablauf ist Excel plus Mail"
outreach status <id> termin --notiz "Di 14:00"
outreach status <id> kein_interesse --notiz "arbeitet nur auf Stundenbasis"
outreach status <id> opt_out --notiz "möchte nicht kontaktiert werden"
```

Ohne diesen Schritt stimmt der Tagesplan am nächsten Tag nicht mehr.

## Was dieses Vorgehen bewusst nicht macht

Es ruft nicht automatisch an, es spricht keine Bandansage, es nutzt keine KI-Stimme.
Automatisierte Werbeanrufe sind in Deutschland unzulässig, und eine synthetische Stimme
am Telefon zerstört das Vertrauen, das du im Gespräch eigentlich aufbauen willst. Die
Automatisierung liegt in Auswahl, Recherche, Texten und Nachhalten — den Anruf führst du.
