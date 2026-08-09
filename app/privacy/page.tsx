import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "../theme-toggle";

export const metadata: Metadata = {
  title: "Datenschutz | Skilldwork",
  description: "Datenschutzhinweise für Meta-Lead-Formulare von Skilldwork.",
};

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold tracking-tight text-[var(--text)]";

export default function PrivacyPage() {
  return (
    <main lang="de" className="relative min-h-screen px-4 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between pb-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-[var(--text)] transition-opacity hover:opacity-65"
        >
          skilldwork
        </Link>
        <ThemeToggle />
      </div>

      <article className="mx-auto w-full max-w-3xl space-y-9 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-[var(--muted-text)] shadow-2xl shadow-black/10 sm:p-10 dark:shadow-black/60">
        <header className="space-y-3 border-b border-[var(--card-border)] pb-7">
          <p className="text-sm font-medium uppercase tracking-[0.16em]">Skilldwork</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-[var(--text)] sm:text-5xl">
            Datenschutz
          </h1>
          <p className="max-w-2xl leading-7">
            Diese Hinweise gelten für Kontaktdaten, die du uns über ein Lead-Formular auf
            Facebook oder Instagram übermittelst.
          </p>
        </header>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Verantwortlicher</h2>
          <address className="not-italic leading-7">
            Dwayne Henneberg (Skilldwork)
            <br />
            E-Mail:{" "}
            <a
              href="mailto:hello@skilldwork.com"
              className="text-[var(--text)] underline decoration-[var(--field-border-focus)] underline-offset-4 hover:opacity-65"
            >
              hello@skilldwork.com
            </a>
          </address>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Welche Daten wir verarbeiten</h2>
          <p className="leading-7">
            Wenn du unser Meta-Lead-Formular absendest, erhalten und verarbeiten wir die von dir
            angegebene Telefonnummer. Meta verarbeitet Daten außerdem nach den eigenen{" "}
            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--text)] underline decoration-[var(--field-border-focus)] underline-offset-4 hover:opacity-65"
            >
              Datenschutzbestimmungen
            </a>
            .
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Zweck und Rechtsgrundlage</h2>
          <p className="leading-7">
            Wir verwenden deine Telefonnummer ausschließlich, um dich zu dem in der Anzeige
            beschriebenen Angebot zu kontaktieren und deine Anfrage zu beantworten. Die
            Verarbeitung erfolgt auf Grundlage deiner freiwilligen Einwilligung nach Art. 6 Abs.
            1 lit. a DSGVO. Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft per
            E-Mail an uns widerrufen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Empfänger und Speicherdauer</h2>
          <p className="leading-7">
            Wir geben deine Telefonnummer nicht zu Werbezwecken an Dritte weiter. Sie wird nur so
            lange gespeichert, wie sie für die Kontaktaufnahme und Bearbeitung deiner Anfrage
            erforderlich ist. Nach einem Widerruf oder wenn der Zweck entfällt, löschen wir sie,
            sofern keine gesetzliche Aufbewahrungspflicht entgegensteht.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Deine Rechte</h2>
          <p className="leading-7">
            Du hast im Rahmen der gesetzlichen Voraussetzungen das Recht auf Auskunft,
            Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Du
            kannst außerdem deine Einwilligung widerrufen und dich bei einer zuständigen
            Datenschutzaufsichtsbehörde beschweren. Zur Ausübung deiner Rechte genügt eine E-Mail
            an die oben genannte Adresse.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Freiwilligkeit</h2>
          <p className="leading-7">
            Die Angabe deiner Telefonnummer ist freiwillig. Ohne sie können wir dich nicht
            telefonisch kontaktieren. Eine automatisierte Entscheidungsfindung oder ein
            Profiling durch Skilldwork findet dabei nicht statt.
          </p>
        </section>

        <p className="border-t border-[var(--card-border)] pt-7 text-sm">
          Stand: 10. August 2026
        </p>
      </article>
    </main>
  );
}
