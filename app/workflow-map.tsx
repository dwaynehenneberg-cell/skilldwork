"use client";

import { useEffect, useState } from "react";

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
  { node: "sales", message: "Client 01 chooses an Offer and buys the result.", run: 1 },
  { node: "onboarding", message: "The Client Portal collects the required inputs.", run: 1 },
  { node: "status", message: "The client can follow the service status.", run: 1 },
  { node: "workflow", message: "Workflow v1 executes the service.", run: 1 },
  { node: "hitl", message: "A special case needs optional human input.", run: 1 },
  { node: "review", message: "Client 01 requests revision 1.", run: 1, revision: 1, delay: 500 },
  { node: "workflow", message: "The revision returns to the workflow.", run: 1, revision: 1, delay: 500 },
  { node: "review", message: "Client 01 requests revision 2.", run: 1, revision: 2, delay: 500 },
  { node: "workflow", message: "The workflow creates the next version.", run: 1, revision: 2, delay: 500 },
  { node: "review", message: "Client 01 requests revision 3.", run: 1, revision: 3, delay: 500 },
  { node: "workflow", message: "The workflow creates the final version.", run: 1, revision: 3, delay: 500 },
  { node: "review", message: "The result is accepted after three revisions.", run: 1 },
  { node: "complete", message: "Service Run 01 is complete.", run: 1 },
  { node: "improve", message: "Revision feedback becomes an improvement proposal." },
  { node: "suggestion", message: "The Self-Improvement Agent suggests workflow v2." },
  { node: "approval", message: "The Service Provider applies the approved update." },
  { node: "marketing", message: "The improved service is marketed again." },
  { node: "sales", message: "Client 02 starts the next Service Run.", run: 2 },
  { node: "onboarding", message: "Onboarding starts the workflow automatically.", run: 2 },
  { node: "workflow", message: "Workflow v2 executes with what it learned.", run: 2 },
  { node: "complete", message: "Service Run 02 completes without a revision.", run: 2 },
];

const FIRST_RUN_COMPLETE = TIMELINE.findIndex(
  (frame) => frame.run === 1 && frame.node === "complete",
);
const nodeClass =
  "transition duration-300 data-[active=true]:-translate-y-1 data-[active=true]:ring-2 data-[active=true]:ring-[var(--text)] data-[active=true]:shadow-xl motion-reduce:transition-none";

function FlowArrow({ label }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-9 flex-col items-center justify-center text-[var(--muted-text)]"
    >
      {label ? <span className="mb-1 text-[0.6rem] uppercase tracking-[0.14em]">{label}</span> : null}
      <span className="rotate-90 text-2xl xl:rotate-0">→</span>
    </div>
  );
}

function WindowHeader({ children }: { children: React.ReactNode }) {
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
    }, frame.delay ?? 750);

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
              Build once. Market it. Let the workflow deliver.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-text)] sm:text-lg">
              We build the Sales Page and service workflow. You focus on demand and the moments
              that need your expertise.
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

        <div className="space-y-8 p-6 sm:p-10">
          <div
            className="flex min-h-16 flex-col gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--field-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
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

          <div className="grid items-stretch xl:grid-cols-[1.15fr_2.5rem_0.8fr_2.5rem_1.15fr]">
            <article
              data-active={activeNode === "build"}
              className={`${nodeClass} flex min-h-64 flex-col justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--btn-bg)] p-5 text-[var(--btn-text)] sm:p-6`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-55">
                  01 · Start here
                </p>
                <h3 className="mt-5 font-display text-3xl leading-none sm:text-4xl">
                  Build your workflow
                </h3>
                <p className="mt-4 max-w-md text-sm leading-6 opacity-70">
                  We turn your service into an automatable digital workflow and create its
                  result-based Sales Page.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-current/20 px-3 py-1.5 text-xs">
                  Sales Page
                </span>
                <span className="rounded-full border border-current/20 px-3 py-1.5 text-xs">
                  Service workflow
                </span>
                <a
                  href="#book"
                  className="ml-auto rounded-full bg-[var(--btn-text)] px-4 py-2 font-display text-xs uppercase tracking-wider text-[var(--btn-bg)] transition hover:opacity-80"
                >
                  Book a call
                </a>
              </div>
            </article>

            <FlowArrow />

            <article
              data-active={activeNode === "marketing"}
              className={`${nodeClass} flex min-h-64 flex-col justify-between rounded-2xl border border-black/10 bg-[var(--workflow-accent)] p-5 text-black sm:p-6`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-55">
                02 · Handled by you
              </p>
              <div>
                <h3 className="font-display text-4xl leading-none">Marketing</h3>
                <p className="mt-3 text-sm leading-6 opacity-70">
                  Content, outreach, and relationships create demand for the result.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/25 px-3 py-2 text-xs font-medium">
                  Share your link <span aria-hidden="true">→</span>
                </div>
              </div>
            </article>

            <FlowArrow label="link" />

            <article
              data-active={activeNode === "sales"}
              className={`${nodeClass} min-h-64 rounded-2xl border border-[var(--field-border-focus)] bg-[var(--card-bg)] p-4 text-[var(--text)] sm:p-5`}
            >
              <WindowHeader>Sales Page · Client touchpoint</WindowHeader>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <div className="h-16 rounded-sm bg-[var(--field-bg)]" />
                  <div className="mt-3 h-2 w-full bg-[var(--field-bg)]" />
                  <div className="mt-2 h-2 w-4/5 bg-[var(--field-bg)]" />
                  <div className="mt-2 h-2 w-3/5 bg-[var(--field-bg)]" />
                </div>
                <div className="space-y-2 text-[0.65rem] uppercase tracking-wide">
                  {['Offer 1', 'Offer 2', 'Offer 3'].map((offer) => (
                    <div key={offer} className="border border-[var(--field-border-focus)] px-3 py-2">
                      {offer}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <span className="border border-[var(--text)] bg-[var(--btn-bg)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--btn-text)]">
                  Buy
                </span>
              </div>
            </article>
          </div>

          <div className="border-t border-[var(--card-border)] pt-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                  03 · Digital Service Execution
                </p>
                <h3 className="mt-2 font-display text-3xl text-[var(--text)]">
                  One system runs every client result.
                </h3>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-text)]">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[var(--workflow-accent)]" /> Service Provider
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-[var(--field-border-focus)] bg-[var(--card-bg)]" />
                  Client touchpoint
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[var(--btn-bg)]" /> Automated workflow
                </span>
              </div>
            </div>

            <div className="grid items-stretch xl:grid-cols-[1fr_2rem_0.85fr_2rem_1.1fr_2rem_1fr_2rem_0.75fr]">
              <article
                data-active={activeNode === "onboarding"}
                className={`${nodeClass} rounded-2xl border border-[var(--field-border-focus)] bg-[var(--card-bg)] p-4 text-[var(--text)]`}
              >
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
              </article>

              <FlowArrow />

              <article
                data-active={activeNode === "status"}
                className={`${nodeClass} flex flex-col justify-between rounded-2xl border border-[var(--field-border-focus)] bg-[var(--card-bg)] p-4 text-[var(--text)]`}
              >
                <WindowHeader>Client Portal · Status</WindowHeader>
                <div>
                  <p className="text-xs leading-5 text-[var(--muted-text)]">
                    We will notify you if the workflow needs more information.
                  </p>
                  <p className="mt-5 font-display text-3xl leading-none">In progress</p>
                  <p className="mt-5 flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full bg-[var(--workflow-accent)]" /> Result in about 1 hour
                  </p>
                </div>
              </article>

              <FlowArrow />

              <article
                data-active={activeNode === "workflow" || activeNode === "hitl"}
                className={`${nodeClass} flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--btn-bg)] p-5 text-[var(--btn-text)]`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-55">
                  n8n · automated workflow
                </p>
                <div className="my-auto py-6 text-center">
                  <p className="font-display text-4xl">Execute</p>
                  <p className="mt-2 text-xs opacity-60">Build → check → deliver</p>
                </div>
                <div
                  data-active={activeNode === "hitl"}
                  className={`${nodeClass} rounded-xl bg-[var(--workflow-accent)] p-3 text-black`}
                >
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] opacity-60">
                    HITL · when needed
                  </p>
                  <p className="mt-1 text-xs">Questions, exceptions, or revisions</p>
                </div>
              </article>

              <FlowArrow />

              <article
                data-active={activeNode === "review"}
                className={`${nodeClass} rounded-2xl border border-[var(--field-border-focus)] bg-[var(--card-bg)] p-4 text-[var(--text)]`}
              >
                <WindowHeader>Client Portal · Result</WindowHeader>
                <p className="text-xs font-semibold">Version ready — review result</p>
                <div className="my-4 h-20 border border-dashed border-[var(--field-border-focus)] bg-[var(--field-bg)]" />
                <div className="grid grid-cols-2 gap-2 text-center text-[0.6rem] uppercase tracking-wider">
                  <span className="border border-[var(--field-border-focus)] px-2 py-2">Revise</span>
                  <span className="bg-[var(--btn-bg)] px-2 py-2 text-[var(--btn-text)]">Accept</span>
                </div>
                <p className="mt-3 text-center text-[0.65rem] text-[var(--muted-text)]">
                  Revision ↩ workflow
                </p>
              </article>

              <FlowArrow />

              <article
                data-active={activeNode === "complete"}
                className={`${nodeClass} flex min-h-48 flex-col items-center justify-center rounded-full border border-[var(--field-border-focus)] bg-[var(--card-bg)] p-4 text-center text-[var(--text)]`}
              >
                <span className="text-2xl" aria-hidden="true">✓</span>
                <p className="mt-2 font-display text-2xl leading-none">Result delivered</p>
                <p className="mt-2 text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted-text)]">
                  Service Run complete
                </p>
              </article>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-[var(--field-border-focus)] p-5 sm:p-6">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
              Revision feedback improves the next run
            </p>
            <div className="grid items-stretch xl:grid-cols-[1fr_2rem_1fr_2rem_1fr]">
              <article
                data-active={activeNode === "improve"}
                className={`${nodeClass} rounded-xl border border-[var(--card-border)] bg-[var(--field-bg)] p-4 text-[var(--text)]`}
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                  Revision history
                </p>
                <p className="mt-3 font-display text-2xl">What caused the revisions?</p>
                <p className="mt-2 text-xs leading-5 text-[var(--muted-text)]">
                  Inputs and feedback from Service Run 01 are analyzed.
                </p>
              </article>
              <FlowArrow />
              <article
                data-active={activeNode === "suggestion"}
                className={`${nodeClass} rounded-xl border border-[var(--card-border)] bg-[var(--btn-bg)] p-4 text-[var(--btn-text)]`}
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] opacity-55">
                  Self-Improvement Agent
                </p>
                <p className="mt-3 font-display text-2xl">Suggested workflow v2</p>
                <p className="mt-2 text-xs leading-5 opacity-65">
                  A safer next version is prepared — never changed live without approval.
                </p>
              </article>
              <FlowArrow />
              <article
                data-active={activeNode === "approval"}
                className={`${nodeClass} rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-[var(--text)]`}
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                  Provider Workspace · CRM & operations
                </p>
                <p className="mt-3 font-display text-2xl">Review suggested update</p>
                <div className="mt-4 inline-flex bg-[var(--workflow-accent)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-wider text-black">
                  Apply workflow v2
                </div>
              </article>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl bg-[var(--field-bg)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <span className="font-display text-4xl text-[var(--text)]" aria-hidden="true">↻</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                  The growth loop
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--text)]">
                  Marketing brings clients in. The workflow delivers and improves. More capacity
                  goes back into growth.
                </p>
              </div>
            </div>
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
