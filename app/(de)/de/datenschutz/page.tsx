import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "../../../theme-toggle";

export const metadata: Metadata = {
  title: "Datenschutz | Skilldwork",
  description: "Datenschutzhinweise für Anfragen und Buchungen bei Skilldwork.",
  alternates: {
    canonical: "/de/datenschutz",
    languages: { en: "/privacy", de: "/de/datenschutz" },
  },
};

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold tracking-tight text-[var(--text)]";
const linkClass =
  "text-[var(--text)] underline decoration-[var(--field-border-focus)] underline-offset-4 transition-opacity hover:opacity-65";

export default function DatenschutzPage() {
  return (
    <main className="relative min-h-screen px-4 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between pb-6">
        <Link
          href="/de"
          className="font-display text-2xl tracking-tight text-[var(--text)] transition-opacity hover:opacity-65"
        >
          skilldwork
        </Link>
        <ThemeToggle locale="de" />
      </div>

      <article className="mx-auto w-full max-w-3xl space-y-9 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-[var(--muted-text)] shadow-2xl shadow-black/10 sm:p-10 dark:shadow-black/60">
        <header className="space-y-3 border-b border-[var(--card-border)] pb-7">
          <p className="text-sm font-medium uppercase tracking-[0.16em]">Skilldwork</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-[var(--text)] sm:text-5xl">
            Datenschutz
          </h1>
          <p className="max-w-2xl leading-7">
            Diese Hinweise erklären, wie Skilldwork personenbezogene Daten verarbeitet, die du
            über unsere Website, ein Lead-Formular auf Facebook, Instagram oder Reddit oder über
            unseren Calendly-Buchungslink angibst.
          </p>
        </header>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Verantwortlicher</h2>
          <address className="not-italic leading-7">
            Dwayne Henneberg (Skilldwork)
            <br />
            E-Mail:{" "}
            <a href="mailto:hello@skilldwork.com" className={linkClass}>
              hello@skilldwork.com
            </a>
          </address>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Welche Daten wir verarbeiten</h2>
          <p className="leading-7">
            Je nachdem, wie du Kontakt aufnimmst, verarbeiten wir deinen Namen, deine
            E-Mail-Adresse, deine Telefonnummer, Firma oder Rolle, deine Nachricht, Termindaten
            und weitere Angaben, die du uns freiwillig mitteilst. Beim Besuch der Website werden
            außerdem technische Daten wie IP-Adresse, Browser- oder Geräteinformationen,
            aufgerufene Seite sowie Datum und Uhrzeit verarbeitet, um die Website sicher
            bereitzustellen.
          </p>
          <p className="leading-7">
            Wenn du die Messung für Werbung erlaubst, verarbeiten der Reddit-Pixel und der
            Meta-Pixel zusätzlich Informationen über Seitenaufrufe und abgeschlossene Buchungen
            zusammen mit Online-Kennungen und Geräte- oder Browserinformationen, damit wir messen
            können, ob eine Anzeige zu einer Buchung geführt hat.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Wie und warum wir deine Daten nutzen</h2>
          <p className="leading-7">
            Wir nutzen deine Daten, um deine Anfrage zu beantworten, dich zum angefragten Angebot
            zu kontaktieren, einen Termin zu vereinbaren und zu verwalten sowie angefragte
            Leistungen vorzubereiten. Grundlage sind Schritte, um die du vor einem Vertragsschluss
            bittest (Art. 6 Abs. 1 lit. b DSGVO), oder deine Einwilligung, wo ein Formular sie
            ausdrücklich einholt (Art. 6 Abs. 1 lit. a DSGVO). Begrenzte technische Daten
            verarbeiten wir aufgrund unseres berechtigten Interesses an einer sicheren und
            zuverlässigen Website (Art. 6 Abs. 1 lit. f DSGVO). Die Messung für Werbung wird nur
            mit deiner Einwilligung aktiviert (Art. 6 Abs. 1 lit. a DSGVO). Du kannst diese Wahl
            jederzeit über „Datenschutz“ ändern oder deine Einwilligung per E-Mail widerrufen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Plattformen und Dienstleister</h2>
          <p className="leading-7">
            Der Anbieter des von dir genutzten Kanals verarbeitet Daten, um seinen Dienst zu
            betreiben. Das können{" "}
            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Meta
            </a>
            ,{" "}
            <a
              href="https://www.reddit.com/policies/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Reddit
            </a>
            ,{" "}
            <a
              href="https://calendly.com/legal/privacy-notice"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Calendly
            </a>{" "}
            für die Terminbuchung und{" "}
            <a
              href="https://vercel.com/legal/privacy-notice"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Vercel
            </a>{" "}
            für das Hosting sein. Details stehen in deren eigenen Datenschutzhinweisen. Skilldwork
            verkauft deine personenbezogenen Daten nicht. Bei diesen Anbietern kann es zu einer
            Verarbeitung in Drittländern kommen, abgesichert über die Standardvertragsklauseln der
            EU-Kommission.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Messung für Werbung</h2>
          <p className="leading-7">
            Der Reddit-Pixel und der Meta-Pixel bleiben deaktiviert, bis du „Erlauben“ wählst.
            Sind sie aktiv, erfassen sie einen Seitenaufruf, das Öffnen des Kalenders und, nachdem
            Calendly einen Termin bestätigt hat, ein Buchungsereignis. Eine Ablehnung schränkt
            weder die Website noch die Buchung ein. Deine Wahl gilt für beide Pixel und wird in
            deinem Browser gespeichert, damit wir sie bei späteren Besuchen beachten.
          </p>
          <p className="leading-7">
            Unabhängig davon werden Kampagnenparameter aus dem angeklickten Link (zum Beispiel
            utm_source oder eine Klick-Kennung von Reddit oder Meta) für die Dauer deines Besuchs
            in deinem Browser gespeichert und an eine Buchung angehängt, damit wir erkennen, aus
            welcher Kampagne sie stammt. Sie werden gelöscht, sobald du den Tab schließt.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Speicherdauer</h2>
          <p className="leading-7">
            Wir speichern personenbezogene Daten nur so lange, wie es für deine Anfrage, deine
            Buchung oder die daraus entstehende Geschäftsbeziehung nötig ist. Wir löschen sie,
            wenn der Zweck entfällt oder du deine Einwilligung widerrufst, sofern keine
            gesetzliche Aufbewahrungspflicht entgegensteht.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>7. Deine Rechte</h2>
          <p className="leading-7">
            Im Rahmen der gesetzlichen Voraussetzungen hast du das Recht auf Auskunft,
            Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und
            Widerspruch. Du kannst außerdem deine Einwilligung widerrufen und dich bei einer
            zuständigen Datenschutzaufsichtsbehörde beschweren. Für die Ausübung deiner Rechte
            genügt eine E-Mail an die oben genannte Adresse.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>8. Freiwilligkeit</h2>
          <p className="leading-7">
            Die Angabe personenbezogener Daten ist freiwillig. Ohne die Angaben, die wir zur
            Antwort oder Terminvereinbarung brauchen, können wir deine Anfrage möglicherweise
            nicht bearbeiten. Skilldwork nutzt für diese Zwecke keine automatisierte
            Entscheidungsfindung und kein Profiling.
          </p>
        </section>

        <p className="border-t border-[var(--card-border)] pt-7 text-sm">
          Stand: 11. August 2026
        </p>
      </article>
    </main>
  );
}
