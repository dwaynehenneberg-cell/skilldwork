"use client";

import { useEffect, useState, type ReactNode } from "react";

type NodeId =
  | "build"
  | "marketing"
  | "sales"
  | "onboarding"
  | "status"
  | "workflow"
  | "hitl"
  | "review"
  | "complete"
  | "improve"
  | "suggestion"
  | "approval";

type AnimationFrame = {
  node: NodeId;
  message: string;
  run?: 1 | 2;
  revision?: number;
  delay?: number;
};

const TIMELINE: AnimationFrame[] = [
  { node: "build", message: "First, we build the Sales Page and service workflow." },
  { node: "marketing", message: "The Service Provider markets the result." },
  { node: "sales", message: "Client 01 follows the link, chooses an Offer, and buys.", run: 1 },
  { node: "onboarding", message: "The Client Portal collects the required inputs.", run: 1 },
  { node: "status", message: "The client can follow the service status.", run: 1 },
  { node: "workflow", message: "Workflow v1 executes the service.", run: 1 },
  { node: "hitl", message: "A special case needs optional human input.", run: 1 },
  { node: "review", message: "Client 01 requests revision 1.", run: 1, revision: 1, delay: 650 },
  { node: "workflow", message: "The revision returns to the workflow.", run: 1, revision: 1, delay: 650 },
  { node: "review", message: "Client 01 requests revision 2.", run: 1, revision: 2, delay: 650 },
  { node: "workflow", message: "The workflow creates the next version.", run: 1, revision: 2, delay: 650 },
  { node: "review", message: "Client 01 requests revision 3.", run: 1, revision: 3, delay: 650 },
  { node: "workflow", message: "The workflow creates the final version.", run: 1, revision: 3, delay: 650 },
  { node: "review", message: "The result is accepted after three revisions.", run: 1 },
  { node: "complete", message: "Service Run 01 is complete.", run: 1 },
  { node: "improve", message: "Revision feedback enters the Improvement Loop." },
  { node: "suggestion", message: "The Self-Improvement Agent suggests workflow v2." },
  { node: "approval", message: "The Service Provider applies the approved update." },
  { node: "marketing", message: "The improved service returns to the Service Loop." },
  { node: "sales", message: "Client 02 starts the next Service Run.", run: 2 },
  { node: "onboarding", message: "Onboarding starts the workflow automatically.", run: 2 },
  { node: "workflow", message: "Workflow v2 executes with what it learned.", run: 2 },
  { node: "complete", message: "Service Run 02 completes without a revision.", run: 2 },
];

const FIRST_RUN_COMPLETE = TIMELINE.findIndex(
  (frame) => frame.run === 1 && frame.node === "complete",
);
const animatedNodeClass =
  "transition duration-500 data-[active=true]:-translate-y-1 data-[active=true]:ring-2 data-[active=true]:ring-[var(--text)] data-[active=true]:shadow-xl motion-reduce:transition-none";

function FlowArrow({ label }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-10 flex-col items-center justify-center text-[var(--muted-text)]"
    >
      {label ? <span className="mb-1 text-[0.6rem] uppercase tracking-[0.14em]">{label}</span> : null}
      <span className="rotate-90 text-2xl xl:rotate-0">→</span>
    </div>
  );
}

function VerticalConnector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-3 text-[var(--muted-text)]" aria-hidden="true">
      <span className="h-8 w-px bg-[var(--field-border-focus)]" />
      <span className="my-1 text-lg">↓</span>
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em]">{label}</span>
    </div>
  );
}

function WindowHeader({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-[var(--card-border)] pb-3">
      <span className="h-2 w-2 rounded-full bg-current opacity-20" />
      <span className="h-2 w-2 rounded-full bg-current opacity-20" />
      <span className="h-2 w-2 rounded-full bg-current opacity-20" />
      <span className="ml-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] opacity-55">
        {children}
      </span>
    </div>
  );
}

type DiagramNodeProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
  kind: "action" | "interface";
  tone?: "dark" | "owner" | "surface";
};

function DiagramNode({
  active,
  children,
  className = "",
  kind,
  tone = "surface",
}: DiagramNodeProps) {
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
      className={`${animatedNodeClass} ${shapeClass} ${toneClass} border p-5 ${className}`}
    >
      {children}
    </article>
  );
}

export default function WorkflowMap() {
  const [frameIndex, setFrameIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const frame = frameIndex >= 0 ? TIMELINE[frameIndex] : null;
  const activeNode = frame?.node;

  useEffect(() => {
    if (!running || !frame) return;

    const timeout = window.setTimeout(() => {
      if (frameIndex === TIMELINE.length - 1) {
        setRunning(false);
        return;
      }
      setFrameIndex((current) => current + 1);
    }, frame.delay ?? 950);

    return () => window.clearTimeout(timeout);
  }, [frame, frameIndex, running]);

  function runFlow() {
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
  }

  const runOneComplete = frameIndex >= FIRST_RUN_COMPLETE;
  const runTwoActive = frame?.run === 2;

  return (
    <section className="w-full px-4 pb-20 sm:px-6 sm:pb-28" aria-labelledby="workflow-title">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl shadow-black/10 dark:shadow-black/60">
        <header className="grid gap-7 border-b border-[var(--card-border)] p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
              How it works
            </p>
            <h2
              id="workflow-title"
              className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-[var(--text)] sm:text-6xl"
            >
              Build. Market. Fulfill. Improve.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-text)] sm:text-lg">
              Four connected steps turn your service into a system that delivers and gets better
              with every client.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <button
              type="button"
              onClick={runFlow}
              disabled={running}
              className="rounded-full bg-[var(--btn-bg)] px-5 py-3 font-display text-xs uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)] disabled:cursor-wait disabled:opacity-55"
            >
              {running ? "Running flow…" : frameIndex >= 0 ? "Run again" : "Run client flow"}
            </button>
            {frameIndex >= 0 ? (
              <button
                type="button"
                onClick={resetFlow}
                className="rounded-full border border-[var(--field-border-focus)] px-5 py-3 font-display text-xs uppercase tracking-wider text-[var(--text)] transition hover:bg-[var(--field-bg)]"
              >
                Reset
              </button>
            ) : null}
          </div>
        </header>

        <div className="space-y-5 p-6 sm:p-10">
          <div
            className="flex min-h-16 flex-col gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--field-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            aria-live="polite"
          >
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                {frame?.run ? `Service Run 0${frame.run}` : "Workflow system"}
                {frame?.revision ? ` · Revision ${frame.revision}` : ""}
              </p>
              <p className="mt-1 text-sm text-[var(--text)]">
                {frame?.message ?? "Start the animation to follow two clients through the system."}
              </p>
            </div>
            <div className="flex shrink-0 gap-2 text-xs">
              <span
                className={`rounded-full border px-3 py-1.5 ${
                  frame?.run === 1
                    ? "border-[var(--text)] text-[var(--text)]"
                    : "border-[var(--card-border)] text-[var(--muted-text)]"
                }`}
              >
                Client 01 {runOneComplete ? "✓" : ""}
              </span>
              <span
                className={`rounded-full border px-3 py-1.5 ${
                  runTwoActive
                    ? "border-[var(--text)] text-[var(--text)]"
                    : "border-[var(--card-border)] text-[var(--muted-text)]"
                }`}
              >
                Client 02 {frameIndex === TIMELINE.length - 1 ? "✓" : ""}
              </span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <DiagramNode active={activeNode === "build"} kind="action" tone="dark">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-55">
                01 · Start here
              </p>
              <h3 className="mt-4 font-display text-3xl leading-none sm:text-4xl">
                Build your workflow
              </h3>
              <p className="mt-4 max-w-64 text-sm leading-6 opacity-70">
                We create your result-based Sales Page and automatable service workflow.
              </p>
              <a
                href="#book"
                className="mt-5 rounded-full bg-[var(--btn-text)] px-5 py-2.5 font-display text-xs uppercase tracking-wider text-[var(--btn-bg)] transition hover:opacity-80"
              >
                Book a call
              </a>
            </DiagramNode>
          </div>

          <VerticalConnector label="System ready" />

          <div className="rounded-2xl border-2 border-[var(--field-border-focus)] p-4 sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                  The Service Loop · repeats for every client
                </p>
                <p className="mt-1 text-sm text-[var(--text)]">
                  Marketing creates demand. Fulfillment delivers the result.
                </p>
              </div>
              <span className="font-display text-4xl text-[var(--text)]" aria-hidden="true">↻</span>
            </div>

            <div className="grid items-center xl:grid-cols-[0.75fr_2.5rem_1.2fr]">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                  02 · Market · handled by you
                </p>
                <DiagramNode active={activeNode === "marketing"} kind="action" tone="owner">
                  <h3 className="font-display text-4xl leading-none">Marketing</h3>
                  <p className="mt-3 max-w-48 text-sm leading-6 opacity-70">
                    Content, outreach, and relationships create demand.
                  </p>
                  <span className="mt-4 rounded-full border border-black/15 bg-white/25 px-4 py-2 text-xs font-medium">
                    Share your link
                  </span>
                </DiagramNode>
              </div>

              <FlowArrow label="link" />

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                  Entry into the service
                </p>
                <DiagramNode active={activeNode === "sales"} kind="interface">
                  <WindowHeader>Sales Page · Client UI</WindowHeader>
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <div>
                      <div className="h-20 bg-[var(--field-bg)]" />
                      <div className="mt-3 h-2 w-full bg-[var(--field-bg)]" />
                      <div className="mt-2 h-2 w-4/5 bg-[var(--field-bg)]" />
                      <div className="mt-2 h-2 w-3/5 bg-[var(--field-bg)]" />
                    </div>
                    <div className="space-y-2 text-[0.65rem] uppercase tracking-wide">
                      {["Offer 1", "Offer 2", "Offer 3"].map((offer) => (
                        <div key={offer} className="border border-[var(--field-border-focus)] px-3 py-2">
                          {offer}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <span className="bg-[var(--btn-bg)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--btn-text)]">
                      Buy
                    </span>
                  </div>
                </DiagramNode>
              </div>
            </div>

            <VerticalConnector label="Purchase starts fulfillment" />

            <div>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                    03 · Fulfill · automated service execution
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-[var(--text)]">
                    One connected system delivers the result.
                  </h3>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-text)]">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[var(--btn-bg)]" /> Action or workflow
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-4 border border-[var(--field-border-focus)] bg-[var(--card-bg)]" />
                    Page or web app
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[var(--workflow-accent)]" /> Service Provider
                  </span>
                </div>
              </div>

              <div className="grid items-center xl:grid-cols-[1fr_2rem_0.9fr_2rem_1fr_2rem_1fr_2rem_0.78fr]">
                <DiagramNode active={activeNode === "onboarding"} kind="interface">
                  <WindowHeader>Client Portal · Onboarding</WindowHeader>
                  <div className="mb-3 h-2 w-4/5 bg-[var(--field-bg)]" />
                  <div className="space-y-2">
                    <div className="h-8 border border-[var(--card-border)] bg-[var(--field-bg)]" />
                    <div className="h-8 border border-[var(--card-border)] bg-[var(--field-bg)]" />
                    <div className="h-8 border border-[var(--card-border)] bg-[var(--field-bg)]" />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="bg-[var(--btn-bg)] px-3 py-2 text-[0.6rem] uppercase tracking-wider text-[var(--btn-text)]">
                      Start service
                    </span>
                  </div>
                </DiagramNode>

                <FlowArrow />

                <DiagramNode active={activeNode === "status"} kind="interface" className="self-stretch">
                  <WindowHeader>Client Portal · Status</WindowHeader>
                  <p className="text-xs leading-5 text-[var(--muted-text)]">
                    We will notify you if the workflow needs more information.
                  </p>
                  <p className="mt-5 font-display text-3xl leading-none">In progress</p>
                  <p className="mt-5 flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full bg-[var(--workflow-accent)]" /> Result in about 1 hour
                  </p>
                </DiagramNode>

                <FlowArrow />

                <div className="relative mx-auto w-full max-w-64 pb-8">
                  <DiagramNode
                    active={activeNode === "workflow" || activeNode === "hitl"}
                    kind="action"
                    tone="dark"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-55">
                      n8n workflow
                    </p>
                    <p className="mt-4 font-display text-4xl">Execute</p>
                    <p className="mt-2 text-xs opacity-60">Build → check → deliver</p>
                  </DiagramNode>
                  <div
                    data-active={activeNode === "hitl"}
                    className={`${animatedNodeClass} absolute bottom-0 right-0 rounded-full bg-[var(--workflow-accent)] px-4 py-2.5 text-center text-black shadow-lg`}
                  >
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em]">HITL · when needed</p>
                  </div>
                </div>

                <FlowArrow />

                <DiagramNode active={activeNode === "review"} kind="interface">
                  <WindowHeader>Client Portal · Result</WindowHeader>
                  <p className="text-xs font-semibold">Version ready — review result</p>
                  <div className="my-4 h-20 border border-dashed border-[var(--field-border-focus)] bg-[var(--field-bg)]" />
                  <div className="grid grid-cols-2 gap-2 text-center text-[0.6rem] uppercase tracking-wider">
                    <span className="border border-[var(--field-border-focus)] px-2 py-2">Revise</span>
                    <span className="bg-[var(--btn-bg)] px-2 py-2 text-[var(--btn-text)]">Accept</span>
                  </div>
                  <p className="mt-3 text-center text-[0.65rem] text-[var(--muted-text)]">
                    Revision ↩ n8n workflow
                  </p>
                </DiagramNode>

                <FlowArrow />

                <DiagramNode active={activeNode === "complete"} kind="action">
                  <span className="text-2xl" aria-hidden="true">✓</span>
                  <p className="mt-2 font-display text-2xl leading-none">Result delivered</p>
                  <p className="mt-2 text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted-text)]">
                    Run complete
                  </p>
                </DiagramNode>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[var(--field-border-focus)] bg-[var(--field-bg)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl" aria-hidden="true">↺</span>
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                      Service Loop
                    </p>
                    <p className="mt-1 text-sm text-[var(--text)]">
                      Result delivered → more capacity → market to the next client
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                  Back to step 02 ↑
                </span>
              </div>
            </div>
          </div>

          <VerticalConnector label="Revision feedback" />

          <div className="rounded-2xl border border-dashed border-[var(--field-border-focus)] p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                04 · Improve · the Improvement Loop
              </p>
              <h3 className="mt-2 font-display text-3xl text-[var(--text)]">
                Every revision can improve the next run.
              </h3>
            </div>

            <div className="grid items-center xl:grid-cols-[1fr_2rem_0.85fr_2rem_1.15fr]">
              <DiagramNode active={activeNode === "improve"} kind="interface" className="self-stretch">
                <WindowHeader>Revision history · data</WindowHeader>
                <p className="font-display text-2xl">What caused the revisions?</p>
                <p className="mt-2 text-xs leading-5 text-[var(--muted-text)]">
                  Inputs and feedback from Service Run 01 are analyzed.
                </p>
              </DiagramNode>

              <FlowArrow />

              <DiagramNode active={activeNode === "suggestion"} kind="action" tone="dark">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] opacity-55">
                  Self-Improvement Agent
                </p>
                <p className="mt-3 font-display text-2xl">Suggest workflow v2</p>
                <p className="mt-2 max-w-40 text-xs leading-5 opacity-65">
                  Prepares a safer next version.
                </p>
              </DiagramNode>

              <FlowArrow />

              <DiagramNode active={activeNode === "approval"} kind="interface" className="self-stretch">
                <WindowHeader>Provider Workspace · CRM & operations</WindowHeader>
                <p className="font-display text-2xl">Review suggested update</p>
                <p className="mt-2 text-xs leading-5 text-[var(--muted-text)]">
                  The live workflow changes only after approval.
                </p>
                <div className="mt-4 inline-flex bg-[var(--workflow-accent)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-wider text-black">
                  Apply workflow v2
                </div>
              </DiagramNode>
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[var(--field-border-focus)] bg-[var(--field-bg)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl" aria-hidden="true">↰</span>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                    Improvement Loop
                  </p>
                  <p className="mt-1 text-sm text-[var(--text)]">
                    Approved workflow v2 feeds the next fulfillment run
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                Back to step 03 ↑
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-[var(--field-bg)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="max-w-2xl text-sm leading-6 text-[var(--text)]">
              One build creates the system. Marketing and fulfillment repeat. Feedback keeps the
              system improving.
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
