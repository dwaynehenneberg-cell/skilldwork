"use client";

import { useEffect, useState, type ReactNode } from "react";

const STEP_ORDER = ["build", "market", "fulfill", "improve"] as const;
type StepId = (typeof STEP_ORDER)[number];

const STEP_SUMMARY: Record<StepId, string> = {
  build: "We connect your Sales Page, Client Portal, and repeatable delivery workflow.",
  market: "You create demand and send clients to one result-based Sales Page.",
  fulfill: "Each order moves from onboarding to execution, review, and delivery.",
  improve: "Completed runs improve the workflow used for the next client.",
};

const activeClass =
  "transition duration-300 data-[active=true]:-translate-y-1 data-[active=true]:ring-2 data-[active=true]:ring-[var(--text)] data-[active=true]:shadow-lg motion-reduce:transition-none";
const stageClass =
  "relative -m-2 rounded-xl p-2 transition duration-300 data-[focused=true]:bg-[var(--field-bg)] data-[focused=true]:ring-1 data-[focused=true]:ring-[var(--field-border-focus)] md:data-[focused=true]:z-10 md:data-[focused=true]:scale-[1.025] motion-reduce:transition-none";

function FlowArrow({ label }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-10 shrink-0 flex-col items-center justify-center gap-0.5 text-center text-[var(--muted-text)]"
    >
      {label ? (
        <span className="max-w-20 text-[0.46rem] font-semibold uppercase tracking-[0.1em]">
          {label}
        </span>
      ) : null}
      <span className="rotate-90 text-xl xl:rotate-0">→</span>
    </div>
  );
}

function InnerArrow() {
  return (
    <span
      className="rotate-90 text-center text-sm text-[var(--muted-text)] sm:rotate-0"
      aria-hidden="true"
    >
      →
    </span>
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

function ReturnRail({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative mt-2 flex h-11 items-end justify-center rounded-b-xl border-x border-b border-[var(--workflow-blue)] px-8 pb-1.5 text-center text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-[var(--muted-text)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -left-1 -top-2 text-lg leading-none text-[var(--workflow-blue)]"
      >
        ↑
      </span>
      {children}
    </div>
  );
}

type StepFooterProps = {
  onNavigate: (step: StepId, direction: -1 | 1) => void;
  step: StepId;
};

function StepFooter({ onNavigate, step }: StepFooterProps) {
  const index = STEP_ORDER.indexOf(step);

  return (
    <div className="mt-3 border-t border-[var(--card-border)] pt-3">
      <p className="text-xs leading-5 text-[var(--muted-text)]">{STEP_SUMMARY[step]}</p>
      <nav
        aria-label={`${step} step navigation`}
        className="mt-3 flex items-center justify-between md:hidden"
      >
        <button
          type="button"
          onClick={() => onNavigate(step, -1)}
          disabled={index === 0}
          aria-label="Previous step"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--field-border-focus)] text-lg text-[var(--text)] transition disabled:cursor-not-allowed disabled:opacity-25"
        >
          ←
        </button>
        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
          {index + 1} / {STEP_ORDER.length}
        </span>
        <button
          type="button"
          onClick={() => onNavigate(step, 1)}
          disabled={index === STEP_ORDER.length - 1}
          aria-label="Next step"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--field-border-focus)] text-lg text-[var(--text)] transition disabled:cursor-not-allowed disabled:opacity-25"
        >
          →
        </button>
      </nav>
    </div>
  );
}

export default function WorkflowMap() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveStep, setMobileActiveStep] = useState<StepId | null>(null);
  const [hoveredStep, setHoveredStep] = useState<StepId | null>(null);
  const focusedStep = isMobile ? mobileActiveStep : hoveredStep;

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
          sectionRect.top > viewportHeight * 0.85 ||
          sectionRect.bottom < viewportHeight * 0.2
        ) {
          setMobileActiveStep(null);
          return;
        }

        const steps = STEP_ORDER.map((step) => {
          const element = document.getElementById(`workflow-step-${step}`);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          const isVisible = rect.bottom > viewportHeight * 0.15 && rect.top < viewportHeight * 0.8;
          if (!isVisible) return null;
          return {
            step,
            distance: Math.abs((rect.top + rect.bottom) / 2 - viewportHeight * 0.45),
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

  function hoverStep(step: StepId | null) {
    if (!isMobile) setHoveredStep(step);
  }

  function navigateStep(step: StepId, direction: -1 | 1) {
    const target = STEP_ORDER[STEP_ORDER.indexOf(step) + direction];
    if (!target) return;
    setMobileActiveStep(target);
    document.getElementById(`workflow-step-${target}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
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
            <span className="md:hidden">Scroll or use the arrows</span>
            <span className="hidden md:inline">Hover to focus</span>
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
                onFocusCapture={() => hoverStep("build")}
                onBlurCapture={() => hoverStep(null)}
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
                </div>
                <StepFooter onNavigate={navigateStep} step="build" />
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
                  <CompactNode active={false} kind="interface" className="w-full max-w-48 p-3">
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
                </div>
                <StepFooter onNavigate={navigateStep} step="market" />
              </div>

              <FlowArrow label="Client starts service" />

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
                  <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto_0.9fr_auto_1fr]">
                    <CompactNode active={false} kind="interface" className="min-w-0 p-2.5">
                      <WindowHeader>Client Portal</WindowHeader>
                      <div className="space-y-1.5">
                        <div className="h-5 border border-[var(--card-border)] bg-[var(--card-bg)]" />
                        <div className="h-5 border border-[var(--card-border)] bg-[var(--card-bg)]" />
                      </div>
                      <div className="mt-2 bg-[var(--btn-bg)] py-1.5 text-center text-[0.48rem] font-semibold uppercase tracking-wider text-[var(--btn-text)]">
                        Start service
                      </div>
                    </CompactNode>

                    <InnerArrow />

                    <CompactNode
                      active={focusedStep === "fulfill"}
                      kind="action"
                      tone="workflow"
                      className="mx-auto min-w-0 max-w-36 p-2.5 sm:max-w-none"
                    >
                      <p className="text-[0.46rem] uppercase tracking-[0.11em] opacity-70">Execution</p>
                      <p className="mt-1 font-display text-lg leading-none">Workflow</p>
                      <p className="mt-1 text-[0.46rem] opacity-70">check → deliver</p>
                    </CompactNode>

                    <InnerArrow />

                    <CompactNode active={false} kind="interface" className="min-w-0 p-2.5">
                      <WindowHeader>Result</WindowHeader>
                      <div className="h-8 border border-dashed border-[var(--field-border-focus)] bg-[var(--field-bg)]" />
                      <div className="mt-2 grid grid-cols-2 gap-1 text-center text-[0.43rem] uppercase">
                        <span className="border border-[var(--field-border-focus)] py-1">↶ Revise</span>
                        <span className="bg-[var(--btn-bg)] py-1 text-[var(--btn-text)]">Accept →</span>
                      </div>
                    </CompactNode>

                    <ReturnRail className="sm:col-start-3 sm:col-end-6">
                      Revision reruns the workflow
                    </ReturnRail>
                  </div>
                </div>
                <StepFooter onNavigate={navigateStep} step="fulfill" />
              </div>

              <FlowArrow label="Completed run" />

              <div
                id="workflow-step-improve"
                data-focused={focusedStep === "improve"}
                className={`${stageClass} scroll-mt-24`}
                onMouseEnter={() => hoverStep("improve")}
                onMouseLeave={() => hoverStep(null)}
              >
                <StepLabel>04 · Improve</StepLabel>
                <div className="flex flex-col items-center">
                  <CompactNode
                    active={focusedStep === "improve"}
                    kind="action"
                    tone="workflow"
                    className="w-full max-w-36"
                  >
                    <p className="text-[0.48rem] uppercase tracking-[0.12em] opacity-70">Completed runs</p>
                    <h3 className="mt-2 font-display text-xl leading-none">Improvement Agent</h3>
                    <p className="mt-2 text-[0.5rem] opacity-75">Finds reusable improvements</p>
                  </CompactNode>
                  <span className="my-1 text-sm text-[var(--muted-text)]" aria-hidden="true">↓</span>
                  <div className="bg-[var(--workflow-accent)] px-3 py-2 text-center text-[0.5rem] font-semibold uppercase tracking-wider text-black">
                    Review &amp; apply
                  </div>
                  <ReturnRail className="w-full xl:hidden">
                    Improved workflow feeds the next run
                  </ReturnRail>
                </div>
                <StepFooter onNavigate={navigateStep} step="improve" />
              </div>
            </div>

            <div className="mt-1 hidden xl:grid xl:grid-cols-[0.75fr_1.25rem_0.95fr_1.25rem_2.35fr_1.25rem_1.35fr]">
              <ReturnRail className="col-start-5 col-end-8">
                Approved improvement returns to the Execution Workflow
              </ReturnRail>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-[var(--field-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[var(--text)] sm:text-sm">
              You create demand. Skilldwork delivers each service and improves the next run.
            </p>
            <a
              href="#book"
              className="shrink-0 rounded-full bg-[var(--btn-bg)] px-5 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)]"
            >
              Build my workflow
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
