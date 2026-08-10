"use client";

import { useEffect, useState, type ReactNode } from "react";

type NodeId =
  | "build"
  | "marketing"
  | "sales"
  | "portal"
  | "workflow"
  | "review"
  | "platform"
  | "approval"
  | "complete";

type DetailId =
  | "build"
  | "market"
  | "sales"
  | "portal"
  | "run"
  | "revision"
  | "improve"
  | "approve"
  | "complete";

type AnimationFrame = {
  node: NodeId;
  detail: DetailId;
  message: string;
  run?: 1 | 2;
  revision?: number;
  delay?: number;
};

type Detail = {
  eyebrow: string;
  title: string;
  body: string;
};

const DETAILS: Record<DetailId, Detail> = {
  build: {
    eyebrow: "01 · Build",
    title: "Your service becomes a digital system.",
    body: "We map the service, build the result-based Sales Page, and connect the workflow that will deliver it.",
  },
  market: {
    eyebrow: "02 · Market · handled by you",
    title: "You create demand and share one link.",
    body: "Your content, outreach, and relationships bring the right clients to the Sales Page. Everything after purchase is connected.",
  },
  sales: {
    eyebrow: "Sales Page · client interface",
    title: "The client buys a result, not a vague package.",
    body: "The page explains the outcome, shows result-based Offers, and starts the service as soon as the client buys.",
  },
  portal: {
    eyebrow: "03 · Fulfill · client portal",
    title: "Inputs, status, results, and revisions live in one place.",
    body: "The Client Portal collects what the workflow needs and keeps the client informed without extra email coordination.",
  },
  run: {
    eyebrow: "Automated service execution",
    title: "The workflow performs the repeatable work.",
    body: "The system processes the service from input to result. Human input is only requested for exceptions or decisions you choose.",
  },
  revision: {
    eyebrow: "Revision flow",
    title: "A revision returns directly to the workflow.",
    body: "The client requests a change inside the portal. The request, context, and previous result stay connected to the same Service Run.",
  },
  improve: {
    eyebrow: "04 · Improve · built into Skilldwork",
    title: "Revision intelligence works quietly inside the platform.",
    body: "Skilldwork captures revision patterns automatically and prepares a safer workflow improvement. There is no separate agent for you to set up or operate.",
  },
  approve: {
    eyebrow: "Provider workspace",
    title: "You only review meaningful workflow changes.",
    body: "A suggested update never changes the live workflow on its own. You can review and apply it in the same workspace when it is useful.",
  },
  complete: {
    eyebrow: "Result delivered",
    title: "The next client moves through a better system.",
    body: "Marketing brings in the next Service Run while approved improvements reduce avoidable revisions over time.",
  },
};

const TIMELINE: AnimationFrame[] = [
  {
    node: "build",
    detail: "build",
    message: "We build the Sales Page and service workflow.",
    delay: 2600,
  },
  {
    node: "marketing",
    detail: "market",
    message: "You market the result and share one link.",
    delay: 2400,
  },
  {
    node: "sales",
    detail: "sales",
    message: "Client 01 chooses an Offer and buys the result.",
    run: 1,
    delay: 2600,
  },
  {
    node: "portal",
    detail: "portal",
    message: "The Client Portal collects the required inputs.",
    run: 1,
    delay: 2600,
  },
  {
    node: "workflow",
    detail: "run",
    message: "Workflow v1 executes the repeatable service work.",
    run: 1,
    delay: 2800,
  },
  {
    node: "review",
    detail: "revision",
    message: "Client 01 requests one revision inside the portal.",
    run: 1,
    revision: 1,
    delay: 3000,
  },
  {
    node: "platform",
    detail: "improve",
    message: "Skilldwork captures the pattern and suggests workflow v2.",
    run: 1,
    delay: 3400,
  },
  {
    node: "approval",
    detail: "approve",
    message: "The Service Provider reviews and applies the useful change.",
    run: 1,
    delay: 3000,
  },
  {
    node: "complete",
    detail: "complete",
    message: "Service Run 01 is complete and workflow v2 is ready.",
    run: 1,
    delay: 2600,
  },
  {
    node: "marketing",
    detail: "market",
    message: "Marketing brings Client 02 into the same Service Loop.",
    run: 2,
    delay: 2400,
  },
  {
    node: "sales",
    detail: "sales",
    message: "Client 02 buys and starts the next Service Run.",
    run: 2,
    delay: 2400,
  },
  {
    node: "workflow",
    detail: "run",
    message: "Workflow v2 delivers without an avoidable revision.",
    run: 2,
    delay: 3000,
  },
  {
    node: "complete",
    detail: "complete",
    message: "Client 02 receives the result directly.",
    run: 2,
    delay: 3400,
  },
];

const FIRST_RUN_COMPLETE = TIMELINE.findIndex(
  (frame) => frame.run === 1 && frame.node === "complete",
);

const activeClass =
  "transition duration-500 data-[active=true]:-translate-y-1 data-[active=true]:ring-2 data-[active=true]:ring-[var(--text)] data-[active=true]:shadow-lg motion-reduce:transition-none";

function FlowArrow({ label }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-8 shrink-0 flex-col items-center justify-center text-[var(--muted-text)]"
    >
      {label ? (
        <span className="mb-0.5 text-[0.52rem] font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      ) : null}
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

type LearnMoreProps = {
  compact?: boolean;
  detail: DetailId;
  hoveredDetail: DetailId | null;
  label?: string;
  selectedDetail: DetailId | null;
  setHoveredDetail: (detail: DetailId | null) => void;
  setSelectedDetail: (detail: DetailId | null) => void;
};

function LearnMore({
  compact = false,
  detail,
  hoveredDetail,
  label = "Learn more",
  selectedDetail,
  setHoveredDetail,
  setSelectedDetail,
}: LearnMoreProps) {
  const expanded = selectedDetail === detail;

  return (
    <button
      type="button"
      aria-label={`Learn more about ${DETAILS[detail].eyebrow}`}
      aria-controls="workflow-detail"
      aria-expanded={expanded}
      onClick={() => setSelectedDetail(expanded ? null : detail)}
      onMouseEnter={() => setHoveredDetail(detail)}
      onMouseLeave={() => setHoveredDetail(hoveredDetail === detail ? null : hoveredDetail)}
      onFocus={() => setHoveredDetail(detail)}
      onBlur={() => setHoveredDetail(hoveredDetail === detail ? null : hoveredDetail)}
      className={`${compact ? "" : "mt-3"} text-[0.58rem] font-semibold uppercase tracking-[0.14em] underline decoration-current/25 underline-offset-4 transition hover:opacity-60`}
    >
      {expanded ? "Hide details" : label}
    </button>
  );
}

type CompactNodeProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
  kind: "action" | "interface";
  tone?: "dark" | "owner" | "surface";
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
    <p className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
      {children}
    </p>
  );
}

export default function WorkflowMap() {
  const [frameIndex, setFrameIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [hoveredDetail, setHoveredDetail] = useState<DetailId | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<DetailId | null>(null);
  const frame = frameIndex >= 0 ? TIMELINE[frameIndex] : null;
  const activeNode = frame?.node;
  const detailId = running
    ? frame?.detail ?? null
    : selectedDetail ?? hoveredDetail ?? frame?.detail ?? null;
  const detail = detailId ? DETAILS[detailId] : null;

  useEffect(() => {
    if (!running || !frame) return;

    const timeout = window.setTimeout(() => {
      if (frameIndex === TIMELINE.length - 1) {
        setRunning(false);
        return;
      }
      setFrameIndex((current) => current + 1);
    }, frame.delay ?? 2600);

    return () => window.clearTimeout(timeout);
  }, [frame, frameIndex, running]);

  function runFlow() {
    setSelectedDetail(null);
    setHoveredDetail(null);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrameIndex(TIMELINE.length - 1);
      setRunning(false);
      return;
    }
    setFrameIndex(0);
    setRunning(true);
  }

  function resetFlow() {
    setRunning(false);
    setFrameIndex(-1);
    setSelectedDetail(null);
    setHoveredDetail(null);
  }

  const learnMoreProps = {
    hoveredDetail,
    selectedDetail,
    setHoveredDetail,
    setSelectedDetail,
  };
  const runOneComplete = frameIndex >= FIRST_RUN_COMPLETE;
  const runTwoActive = frame?.run === 2;

  return (
    <section className="w-full px-4 pb-16 sm:px-6 sm:pb-20" aria-labelledby="workflow-title">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl shadow-black/10 dark:shadow-black/60">
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
              One connected platform turns your service into a repeatable, improving system.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={runFlow}
              disabled={running}
              className="rounded-full bg-[var(--btn-bg)] px-5 py-2.5 font-display text-xs uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)] disabled:cursor-wait disabled:opacity-55"
            >
              {running ? "Showing the flow…" : frameIndex >= 0 ? "Run again" : "Show client flow"}
            </button>
            {frameIndex >= 0 ? (
              <button
                type="button"
                onClick={resetFlow}
                className="rounded-full border border-[var(--field-border-focus)] px-4 py-2.5 font-display text-xs uppercase tracking-wider text-[var(--text)] transition hover:bg-[var(--field-bg)]"
              >
                Reset
              </button>
            ) : null}
          </div>
        </header>

        <div className="space-y-4 p-4 sm:p-6">
          <div
            id="workflow-detail"
            className={`grid min-h-28 gap-3 rounded-xl border px-4 py-3 transition sm:grid-cols-[1fr_auto] sm:items-center sm:px-5 ${
              detail
                ? "border-[var(--field-border-focus)] bg-[var(--field-bg)]"
                : "border-[var(--card-border)] bg-transparent"
            }`}
            aria-live="polite"
          >
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                {frame?.run ? `Service Run 0${frame.run}` : detail?.eyebrow ?? "Explore the system"}
                {frame?.revision ? ` · Revision ${frame.revision}` : ""}
              </p>
              <p className="mt-1 font-display text-xl leading-tight text-[var(--text)] sm:text-2xl">
                {detail?.title ?? "Hover or select Learn more — or play the guided client flow."}
              </p>
              <p className="mt-1.5 max-w-4xl text-xs leading-5 text-[var(--muted-text)] sm:text-sm">
                {running && frame ? frame.message : detail?.body ?? "The core workflow stays visible while extra context appears here."}
              </p>
              {running && detail ? (
                <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">{detail.body}</p>
              ) : null}
            </div>

            <div className="flex shrink-0 gap-2 text-[0.62rem]">
              <span
                className={`rounded-full border px-2.5 py-1 ${
                  frame?.run === 1
                    ? "border-[var(--text)] text-[var(--text)]"
                    : "border-[var(--card-border)] text-[var(--muted-text)]"
                }`}
              >
                Client 01 {runOneComplete ? "✓" : ""}
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 ${
                  runTwoActive
                    ? "border-[var(--text)] text-[var(--text)]"
                    : "border-[var(--card-border)] text-[var(--muted-text)]"
                }`}
              >
                Client 02 {frameIndex === TIMELINE.length - 1 ? "✓" : ""}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--field-border-focus)] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                Skilldwork service system
              </p>
              <div className="flex flex-wrap gap-3 text-[0.62rem] text-[var(--muted-text)]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--btn-bg)]" /> Action / workflow
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-3.5 border border-[var(--field-border-focus)]" /> Page / app
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--workflow-accent)]" /> Handled by you
                </span>
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-[0.8fr_1.25rem_0.95fr_1.25rem_2.25fr_1.25rem_1.25fr] xl:items-center">
              <div className="flex flex-col items-center">
                <StepLabel>01 · Build</StepLabel>
                <CompactNode
                  active={activeNode === "build"}
                  kind="action"
                  tone="dark"
                  className="w-full max-w-40"
                >
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] opacity-55">
                    Start here
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-none">Build your workflow</h3>
                  <p className="mt-2 text-[0.62rem] opacity-60">Sales Page + delivery system</p>
                  <LearnMore detail="build" {...learnMoreProps} />
                </CompactNode>
                <a
                  href="#book"
                  className="mt-3 rounded-full border border-[var(--field-border-focus)] px-3 py-1.5 font-display text-[0.6rem] uppercase tracking-wider transition hover:bg-[var(--field-bg)]"
                >
                  Book a call
                </a>
              </div>

              <FlowArrow />

              <div className="flex flex-col items-center">
                <StepLabel>02 · Market</StepLabel>
                <CompactNode
                  active={activeNode === "marketing"}
                  kind="action"
                  tone="owner"
                  className="w-full max-w-36"
                >
                  <h3 className="font-display text-2xl">Marketing</h3>
                  <p className="mt-1 text-[0.6rem] opacity-65">Create demand</p>
                  <LearnMore detail="market" {...learnMoreProps} />
                </CompactNode>
                <span className="my-1 text-sm text-[var(--muted-text)]" aria-hidden="true">↓</span>
                <CompactNode
                  active={activeNode === "sales"}
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
                  <LearnMore detail="sales" {...learnMoreProps} />
                </CompactNode>
              </div>

              <FlowArrow label="purchase" />

              <div>
                <StepLabel>03 · Fulfill</StepLabel>
                <div className="rounded-xl bg-[var(--field-bg)] p-3">
                  <p className="mb-3 text-[0.53rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                    Automated service execution
                  </p>
                  <div className="grid grid-cols-[1fr_auto_0.9fr_auto_1fr] items-center gap-1.5">
                    <CompactNode
                      active={activeNode === "portal"}
                      kind="interface"
                      className="min-w-0 p-2.5"
                    >
                      <WindowHeader>Client Portal</WindowHeader>
                      <div className="space-y-1.5">
                        <div className="h-5 border border-[var(--card-border)] bg-[var(--card-bg)]" />
                        <div className="h-5 border border-[var(--card-border)] bg-[var(--card-bg)]" />
                      </div>
                      <p className="mt-2 text-[0.5rem] text-[var(--muted-text)]">Inputs + status</p>
                    </CompactNode>

                    <span className="text-sm text-[var(--muted-text)]" aria-hidden="true">→</span>

                    <CompactNode
                      active={activeNode === "workflow"}
                      kind="action"
                      tone="dark"
                      className="min-w-0 p-2.5"
                    >
                      <p className="text-[0.48rem] uppercase tracking-[0.12em] opacity-55">Workflow</p>
                      <p className="mt-1 font-display text-xl">Execute</p>
                      <p className="mt-1 text-[0.48rem] opacity-60">check → deliver</p>
                    </CompactNode>

                    <span className="text-sm text-[var(--muted-text)]" aria-hidden="true">→</span>

                    <CompactNode
                      active={activeNode === "review" || activeNode === "complete"}
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
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--card-border)] pt-2.5">
                    <p className="text-[0.55rem] text-[var(--muted-text)]">
                      Revision ↺ stays connected to the Service Run
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted-text)]">
                        Learn more:
                      </span>
                      <LearnMore compact detail="portal" label="Inputs" {...learnMoreProps} />
                      <LearnMore compact detail="run" label="Execution" {...learnMoreProps} />
                      <LearnMore compact detail="revision" label="Revisions" {...learnMoreProps} />
                    </div>
                  </div>
                </div>
              </div>

              <FlowArrow label="feedback" />

              <div>
                <StepLabel>04 · Improve</StepLabel>
                <CompactNode
                  active={activeNode === "platform" || activeNode === "approval"}
                  kind="interface"
                  className="p-3"
                >
                  <WindowHeader>Skilldwork Platform</WindowHeader>
                  <div className="rounded-md border border-[var(--card-border)] bg-[var(--field-bg)] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display text-lg leading-none">Revision intelligence</p>
                      <span className="rounded-full bg-[var(--workflow-accent)] px-2 py-1 text-[0.44rem] font-semibold uppercase tracking-wide text-black">
                        Built in
                      </span>
                    </div>
                    <p className="mt-2 text-[0.58rem] leading-4 text-[var(--muted-text)]">
                      Feedback captured automatically
                    </p>
                    <div className="mt-2 rounded border border-[var(--card-border)] bg-[var(--card-bg)] p-2">
                      <p className="text-[0.48rem] uppercase tracking-[0.12em] text-[var(--muted-text)]">
                        Suggested improvement
                      </p>
                      <p className="mt-1 text-[0.62rem] font-semibold">Workflow v2 ready to review</p>
                    </div>
                    <div className="mt-2 inline-flex bg-[var(--btn-bg)] px-2.5 py-1.5 text-[0.48rem] font-semibold uppercase tracking-wider text-[var(--btn-text)]">
                      Review & apply
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted-text)]">
                      Learn more:
                    </span>
                    <LearnMore compact detail="improve" label="Platform" {...learnMoreProps} />
                    <LearnMore compact detail="approve" label="Approval" {...learnMoreProps} />
                  </div>
                </CompactNode>
              </div>
            </div>

            <div className="mt-4 grid gap-2 border-t border-[var(--card-border)] pt-3 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-3 rounded-lg bg-[var(--field-bg)] px-3 py-2 text-[0.6rem]">
                <span className="font-semibold uppercase tracking-[0.13em] text-[var(--muted-text)]">
                  Service Loop
                </span>
                <span>02 Market ↔ 03 Fulfill</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-[var(--field-bg)] px-3 py-2 text-[0.6rem]">
                <span className="font-semibold uppercase tracking-[0.13em] text-[var(--muted-text)]">
                  Improvement Loop
                </span>
                <span>03 Feedback → 04 Platform → 03 Next run</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-[var(--field-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[var(--text)] sm:text-sm">
              You market the service. Skilldwork coordinates delivery and learns from revisions.
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
