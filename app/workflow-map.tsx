"use client";

import { useEffect, useState, type ReactNode } from "react";

type StepId = "build" | "market" | "fulfill" | "improve";

type StepInfo = {
  eyebrow: string;
  title: string;
  summary: string;
  bullets: string[];
};

const STEP_INFO: Record<StepId, StepInfo> = {
  build: {
    eyebrow: "01 · Build",
    title: "Build your workflow",
    summary: "We turn your service into a connected sales and fulfillment system.",
    bullets: [
      "Map the result and repeatable service steps",
      "Build the result-based Sales Page",
      "Connect the Client Portal and Execution Workflow",
    ],
  },
  market: {
    eyebrow: "02 · Market · handled by you",
    title: "Create demand and share one link",
    summary: "You focus on marketing while the system handles what happens after purchase.",
    bullets: [
      "Content, outreach, and relationships stay with you",
      "Clients choose a result-based Offer",
      "A purchase starts fulfillment automatically",
    ],
  },
  fulfill: {
    eyebrow: "03 · Fulfill · automated",
    title: "Deliver the result in one connected flow",
    summary: "Onboarding, execution, results, and revisions remain connected to the same Service Run.",
    bullets: [
      "Client Portal Onboarding collects the required inputs",
      "The Execution Workflow performs the repeatable work",
      "Revise returns to Execution; Accept completes the result",
    ],
  },
  improve: {
    eyebrow: "04 · Improve · built into Skilldwork",
    title: "The Revision Agent improves future runs",
    summary: "The agent is part of the Skilldwork Platform—there is nothing separate to set up or operate.",
    bullets: [
      "Captures revision patterns across Service Runs",
      "Suggests a safer workflow version inside the platform",
      "You review and apply useful changes before they go live",
    ],
  },
};

const STEP_POSITION: Record<StepId, string> = {
  build: "md:left-[13%]",
  market: "md:left-[36%]",
  fulfill: "md:right-[8%]",
  improve: "md:right-[24%]",
};

const activeClass =
  "transition duration-500 data-[active=true]:-translate-y-1 data-[active=true]:ring-2 data-[active=true]:ring-[var(--text)] data-[active=true]:shadow-lg motion-reduce:transition-none";
const stageClass =
  "relative -m-2 rounded-xl p-2 transition duration-500 data-[focused=true]:bg-[var(--field-bg)] data-[focused=true]:ring-1 data-[focused=true]:ring-[var(--field-border-focus)] md:data-[focused=true]:z-10 md:data-[focused=true]:scale-[1.025] motion-reduce:transition-none";

function FlowArrow() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-8 shrink-0 flex-col items-center justify-center text-[var(--muted-text)]"
    >
      <span className="rotate-90 text-xl xl:rotate-0">→</span>
    </div>
  );
}

function WindowHeader({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-1.5 border-b border-[var(--card-border)] pb-2.5">
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
      <span className="ml-1 text-[0.55rem] font-semibold uppercase tracking-[0.13em] opacity-55">
        {children}
      </span>
    </div>
  );
}

type CompactNodeProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
  kind: "action" | "interface";
  tone?: "dark" | "owner" | "surface" | "workflow";
};

function CompactNode({
  active,
  children,
  className = "",
  kind,
  tone = "surface",
}: CompactNodeProps) {
  const shapeClass =
    kind === "action"
      ? "aspect-square rounded-full flex flex-col items-center justify-center text-center"
      : "rounded-lg";
  const toneClass =
    tone === "dark"
      ? "border-[var(--card-border)] bg-[var(--btn-bg)] text-[var(--btn-text)]"
      : tone === "owner"
        ? "border-black/10 bg-[var(--workflow-accent)] text-black"
        : tone === "workflow"
          ? "border-black/10 bg-[var(--workflow-blue)] text-white"
          : "border-[var(--field-border-focus)] bg-[var(--card-bg)] text-[var(--text)]";

  return (
    <article
      data-active={active}
      className={`${activeClass} ${shapeClass} ${toneClass} border p-4 ${className}`}
    >
      {children}
    </article>
  );
}

function StepLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 w-full text-left text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
      {children}
    </p>
  );
}

type StepPopoverProps = {
  announce: boolean;
  interactive: boolean;
  onClose: () => void;
  step: StepId;
};

function StepPopover({ announce, interactive, onClose, step }: StepPopoverProps) {
  const info = STEP_INFO[step];

  return (
    <aside
      id="workflow-step-popover"
      aria-live={announce ? "polite" : undefined}
      className={`fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-2xl border border-[var(--field-border-focus)] bg-[var(--card-bg)] p-4 shadow-2xl shadow-black/25 md:absolute md:inset-x-auto md:bottom-auto md:top-48 md:w-80 md:max-w-none ${interactive ? "" : "pointer-events-none"} ${STEP_POSITION[step]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-[var(--muted-text)]">
            {info.eyebrow}
          </p>
          <h3 className="mt-1.5 font-display text-2xl leading-tight text-[var(--text)]">
            {info.title}
          </h3>
        </div>
        {interactive ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close step details"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] text-lg text-[var(--text)] transition hover:bg-[var(--field-bg)]"
          >
            ×
          </button>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-5 text-[var(--text)]">{info.summary}</p>
      <ul className="mt-3 space-y-1.5 text-xs leading-5 text-[var(--muted-text)]">
        {info.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span aria-hidden="true">→</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

    </aside>
  );
}

export default function WorkflowMap() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveStep, setMobileActiveStep] = useState<StepId | null>(null);
  const [hoveredStep, setHoveredStep] = useState<StepId | null>(null);
  const [selectedStep, setSelectedStep] = useState<StepId | null>(null);
  const focusedStep = selectedStep ?? (isMobile ? mobileActiveStep : hoveredStep);
  const visibleStep = focusedStep;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const syncMode = () => setIsMobile(media.matches);
    syncMode();
    media.addEventListener("change", syncMode);
    return () => media.removeEventListener("change", syncMode);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    let animationFrame = 0;
    const updateActiveStep = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        const sectionRect = document.getElementById("how-it-works")?.getBoundingClientRect();
        if (
          !sectionRect ||
          sectionRect.top > viewportHeight * 0.8 ||
          sectionRect.bottom < viewportHeight * 0.95
        ) {
          setMobileActiveStep(null);
          return;
        }
        const steps = (Object.keys(STEP_INFO) as StepId[])
          .map((step) => {
            const element = document.getElementById(`workflow-step-${step}`);
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            const isInFocusBand = rect.bottom > viewportHeight * 0.18 && rect.top < viewportHeight * 0.72;
            if (!isInFocusBand) return null;
            return {
              step,
              distance: Math.abs((rect.top + rect.bottom) / 2 - viewportHeight * 0.42),
            };
          })
          .filter((item): item is { step: StepId; distance: number } => item !== null)
          .sort((a, b) => a.distance - b.distance);

        setMobileActiveStep(steps[0]?.step ?? null);
      });
    };

    updateActiveStep();
    window.addEventListener("scroll", updateActiveStep, { passive: true });
    window.addEventListener("resize", updateActiveStep);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveStep);
      window.removeEventListener("resize", updateActiveStep);
    };
  }, [isMobile]);

  function toggleStep(step: StepId) {
    setSelectedStep((current) => (current === step ? null : step));
    setHoveredStep(null);
  }

  function hoverStep(step: StepId | null) {
    if (!isMobile && selectedStep === null) setHoveredStep(step);
  }

  return (
    <section
      id="how-it-works"
      className="w-full scroll-mt-4 px-4 pb-16 sm:px-6 sm:pb-20"
      aria-labelledby="workflow-title"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl shadow-black/10 dark:shadow-black/60">
        <header className="grid gap-5 border-b border-[var(--card-border)] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
              How it works
            </p>
            <h2
              id="workflow-title"
              className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-[var(--text)] sm:text-5xl"
            >
              Build. Market. Fulfill. Improve.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-text)] sm:text-base">
              Four steps turn your service into a connected system that delivers and improves.
            </p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
            <span className="md:hidden">Scroll to explore</span>
            <span className="hidden md:inline">Hover to explore</span>
          </p>
        </header>

        <div className="space-y-4 p-4 sm:p-6">
          <div className="rounded-2xl border border-[var(--field-border-focus)] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                Skilldwork service system
              </p>
              <div className="flex flex-wrap gap-3 text-[0.58rem] text-[var(--muted-text)]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--btn-bg)]" /> Start / build
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--workflow-blue)]" /> Automation
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--workflow-accent)]" /> Handled by you
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-3.5 border border-[var(--field-border-focus)]" /> Page / platform
                </span>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25rem_0.95fr_1.25rem_2.35fr_1.25rem_1.35fr] xl:items-start">
              <div
                id="workflow-step-build"
                data-focused={focusedStep === "build"}
                className={`${stageClass} flex scroll-mt-24 flex-col items-start`}
                onMouseEnter={() => hoverStep("build")}
                onMouseLeave={() => hoverStep(null)}
              >
                <StepLabel>01 · Build</StepLabel>
                <div className="flex w-full flex-col items-center">
                  <CompactNode
                    active={focusedStep === "build"}
                    kind="action"
                    tone="dark"
                    className="w-full max-w-40"
                  >
                    <p className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] opacity-55">
                      Start here
                    </p>
                    <h3 className="mt-2 font-display text-2xl leading-none">Build your workflow</h3>
                    <p className="mt-2 text-[0.62rem] opacity-60">Sales Page + delivery system</p>
                  </CompactNode>
                  <a
                    href="#book"
                    className="mt-3 rounded-full border border-[var(--field-border-focus)] px-3 py-1.5 font-display text-[0.6rem] uppercase tracking-wider transition hover:bg-[var(--field-bg)]"
                  >
                    Book a call
                  </a>
                  <button
                    type="button"
                    onClick={() => toggleStep("build")}
                    aria-controls="workflow-step-popover"
                    aria-expanded={selectedStep === "build"}
                    className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] underline decoration-current/25 underline-offset-4"
                  >
                    Learn more
                  </button>
                </div>
              </div>

              <FlowArrow />

              <div
                id="workflow-step-market"
                data-focused={focusedStep === "market"}
                className={`${stageClass} flex scroll-mt-24 flex-col items-start`}
                onMouseEnter={() => hoverStep("market")}
                onMouseLeave={() => hoverStep(null)}
              >
                <StepLabel>02 · Market</StepLabel>
                <div className="flex w-full flex-col items-center">
                  <CompactNode
                    active={focusedStep === "market"}
                    kind="action"
                    tone="owner"
                    className="w-full max-w-36"
                  >
                    <h3 className="font-display text-2xl">Marketing</h3>
                    <p className="mt-1 text-[0.6rem] opacity-65">Handled by you</p>
                  </CompactNode>
                  <span className="my-1 text-sm text-[var(--muted-text)]" aria-hidden="true">↓</span>
                  <CompactNode
                    active={false}
                    kind="interface"
                    className="w-full max-w-48 p-3"
                  >
                    <WindowHeader>Sales Page</WindowHeader>
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <div className="space-y-1.5">
                        <div className="h-8 bg-[var(--field-bg)]" />
                        <div className="h-1.5 w-full bg-[var(--field-bg)]" />
                        <div className="h-1.5 w-3/4 bg-[var(--field-bg)]" />
                      </div>
                      <div className="space-y-1 text-[0.48rem] uppercase">
                        <div className="border border-[var(--field-border-focus)] px-1.5 py-1">Offer 1</div>
                        <div className="border border-[var(--field-border-focus)] px-1.5 py-1">Offer 2</div>
                      </div>
                    </div>
                  </CompactNode>
                  <p className="mt-2 text-[0.52rem] text-[var(--muted-text)]">Next client starts here ↻</p>
                  <button
                    type="button"
                    onClick={() => toggleStep("market")}
                    aria-controls="workflow-step-popover"
                    aria-expanded={selectedStep === "market"}
                    className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] underline decoration-current/25 underline-offset-4"
                  >
                    Learn more
                  </button>
                </div>
              </div>

              <FlowArrow />

              <div
                id="workflow-step-fulfill"
                data-focused={focusedStep === "fulfill"}
                className={`${stageClass} scroll-mt-24`}
                onMouseEnter={() => hoverStep("fulfill")}
                onMouseLeave={() => hoverStep(null)}
              >
                <StepLabel>03 · Fulfill</StepLabel>
                <div className="rounded-xl bg-[var(--field-bg)] p-3">
                  <p className="mb-3 text-[0.53rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                    Automated service execution
                  </p>
                  <div className="grid grid-cols-[1fr_auto_0.9fr_auto_1fr] items-center gap-1.5">
                    <CompactNode
                      active={false}
                      kind="interface"
                      className="min-w-0 p-2.5"
                    >
                      <WindowHeader>Client Portal Onboarding</WindowHeader>
                      <div className="space-y-1.5">
                        <div className="h-5 border border-[var(--card-border)] bg-[var(--card-bg)]" />
                        <div className="h-5 border border-[var(--card-border)] bg-[var(--card-bg)]" />
                      </div>
                      <p className="mt-2 text-[0.5rem] text-[var(--muted-text)]">Inputs + start</p>
                    </CompactNode>

                    <span className="text-sm text-[var(--muted-text)]" aria-hidden="true">→</span>

                    <CompactNode
                      active={focusedStep === "fulfill"}
                      kind="action"
                      tone="workflow"
                      className="min-w-0 p-2.5"
                    >
                      <p className="text-[0.46rem] uppercase tracking-[0.11em] opacity-70">Execution</p>
                      <p className="mt-1 font-display text-lg leading-none">Workflow</p>
                      <p className="mt-1 text-[0.46rem] opacity-70">check → deliver</p>
                    </CompactNode>

                    <span className="text-sm text-[var(--muted-text)]" aria-hidden="true">→</span>

                    <CompactNode
                      active={false}
                      kind="interface"
                      className="min-w-0 p-2.5"
                    >
                      <WindowHeader>Result</WindowHeader>
                      <div className="h-8 border border-dashed border-[var(--field-border-focus)] bg-[var(--field-bg)]" />
                      <div className="mt-2 grid grid-cols-2 gap-1 text-center text-[0.43rem] uppercase">
                        <span className="border border-[var(--field-border-focus)] py-1">Revise</span>
                        <span className="bg-[var(--btn-bg)] py-1 text-[var(--btn-text)]">Accept</span>
                      </div>
                    </CompactNode>
                  </div>

                  <div className="mt-3 border-t border-dashed border-[var(--field-border-focus)] pt-2.5">
                    <p className="text-center text-[0.55rem] font-semibold text-[var(--muted-text)]">
                      ← Revise returns to the Execution Workflow
                    </p>
                    <p className="mt-1 text-center text-[0.52rem] text-[var(--muted-text)]">
                      Accept → Result delivered → ready for the next client ↻
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStep("fulfill")}
                  aria-controls="workflow-step-popover"
                  aria-expanded={selectedStep === "fulfill"}
                  className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] underline decoration-current/25 underline-offset-4"
                >
                  Learn more
                </button>
              </div>

              <FlowArrow />

              <div
                id="workflow-step-improve"
                data-focused={focusedStep === "improve"}
                className={`${stageClass} scroll-mt-24`}
                onMouseEnter={() => hoverStep("improve")}
                onMouseLeave={() => hoverStep(null)}
              >
                <StepLabel>04 · Improve</StepLabel>
                <CompactNode
                  active={focusedStep === "improve"}
                  kind="interface"
                  className="p-3"
                >
                  <WindowHeader>Skilldwork Platform</WindowHeader>
                  <div className="relative mt-6 rounded-md border border-[var(--card-border)] bg-[var(--field-bg)] p-3 pt-12">
                    <span className="absolute left-3 top-3 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-[0.44rem] font-semibold uppercase tracking-wide text-[var(--muted-text)]">
                      Built in
                    </span>
                    <div
                      data-active={focusedStep === "improve"}
                      className={`${activeClass} absolute -right-2 -top-6 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[var(--workflow-blue)] p-2 text-center text-white shadow-lg`}
                    >
                      <p className="font-display text-base leading-none">Revision Agent</p>
                      <p className="mt-1 text-[0.42rem] uppercase tracking-wide opacity-75">Platform agent</p>
                    </div>
                    <p className="text-[0.5rem] uppercase tracking-[0.12em] text-[var(--muted-text)]">
                      Suggested improvement
                    </p>
                    <p className="mt-1 text-[0.62rem] font-semibold">Workflow v2 ready to review</p>
                    <div
                      className="mt-3 inline-flex bg-[var(--workflow-accent)] px-2.5 py-1.5 text-[0.48rem] font-semibold uppercase tracking-wider text-black"
                    >
                      Review & apply
                    </div>
                  </div>
                  <p className="mt-3 text-center text-[0.52rem] text-[var(--muted-text)]">
                    ↶ Approved update returns to Execution
                  </p>
                </CompactNode>
                <button
                  type="button"
                  onClick={() => toggleStep("improve")}
                  aria-controls="workflow-step-popover"
                  aria-expanded={selectedStep === "improve"}
                  className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] underline decoration-current/25 underline-offset-4"
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-[var(--field-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[var(--text)] sm:text-sm">
              You create demand. Skilldwork coordinates delivery and makes approved improvements reusable.
            </p>
            <a
              href="#book"
              className="shrink-0 rounded-full bg-[var(--btn-bg)] px-5 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)]"
            >
              Build my workflow
            </a>
          </div>
        </div>

        {visibleStep ? (
          <StepPopover
            announce={isMobile && selectedStep === null}
            interactive={selectedStep !== null}
            onClose={() => setSelectedStep(null)}
            step={visibleStep}
          />
        ) : null}
      </div>
    </section>
  );
}
