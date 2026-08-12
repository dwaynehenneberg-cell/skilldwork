import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "../theme-toggle";

export const metadata: Metadata = {
  title: "AGB | Skilldwork",
  description:
    "Allgemeine Geschäftsbedingungen für die Nutzung der Skilldwork-Plattform und Abonnements über Stripe.",
};

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold tracking-tight text-[var(--text)]";
const linkClass =
  "text-[var(--text)] underline decoration-[var(--field-border-focus)] underline-offset-4 transition-opacity hover:opacity-65";

export default function AgbPage() {
  return (
    <main className="relative min-h-screen px-4 py-6 sm:px-6 sm:py-12">
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
            AGB
          </h1>
          <p className="max-w-2xl leading-7">
            Allgemeine Geschäftsbedingungen für die Nutzung der Skilldwork-Plattform, einschließlich
            Abonnements und Zahlungen über Stripe.
          </p>
        </header>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Anbieter</h2>
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
          <h2 className={headingClass}>2. Geltungsbereich</h2>
          <p className="leading-7">
            Diese AGB gelten für alle Verträge zwischen dem Anbieter und Unternehmern sowie
            freiberuflich Tätigen („Kunde“ / Service Provider) über den Zugang zur
            Skilldwork-Softwareplattform (SaaS), zugehörige Digitale Workflows, Sales Pages, Client
            Portal, Provider Workspace und damit verbundene Leistungen. Entgegenstehende
            Bedingungen des Kunden gelten nur, wenn der Anbieter ihnen ausdrücklich schriftlich
            zustimmt.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Leistungsbeschreibung</h2>
          <p className="leading-7">
            Skilldwork stellt eine Plattform bereit, mit der der Kunde seine Dienstleistung in einen
            digitalen Workflow überführen und über eine result-basierte Sales Page anbieten kann.
            Umfang und Limits (z.&nbsp;B. aktive Sales Pages, gleichzeitige Service Runs, Sitze)
            ergeben sich aus dem gewählten Plan auf der Pricing-Seite bzw. aus einer individuellen
            Vereinbarung (Custom Solution). Der Anbieter schuldet die Bereitstellung der Plattform
            im vertraglich vereinbarten Rahmen, nicht den wirtschaftlichen Erfolg einzelner
            Clients des Kunden.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Vertragsschluss und Stripe</h2>
          <p className="leading-7">
            Der Vertrag über ein Abonnement kommt zustande, wenn der Kunde den Bestellprozess über
            den vom Anbieter bereitgestellten Stripe-Payment-Link bzw. Stripe-Checkout abschließt
            und die Zahlung erfolgreich autorisiert wird. Mit Abschluss bestätigt der Kunde, diese
            AGB und die{" "}
            <Link href="/privacy" className={linkClass}>
              Datenschutzerklärung
            </Link>{" "}
            zur Kenntnis genommen zu haben. Individuelle Angebote (Custom Solution) kommen durch
            Annahme eines Angebots oder schriftliche Bestätigung nach einem Beratungsgespräch
            zustande.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Preise, Abrechnung und Transaktionsgebühren</h2>
          <p className="leading-7">
            Es gelten die zum Zeitpunkt der Bestellung auf der Pricing-Seite ausgewiesenen Preise
            (monatlich oder jährlich). Zahlungen werden über Stripe abgewickelt. Der Kunde
            ermächtigt Stripe bzw. den Anbieter, fällige Beträge über die hinterlegte
            Zahlungsmethode einzuziehen. Zusätzlich zur Plan-Gebühr kann eine Transaktionsgebühr
            auf Zahlungen anfallen, die Clients des Kunden über Skilldwork leisten; der Prozentsatz
            richtet sich nach dem Plan. Alle Preise verstehen sich zuzüglich der gesetzlichen
            Umsatzsteuer, sofern nicht anders angegeben und sofern Umsatzsteuer anfällt.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Laufzeit und Kündigung</h2>
          <p className="leading-7">
            Monatliche Abonnements verlängern sich jeweils um einen weiteren Monat, sofern sie
            nicht vor Ablauf der laufenden Periode gekündigt werden. Jährliche Abonnements
            verlängern sich um ein weiteres Jahr unter denselben Bedingungen. Die Kündigung kann
            über den Stripe-Kundenbereich (sofern bereitgestellt) oder per E-Mail an die oben
            genannte Adresse erfolgen und wird zum Ende der laufenden Abrechnungsperiode wirksam.
            Ein Anspruch auf anteilige Rückerstattung bereits gezahlter Perioden besteht nicht,
            soweit gesetzlich nichts anderes zwingend vorgeschrieben ist.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>7. Pflichten des Kunden</h2>
          <p className="leading-7">
            Der Kunde bleibt verantwortlich für Marketing, Inhalte seiner Sales Pages, Angebote an
            seine Clients sowie für alle vertraglichen und gesetzlichen Pflichten gegenüber seinen
            Clients. Der Kunde stellt sicher, dass von ihm eingestellte Inhalte und Workflows keine
            Rechte Dritter verletzen und keine rechtswidrigen Zwecke verfolgen. Zugangsdaten sind
            geheim zu halten; der Kunde haftet für deren missbräuchliche Nutzung, soweit er sie zu
            vertreten hat.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>8. Clients des Kunden</h2>
          <p className="leading-7">
            Verträge über die vom Kunden angebotenen Leistungen kommen ausschließlich zwischen dem
            Kunden und dessen Clients zustande. Skilldwork ist technische Plattform und nicht
            Vertragspartner dieser Leistungsbeziehung, sofern nicht ausdrücklich anders vereinbart.
            Abwicklung von Client-Zahlungen über Stripe erfolgt im Auftrag bzw. im Rahmen der
            eingerichteten Zahlungswege des Kunden bzw. der Plattformintegration.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>9. Verfügbarkeit und Nutzungslimits</h2>
          <p className="leading-7">
            Der Anbieter bemüht sich um eine hohe Verfügbarkeit der Plattform, schuldet aber keine
            unterbrechungsfreie Nutzung. Wartungsfenster und Störungen sind möglich. Plan-Limits —
            insbesondere gleichzeitige Service Runs (Concurrent) und aktive Sales Pages — sind
            Bestandteil der Leistung. Bei Überschreitung kann der Anbieter weitere parallele Läufe
            drosseln oder zurückstellen, bis Kapazität frei wird, oder auf ein höheres Kontingent
            bzw. Custom Solution verweisen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>10. Haftung</h2>
          <p className="leading-7">
            Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden
            aus der Verletzung des Lebens, des Körpers oder der Gesundheit. Bei leichter
            Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten
            (Kardinalpflichten), und die Haftung ist auf den vorhersehbaren, vertragstypischen
            Schaden begrenzt. Die Haftung für mittelbare Schäden und entgangenen Gewinn ist in
            Fällen leichter Fahrlässigkeit ausgeschlossen, soweit gesetzlich zulässig. Die Haftung
            nach dem Produkthaftungsgesetz bleibt unberührt.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>11. Datenschutz</h2>
          <p className="leading-7">
            Informationen zur Verarbeitung personenbezogener Daten enthält die{" "}
            <Link href="/privacy" className={linkClass}>
              Datenschutzerklärung
            </Link>
            . Soweit der Kunde personenbezogene Daten seiner Clients über die Plattform verarbeitet,
            handelt er als eigener Verantwortlicher gegenüber seinen Clients, sofern nicht gesondert
            eine Auftragsverarbeitung vereinbart wird.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>12. Änderungen der AGB</h2>
          <p className="leading-7">
            Der Anbieter kann diese AGB ändern, soweit dies zur Anpassung an geänderte Rechtslage,
            Rechtsprechung oder Plattformfunktionen erforderlich ist und den Kunden nicht
            unangemessen benachteiligt. Über wesentliche Änderungen wird der Kunde per E-Mail oder
            in der Plattform informiert. Widerspricht der Kunde nicht innerhalb von 30 Tagen nach
            Zugang der Mitteilung, gelten die geänderten AGB als angenommen; hierauf wird in der
            Mitteilung hingewiesen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>13. Schlussbestimmungen</h2>
          <p className="leading-7">
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder
            öffentlich-rechtliches Sondervermögen, ist Gerichtsstand der Sitz des Anbieters, soweit
            gesetzlich zulässig. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit
            der übrigen Bestimmungen unberührt.
          </p>
        </section>

        <p className="border-t border-[var(--card-border)] pt-7 text-sm">
          Stand: 12. August 2026
        </p>
      </article>

      <footer className="mx-auto mt-8 flex max-w-3xl justify-center gap-4 pb-4 text-center">
        <Link
          href="/privacy"
          className="text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--text)]"
        >
          Privacy
        </Link>
        <Link
          href="/pricing"
          className="text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--text)]"
        >
          Pricing
        </Link>
      </footer>
    </main>
  );
}
