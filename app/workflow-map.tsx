type WorkflowCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  owner?: boolean;
  prominent?: boolean;
};

function WorkflowCard({
  eyebrow,
  title,
  description,
  owner = false,
  prominent = false,
}: WorkflowCardProps) {
  return (
    <article
      className={`flex min-h-48 flex-col justify-between rounded-2xl border p-5 ${
        owner
          ? "border-black/10 bg-[var(--workflow-accent)] text-black"
          : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text)]"
      } ${prominent ? "lg:min-h-64 lg:p-6" : ""}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-60">{eyebrow}</p>
      <div className="mt-8">
        <h3 className={`font-display leading-none ${prominent ? "text-4xl" : "text-3xl"}`}>
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 opacity-70">{description}</p>
      </div>
    </article>
  );
}

function FlowArrow() {
  return (
    <div
      aria-hidden="true"
      className="flex h-7 items-center justify-center text-2xl text-[var(--muted-text)] lg:h-auto lg:text-3xl"
    >
      <span className="rotate-90 lg:rotate-0">→</span>
    </div>
  );
}

export default function WorkflowMap() {
  return (
    <section className="w-full px-4 pb-20 sm:px-6 sm:pb-28" aria-labelledby="workflow-title">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl shadow-black/10 dark:shadow-black/60">
        <header className="grid gap-8 border-b border-[var(--card-border)] p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
              The Skilldwork model
            </p>
            <h2
              id="workflow-title"
              className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-[var(--text)] sm:text-6xl"
            >
              We turn your service into a digital workflow.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-text)] sm:text-lg">
              You stay visible and apply your expertise where it matters. The system handles the
              repeatable work around it.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[var(--muted-text)] lg:justify-end">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[var(--workflow-accent)]" aria-hidden="true" />
              Handled by you
            </span>
            <span className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-sm border border-[var(--field-border-focus)] bg-[var(--card-bg)]"
                aria-hidden="true"
              />
              Automated by your digital service
            </span>
          </div>
        </header>

        <div className="p-6 sm:p-10">
          <div className="grid items-center lg:grid-cols-[1.2fr_2.5rem_1fr_2.5rem_1fr_2.5rem_1.25fr_2.5rem_1fr]">
            <WorkflowCard
              eyebrow="Your main role"
              title="Marketing"
              description="You create demand through content, outreach, and relationships. Your voice remains the growth engine."
              owner
              prominent
            />
            <FlowArrow />
            <WorkflowCard
              eyebrow="Automated"
              title="Offer & checkout"
              description="Packages, landing page, purchase, and confirmation work as one connected flow."
            />
            <FlowArrow />
            <WorkflowCard
              eyebrow="Automated"
              title="Client onboarding"
              description="The right inputs are collected and the client always knows what happens next."
            />
            <FlowArrow />

            <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--btn-bg)] p-5 text-[var(--btn-text)] lg:min-h-64 lg:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-60">
                n8n workflow · automated
              </p>
              <h3 className="mt-5 font-display text-3xl leading-none">Build, deliver, improve</h3>
              <p className="mt-3 text-sm leading-6 opacity-70">
                Your service runs consistently and learns from each revision.
              </p>

              <div className="my-4 flex items-center gap-2" aria-hidden="true">
                <span className="h-px flex-1 bg-current opacity-25" />
                <span className="text-lg opacity-60">↕</span>
                <span className="h-px flex-1 bg-current opacity-25" />
              </div>

              <div className="rounded-xl bg-[var(--workflow-accent)] p-4 text-black">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] opacity-60">
                  HITL · handled by you
                </p>
                <h4 className="mt-2 font-display text-2xl leading-none">Expert review</h4>
                <p className="mt-2 text-xs leading-5 opacity-70">
                  You step in only when human judgment adds value.
                </p>
              </div>
            </article>

            <FlowArrow />
            <WorkflowCard
              eyebrow="Automated"
              title="Client delivery"
              description="Results, status updates, and revision loops reach the client without manual coordination."
            />
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[var(--card-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-[var(--muted-text)]">
              The goal is not to remove you from the service. It is to reserve your time for
              visibility, relationships, and expert decisions.
            </p>
            <a
              href="#book"
              className="shrink-0 rounded-full bg-[var(--btn-bg)] px-6 py-3 text-center font-display text-sm uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)]"
            >
              Build my workflow
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
