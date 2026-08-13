# Woher die 300 Unternehmen kommen

Das Ziel ist nicht, 300 Adressen zu haben. Das Ziel ist, 300 Adressen zu haben, bei denen
sich der Anruf lohnt. Der Unterschied entsteht bei der Auswahl, nicht beim Anschreiben.

## Das Auswahlkriterium

Skilldwork passt zu einem Unternehmen, wenn beides zutrifft:

1. **Der Auftragstyp wiederholt sich.** Nicht jedes Projekt ist neu erfunden. Erkennbar an
   Festpreisen, Paketen, benannten Leistungen mit festem Umfang.
2. **Das Ergebnis ist digital übergebbar.** Ein Dokument, eine Analyse, ein Konzept, eine
   Auswertung, ein Gutachten. Nicht: eine Reparatur vor Ort.

Ein Unternehmen, das auf seiner Website „individuelle Beratung nach Aufwand" schreibt, ist
ein schlechter Kandidat. Eines, das drei Pakete mit Festpreis anbietet, ist ein guter. Das
lässt sich auf der Leistungsseite in zwanzig Sekunden erkennen — und genau das macht der
`recherche`-Schritt automatisch.

## Quelle 1 — OpenStreetMap (automatisiert, im Toolkit)

```
outreach sammeln --ort Hamburg --branche steuerberater
outreach sammeln --ort "Landkreis Harburg" --tag office=consulting
```

Kostenlos, ohne Anmeldung, liefert oft schon Website, Telefon und Adresse.

- **Stark bei** ortsgebundenen Dienstleistern mit Büro: Kanzleien, Agenturen, Beratungen,
  Architekten, Ingenieurbüros, Praxen.
- **Schwach bei** reinen Online-Freelancern — die haben keinen Kartenpunkt.
- **Lizenz:** ODbL. Bei Weitergabe der Daten ist „© OpenStreetMap-Mitwirkende" anzugeben.
  Das Toolkit schreibt die Herkunft in jede Zeile.
- **Ortsangabe:** muss dem OSM-Namen entsprechen. „Landkreis Harburg" funktioniert,
  „Kreis Harburg" nicht. Im Zweifel auf openstreetmap.org nachsehen.
- `--trocken` zeigt die erzeugte Abfrage, bevor etwas gespeichert wird.

Branchenkürzel: `outreach sammeln --hilfe`.

## Quelle 2 — Verzeichnisse mit Prüfsiegel (manuell, dann `import`)

Hier stehen die Unternehmen, die aktiv Kunden suchen — die Trefferquote ist höher als bei
Karten-Daten:

| Quelle | Wofür | Anmerkung |
|---|---|---|
| ProvenExpert | Dienstleister mit Bewertungsprofil | Zeigt Leistungspakete offen an |
| freelancermap, freelance.de | IT-, Marketing-, Ingenieur-Freelancer | Profile nennen Leistungen konkret |
| Handelsregister / Unternehmensregister | Rechtsform, Gründungsjahr, Geschäftsführer | Gut zum Anreichern, nicht zum Finden |
| IHK- und HWK-Verzeichnisse | Regional, nach Branche filterbar | Öffentlich einsehbar |
| Branchenverbände (BStBK, BDU, GPM, …) | Mitgliederlisten | Sehr saubere Segmente |
| LinkedIn (ohne Sales Navigator) | Ansprechpartner und Rolle | Zum Ergänzen, nicht zum Massensammeln |

Vorgehen: Liste als CSV exportieren oder von Hand zusammenstellen, dann

```
outreach import --datei ~/Downloads/mitglieder.csv --quelle "BDU Mitgliederverzeichnis"
```

Die Spaltennamen dürfen beliebig heißen — `import` erkennt die gängigen und zeigt die
Zuordnung vor dem Speichern an.

## Quelle 3 — dein eigenes Umfeld

Der ehrlichste Teil: Wen kennst du bereits, wer wurde dir genannt, wer hat auf einer
Veranstaltung mit dir gesprochen? Diese Kontakte haben um Größenordnungen bessere Quoten
als jede kalte Liste, und rechtlich sind sie unproblematisch, weil der Bezug erkennbar ist.
Trage sie zuerst ein.

## Wie viele pro Segment

Nimm nicht 300 Adressen aus einer Branche. Nimm drei bis vier Segmente zu je 60 bis 100 —
dann siehst du nach der ersten Woche, welches Segment antwortet, und kannst dort nachlegen,
statt 300 Mal dieselbe unpassende Ansprache zu verschicken.

Ein brauchbarer Startschnitt:

- Steuerberater und Lohnbuchhaltung
- Unternehmensberatung mit festen Paketen
- Werbe- und Designagenturen
- Ingenieur- und Energieberatungsbüros

## Zustellbarkeit — bevor die erste Mail rausgeht

Wenn du 300 Mails über `skilldwork.com` verschickst, riskierst du die Zustellbarkeit deiner
gesamten Geschäftskommunikation. Das ist kein Randthema, sondern der häufigste Fehler.

1. **Eigene Versanddomain.** Zum Beispiel `skilldwork-team.com` oder `mail-skilldwork.com`.
   Sie leitet auf die Hauptseite weiter, aber Reputationsschäden bleiben dort.
2. **SPF, DKIM und DMARC** für diese Domain einrichten. Ohne die drei landet ein
   erheblicher Teil im Spam.
3. **Aufwärmen.** Zwei bis drei Wochen mit wenigen Mails pro Tag beginnen und langsam
   steigern. Eine frische Domain, die am ersten Tag 100 Mails verschickt, wird eingestuft
   wie ein Spam-Versender.
4. **30 Mails pro Tag** ist eine vernünftige Obergrenze für den Dauerbetrieb — steht als
   Standard in `config.example.json`.
5. **Kein Tracking-Pixel, keine verkürzten Links, kein Anhang** in der Erstmail. Alle drei
   verschlechtern die Zustellrate messbar.
6. **Manuell versenden oder über ein normales Postfach.** Das Toolkit schreibt die Mails,
   es verschickt sie nicht — bewusst. Der Versand aus deinem echten Postfach sieht für
   Spamfilter aus wie das, was er ist: persönliche Post.

Bei 300 Kontakten über mehrere Wochen brauchst du kein Versandwerkzeug. Wenn du später
skalierst, sind Instantly oder Lemlist die üblichen Kandidaten — dann exportierst du mit
`outreach export` und lädst die Datei dort hoch.
