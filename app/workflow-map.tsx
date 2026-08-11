"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { requestBookingOpen } from "./booking-intent";

const STEP_ORDER = ["build", "market", "fulfill", "improve"] as const;
type StepId = (typeof STEP_ORDER)[number];

const STEP_COPY: Record<StepId, { label: string; title: string; summary: string }> = {
  build: {
    label: "01 · Build",
    title: "Build your workflow",
    summary: "We turn your service into a Sales Page and automated delivery workflow.",
  },
  market: {
    label: "02 · Market",
    title: "Create demand",
    summary: "You focus on marketing while one link brings clients into the system.",
  },
  fulfill: {
    label: "03 · Fulfill",
    title: "Deliver the result",
    summary: "Onboarding, delivery, results, and revisions run through one connected workflow.",
  },
  improve: {
    label: "04 · Improve",
    title: "Improve every run",
    summary: "Every completed client order helps the system deliver the next one better.",
  },
};

type ConnectorId =
  | "build-market"
  | "market-sales"
  | "sales-portal"
  | "portal-workflow"
  | "workflow-result"
  | "revision-loop"
  | "result-improve"
  | "improve-workflow";

type OfferId = 1 | 2 | 3;
/** What the client does on a page — a click, a form being filled, a revision being typed. */
type ClientActionId =
  | `pick-offer-${OfferId}`
  | "choose-offer"
  | "fill-form"
  | "start-service"
  | "type-revision"
  | "revise"
  | "accept";
/** An automated node doing work — it spins for the length of the step. */
type RunId = "run-workflow" | "run-revision" | "run-improvement";
type FlowId = ConnectorId | ClientActionId | RunId;

/** How long each step is held. Anything not listed gets the default connector beat. */
const HOLD_MS = new Map<FlowId, number>([
  ["pick-offer-1", 700],
  ["pick-offer-2", 700],
  ["pick-offer-3", 700],
  ["choose-offer", 700],
  ["start-service", 700],
  ["revise", 700],
  ["accept", 700],
  ["run-workflow", 2800],
  ["run-revision", 1800],
  ["run-improvement", 1800],
]);
const CONNECTOR_HOLD_MS = 1400;
/** Blank beat between two steps. Shorter than the clearing delay on typed lines. */
const STEP_GAP_MS = 250;

/** One client's trip through the system. */
const clientRun = (offer: OfferId, withRevision: boolean): FlowId[] => [
  "market-sales",
  `pick-offer-${offer}`,
  "choose-offer",
  "sales-portal",
  "fill-form",
  "start-service",
  "portal-workflow",
  "run-workflow",
  "workflow-result",
  ...(withRevision
    ? (["type-revision", "revise", "revision-loop", "run-revision", "workflow-result"] as FlowId[])
    : []),
  "accept",
  "result-improve",
  "run-improvement",
  "improve-workflow",
];

/**
 * Each run is a different client, on a different offer. The first one takes the revision
 * path, so the most telling case is on screen straight away.
 */
const RUNS = [clientRun(2, true), clientRun(1, false), clientRun(3, false)];

/**
 * The portal form clears when the next run starts and stays filled for the rest of that run,
 * so "Start service" visibly submits something. Listing the empty half means any step added
 * later to the back of a run counts as filled automatically.
 */
const PORTAL_EMPTY_STEPS = new Set<FlowId>([
  "build-market",
  "market-sales",
  "pick-offer-1",
  "pick-offer-2",
  "pick-offer-3",
  "choose-offer",
  "sales-portal",
]);

const activeNodeClass =
  "transition duration-300 data-[active=true]:-translate-y-1 data-[active=true]:ring-2 data-[active=true]:ring-[var(--text)] data-[active=true]:shadow-lg motion-reduce:transition-none";
const focusedStepClass =
  "relative rounded-xl p-2 transition duration-300 data-[focused=true]:bg-[var(--field-bg)] data-[focused=true]:ring-1 data-[focused=true]:ring-[var(--field-border-focus)] data-[focused=true]:shadow-sm motion-reduce:transition-none";
const pressedClass =
  "transition duration-200 data-[active=true]:scale-95 data-[active=true]:ring-2 data-[active=true]:ring-[var(--workflow-blue)] data-[active=true]:shadow-[0_0_8px_var(--workflow-blue)] motion-reduce:transition-none";
/**
 * A line of "text" that types itself in while its step is active. The base delay is the
 * *clearing* delay: it outlasts the blank beat between two steps, so a line that stays
 * filled across a step boundary does not flicker. Each line sets its own typing delay.
 */
const typedLineClass =
  "h-1.5 w-0 bg-[var(--card-border)] transition-[width] delay-[400ms] duration-500 ease-out motion-reduce:transition-none";
/**
 * A connector at rest, and lit once the sweep below has reached the arrow tip. The delay sits
 * on the active state, so it only applies on the way in — going dark again is immediate.
 */
const connectorLitClass =
  "text-[var(--muted-text)] transition duration-300 data-[active=true]:delay-[520ms] data-[active=true]:text-[var(--workflow-blue)] data-[active=true]:drop-shadow-[0_0_5px_var(--workflow-blue)] motion-reduce:transition-none";
/**
 * Highlight that travels along a connector from its start to the arrow tip, riding on top of
 * the muted line. Each segment sets its own duration and delay; the base state carries no
 * duration, so on the way out it snaps back to zero rather than retreating backwards — the
 * next pass always starts from the beginning.
 */
const sweepClass =
  "pointer-events-none absolute bg-[var(--workflow-blue)] transition-[width,height] duration-0 ease-out motion-reduce:transition-none";

function useConnectorAnimation(enabled: boolean) {
  const [activeFlow, setActiveFlow] = useState<FlowId | null>(null);
  const initialPlayed = useRef(false);
  const cycleCount = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const wait = (milliseconds: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, milliseconds);
      });

    async function play(sequence: FlowId[]) {
      for (const step of sequence) {
        if (cancelled) return;
        setActiveFlow(step);
        await wait(HOLD_MS.get(step) ?? CONNECTOR_HOLD_MS);
        if (cancelled) return;
        setActiveFlow(null);
        await wait(STEP_GAP_MS);
      }
    }

    async function run() {
      if (!initialPlayed.current) {
        initialPlayed.current = true;
        await play(["build-market", ...RUNS[0]]);
      }

      while (!cancelled) {
        cycleCount.current += 1;
        await play(RUNS[cycleCount.current % RUNS.length]);
        if (!cancelled) await wait(1500);
      }
    }

    void run();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [enabled]);

  return enabled ? activeFlow : null;
}

function WindowHeader({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-1.5 border-b border-[var(--card-border)] pb-2">
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
      <span className="ml-1 text-[0.5rem] font-semibold uppercase tracking-[0.12em] opacity-55">
        {children}
      </span>
    </div>
  );
}

function ClientPage({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="h-40 w-36 shrink-0 rounded-lg border border-[var(--field-border-focus)] bg-[var(--card-bg)] p-2.5 text-[var(--text)]">
      <WindowHeader>{title}</WindowHeader>
      {children}
    </div>
  );
}

function SalesPage({ activeFlow }: { activeFlow: FlowId | null }) {
  return (
    <ClientPage title="Sales Page">
      <div className="space-y-1.5">
        {([1, 2, 3] as const).map((offer) => (
          <div
            key={offer}
            data-active={activeFlow === `pick-offer-${offer}`}
            className={`${pressedClass} flex items-center justify-between border border-[var(--card-border)] px-2 py-1.5 text-[0.48rem] font-semibold uppercase`}
          >
            <span>Offer {offer}</span>
            <span aria-hidden="true">→</span>
          </div>
        ))}
      </div>
      <div
        data-active={activeFlow === "choose-offer"}
        className={`${pressedClass} mt-2 bg-[var(--btn-bg)] py-1.5 text-center text-[0.46rem] font-semibold uppercase tracking-wider text-[var(--btn-text)]`}
      >
        Choose offer
      </div>
    </ClientPage>
  );
}

function ClientPortal({ activeFlow }: { activeFlow: FlowId | null }) {
  const filled = activeFlow !== null && !PORTAL_EMPTY_STEPS.has(activeFlow);

  return (
    <ClientPage title="Client Portal">
      <div className="space-y-1.5">
        {[
          "data-[active=true]:delay-[0ms]",
          "data-[active=true]:delay-[300ms]",
          "data-[active=true]:delay-[600ms]",
        ].map((typingDelay) => (
          <div
            key={typingDelay}
            className="flex h-5 items-center border border-[var(--card-border)] bg-[var(--field-bg)] px-1"
          >
            <span
              data-active={filled}
              className={`${typedLineClass} ${typingDelay} data-[active=true]:w-3/4`}
            />
          </div>
        ))}
      </div>
      <div
        data-active={activeFlow === "start-service"}
        className={`${pressedClass} mt-2 bg-[var(--btn-bg)] py-1.5 text-center text-[0.46rem] font-semibold uppercase tracking-wider text-[var(--btn-text)]`}
      >
        Start service
      </div>
    </ClientPage>
  );
}

function ResultPage({ activeFlow }: { activeFlow: FlowId | null }) {
  // The revision note is typed first, then stays put while "Revise" is pressed.
  const typing = activeFlow === "type-revision" || activeFlow === "revise";

  return (
    <ClientPage title="Result">
      <div className="h-[4.4rem] border border-dashed border-[var(--field-border-focus)] bg-[var(--field-bg)] p-2">
        <div className="h-1.5 w-full bg-[var(--card-border)]" />
        <div className="mt-1.5 h-1.5 w-3/4 bg-[var(--card-border)]" />
        <div className="mt-3 flex h-5 w-full items-center gap-px bg-[var(--card-bg)] px-1">
          <span
            data-active={typing}
            className={`${typedLineClass} data-[active=true]:delay-[0ms] data-[active=true]:w-2/3`}
          />
          {/* The blink runs unconditionally — toggling the animation itself would snap past the delay. */}
          <span
            data-active={typing}
            className="h-2.5 w-0 animate-pulse bg-[var(--text)] transition-[width] delay-[400ms] duration-100 data-[active=true]:w-px data-[active=true]:delay-[0ms] motion-reduce:animate-none motion-reduce:transition-none"
          />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1 text-center text-[0.43rem] font-semibold uppercase">
        <span
          data-active={activeFlow === "revise"}
          className={`${pressedClass} border border-[var(--field-border-focus)] py-1.5`}
        >
          Revise
        </span>
        <span
          data-active={activeFlow === "accept"}
          className={`${pressedClass} bg-[var(--btn-bg)] py-1.5 text-[var(--btn-text)]`}
        >
          Accept
        </span>
      </div>
    </ClientPage>
  );
}

function BuildVisual({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        data-active={active}
        className={`${activeNodeClass} flex h-36 w-36 flex-col items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--btn-bg)] p-4 text-center text-[var(--btn-text)]`}
      >
        <span className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] opacity-55">
          Start here
        </span>
        <h3 className="mt-2 font-display text-2xl leading-none">Build your workflow</h3>
        <span className="mt-2 text-[0.56rem] opacity-65">Sales Page + delivery</span>
      </div>
      <button
        className="mt-3 rounded-full border border-[var(--field-border-focus)] px-3 py-1.5 font-display text-[0.58rem] uppercase tracking-wider transition hover:bg-[var(--field-bg)]"
        onClick={requestBookingOpen}
        type="button"
      >
        Book a call
      </button>
    </div>
  );
}

/** Chevron head on a 10×10 box, tip centred on the box axis so it always lines up with a 1px rule. */
function ArrowHead({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      fill="none"
      height="10"
      viewBox="0 0 10 10"
      width="10"
    >
      <path
        d="M4 1 L8 5 L4 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/**
 * Loading ring for an automated node. Sits just inside the circle, so it reads against the
 * node's own fill rather than whatever is behind it. The spin runs unconditionally and only
 * the opacity is gated — toggling the animation itself would snap the rotation back to 0.
 */
function RunningRing({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      data-active={active}
      className="pointer-events-none absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-current opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100 motion-reduce:animate-none"
    />
  );
}

function Connector({
  active,
  direction,
  label,
}: {
  active: boolean;
  direction: "horizontal" | "vertical";
  label?: string;
}) {
  const horizontal = direction === "horizontal";

  return (
    <div
      aria-hidden="true"
      data-active={active}
      className={`group flex shrink-0 flex-col items-center justify-center gap-1 ${connectorLitClass} ${horizontal ? "min-w-6" : "min-h-10"}`}
    >
      {label ? (
        <span className="max-w-24 text-center text-[0.43rem] font-semibold uppercase tracking-[0.08em]">
          {label}
        </span>
      ) : null}
      {horizontal ? (
        <span className="relative flex w-full items-center">
          <span className="h-px flex-1 bg-current" />
          <ArrowHead className="-ml-1" />
          <span
            className={`${sweepClass} left-0 top-1/2 h-px w-0 -translate-y-1/2 group-data-[active=true]:w-full group-data-[active=true]:duration-[600ms]`}
          />
        </span>
      ) : (
        <span className="relative flex h-9 flex-col items-center">
          <span className="w-px flex-1 bg-current" />
          <ArrowHead className="-mt-1 rotate-90" />
          <span
            className={`${sweepClass} left-1/2 top-0 h-0 w-px -translate-x-1/2 group-data-[active=true]:h-full group-data-[active=true]:duration-[600ms]`}
          />
        </span>
      )}
    </div>
  );
}

function DesktopSalesPortalConnector({ active }: { active: boolean }) {
  return (
    <div aria-hidden="true" data-active={active} className={`group relative h-80 ${connectorLitClass}`}>
      {/* Out of the sales page, up the riser, then into the portal — swept in that order. */}
      <span className="absolute left-0 top-[16.5rem] w-1/2 border-t border-current" />
      <span
        className={`${sweepClass} left-0 top-[16.5rem] h-px w-0 group-data-[active=true]:w-1/2 group-data-[active=true]:duration-[120ms]`}
      />

      <span className="absolute left-1/2 top-[9rem] h-[7.5rem] border-l border-current" />
      <span
        className={`${sweepClass} bottom-14 left-1/2 h-0 w-px group-data-[active=true]:h-[7.5rem] group-data-[active=true]:delay-[120ms] group-data-[active=true]:duration-[360ms]`}
      />

      <span className="absolute left-1/2 right-0 top-[9rem] flex -translate-y-1/2 items-center">
        <span className="h-px flex-1 bg-current" />
        <ArrowHead className="-ml-1" />
      </span>
      <span
        className={`${sweepClass} left-1/2 top-[9rem] h-px w-0 -translate-y-1/2 group-data-[active=true]:w-1/2 group-data-[active=true]:delay-[480ms] group-data-[active=true]:duration-[120ms]`}
      />
    </div>
  );
}

function MarketingVisual({ active, activeFlow }: { active: boolean; activeFlow: FlowId | null }) {
  return (
    <div className="flex flex-col items-center">
      <div
        data-active={active}
        className={`${activeNodeClass} flex h-28 w-28 flex-col items-center justify-center rounded-full border border-black/10 bg-[var(--workflow-accent)] p-3 text-center text-black`}
      >
        <h3 className="font-display text-2xl leading-none">Marketing</h3>
        <span className="mt-1.5 text-[0.55rem] font-medium">Handled by you</span>
      </div>
      <Connector active={activeFlow === "market-sales"} direction="vertical" />
      <SalesPage activeFlow={activeFlow} />
      <span className="mt-2 text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-[var(--muted-text)]">
        ↻ Next client
      </span>
    </div>
  );
}

function WorkflowCluster({ active, activeFlow }: { active: boolean; activeFlow: FlowId | null }) {
  return (
    <div className="relative h-40 w-36 shrink-0">
      <div
        data-active={active}
        className={`${activeNodeClass} absolute left-2 top-5 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-black/10 bg-[var(--workflow-blue)] p-3 text-center text-white`}
      >
        <RunningRing active={activeFlow === "run-workflow"} />
        <span className="text-[0.45rem] uppercase tracking-[0.1em] opacity-70">Execution</span>
        <h3 className="mt-1 font-display text-lg leading-none">Workflow</h3>
        <span className="mt-1 text-[0.43rem] opacity-70">process → deliver</span>
      </div>

      {/* Leader line: drops from behind the pill onto the workflow circle's upper-left arc. */}
      <span className="absolute left-6 top-2 h-7 border-l border-dashed border-[var(--workflow-accent)]" />
      <span className="absolute -left-2 top-0 w-[5.5rem] rounded-full bg-[var(--workflow-accent)] px-2 py-1 text-center text-[0.43rem] font-semibold leading-tight text-black">
        Your input if needed
      </span>

      <div className="absolute bottom-0 right-0 flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-[var(--card-bg)] bg-[var(--workflow-blue)] p-2 text-center text-white shadow-md">
        <RunningRing active={activeFlow === "run-revision"} />
        <span className="font-display text-[0.72rem] leading-none">Revision Agent</span>
      </div>
    </div>
  );
}

function ImprovementVisual({
  active,
  activeFlow,
  compact,
}: {
  active: boolean;
  activeFlow: FlowId | null;
  compact: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        data-active={active}
        className={`${activeNodeClass} relative flex h-36 w-36 flex-col items-center justify-center rounded-full border border-black/10 bg-[var(--workflow-blue)] p-4 text-center text-white`}
      >
        <RunningRing active={activeFlow === "run-improvement"} />
        <span className="text-[0.45rem] uppercase tracking-[0.1em] opacity-70">Completed runs</span>
        <h3 className="mt-2 font-display text-xl leading-none">Improvement Agent</h3>
        <span className="mt-2 text-[0.46rem] opacity-75">Improves future delivery</span>
      </div>
      {compact ? null : (
        <span className="mt-2 text-center text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-[var(--muted-text)]">
          Better with every run
        </span>
      )}
    </div>
  );
}

/**
 * The loop back into the workflow: down the right rail, left along the bottom, up to the arrow
 * on the left. Square corners rather than a rounded box, so the sweep can travel each leg.
 */
function ReturnPath({ active, children, className = "" }: { active: boolean; children: ReactNode; className?: string }) {
  const rail = "absolute bg-[var(--field-border-focus)]";

  return (
    <div
      aria-hidden="true"
      data-active={active}
      className={`group relative flex h-11 items-end justify-center px-7 pb-1.5 text-center text-[0.45rem] font-semibold uppercase tracking-[0.08em] ${connectorLitClass} ${className}`}
    >
      <span className={`${rail} right-0 top-0 h-full w-px`} />
      <span className={`${rail} bottom-0 left-0 h-px w-full`} />
      <span className={`${rail} left-0 top-0 h-full w-px`} />

      <span
        className={`${sweepClass} right-0 top-0 h-0 w-px group-data-[active=true]:h-full group-data-[active=true]:duration-[120ms]`}
      />
      <span
        className={`${sweepClass} bottom-0 right-0 h-px w-0 group-data-[active=true]:w-full group-data-[active=true]:delay-[120ms] group-data-[active=true]:duration-[360ms]`}
      />
      <span
        className={`${sweepClass} bottom-0 left-0 h-0 w-px group-data-[active=true]:h-full group-data-[active=true]:delay-[480ms] group-data-[active=true]:duration-[120ms]`}
      />

      <ArrowHead className="absolute -left-[4.5px] -top-1.5 -rotate-90" />
      {children}
    </div>
  );
}

function FulfillmentVisual({
  active,
  activeFlow,
  compact,
}: {
  active: boolean;
  activeFlow: FlowId | null;
  compact: boolean;
}) {
  if (compact) {
    return (
      <div className="flex flex-col items-center">
        <ClientPortal activeFlow={activeFlow} />
        <Connector active={activeFlow === "portal-workflow"} direction="vertical" />
        <WorkflowCluster active={active} activeFlow={activeFlow} />
        <Connector active={activeFlow === "workflow-result"} direction="vertical" />
        <ResultPage activeFlow={activeFlow} />
        <ReturnPath active={activeFlow === "revision-loop"} className="mt-2 w-52">
          Revision returns to workflow
        </ReturnPath>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[var(--field-bg)] p-3">
      <p className="mb-3 text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted-text)]">
        Automated service execution
      </p>
      <div className="grid grid-cols-[9rem_1.5rem_9rem_1.5rem_9rem] items-center justify-center">
        <ClientPortal activeFlow={activeFlow} />
        <Connector active={activeFlow === "portal-workflow"} direction="horizontal" />
        <WorkflowCluster active={active} activeFlow={activeFlow} />
        <Connector active={activeFlow === "workflow-result"} direction="horizontal" />
        <ResultPage activeFlow={activeFlow} />
        <ReturnPath active={activeFlow === "revision-loop"} className="col-start-3 col-end-6 mt-2">
          Revision returns to workflow
        </ReturnPath>
      </div>
    </div>
  );
}

function StepExplanation({ active, step, mobile }: { active: boolean; step: StepId; mobile: boolean }) {
  const copy = STEP_COPY[step];

  if (mobile) {
    return (
      <div className="mt-3 min-h-14 border-t border-[var(--card-border)] pt-3" aria-live="polite">
        <p
          data-active={active}
          className="text-xs leading-5 text-[var(--muted-text)] opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100 motion-reduce:transition-none"
        >
          {copy.summary}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 h-[5.25rem]">
      <div
        data-active={active}
        className="pointer-events-none translate-y-1 rounded-xl border border-[var(--field-border-focus)] bg-[var(--card-bg)] p-3 opacity-0 shadow-lg transition duration-200 data-[active=true]:translate-y-0 data-[active=true]:opacity-100 motion-reduce:transition-none"
      >
        <p className="text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted-text)]">
          {copy.label} · {copy.title}
        </p>
        <p className="mt-1.5 text-xs leading-4 text-[var(--text)]">{copy.summary}</p>
      </div>
    </div>
  );
}

type StepFrameProps = {
  active: boolean;
  children: ReactNode;
  mobile: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  step: StepId;
};

function StepFrame({
  active,
  children,
  mobile,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  step,
}: StepFrameProps) {
  return (
    <article
      id={mobile ? `workflow-mobile-${step}` : undefined}
      data-focused={active}
      className={`${focusedStepClass} scroll-mt-24`}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={mobile ? undefined : 0}
    >
      <p className="mb-3 text-left text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
        {STEP_COPY[step].label}
      </p>
      {children}
      <StepExplanation active={active} mobile={mobile} step={step} />
    </article>
  );
}

function DesktopCanvas({
  activeFlow,
  activeStep,
  onFocusStep,
  onHoverStep,
}: {
  activeFlow: FlowId | null;
  activeStep: StepId | null;
  onFocusStep: (step: StepId | null) => void;
  onHoverStep: (step: StepId | null) => void;
}) {
  const stepEvents = (step: StepId) => ({
    onBlur: () => onFocusStep(null),
    onFocus: () => onFocusStep(step),
    onMouseEnter: () => onHoverStep(step),
    onMouseLeave: () => onHoverStep(null),
  });

  return (
    <>
      <div className="hidden grid-cols-[9.4rem_2rem_10.6rem_2rem_minmax(29rem,1fr)_2rem_10rem] items-start gap-2 xl:grid">
        <StepFrame active={activeStep === "build"} mobile={false} step="build" {...stepEvents("build")}>
          <BuildVisual active={activeStep === "build"} />
        </StepFrame>

        <Connector active={activeFlow === "build-market"} direction="horizontal" />

        <StepFrame active={activeStep === "market"} mobile={false} step="market" {...stepEvents("market")}>
          <MarketingVisual active={activeStep === "market"} activeFlow={activeFlow} />
        </StepFrame>

        <DesktopSalesPortalConnector active={activeFlow === "sales-portal"} />

        <StepFrame active={activeStep === "fulfill"} mobile={false} step="fulfill" {...stepEvents("fulfill")}>
          <FulfillmentVisual active={activeStep === "fulfill"} activeFlow={activeFlow} compact={false} />
        </StepFrame>

        <Connector active={activeFlow === "result-improve"} direction="horizontal" label="Completed run" />

        <StepFrame active={activeStep === "improve"} mobile={false} step="improve" {...stepEvents("improve")}>
          <ImprovementVisual active={activeStep === "improve"} activeFlow={activeFlow} compact={false} />
        </StepFrame>
      </div>

      <div className="-mt-7 hidden grid-cols-[9.4rem_2rem_10.6rem_2rem_minmax(29rem,1fr)_2rem_10rem] gap-2 xl:grid">
        <ReturnPath active={activeFlow === "improve-workflow"} className="col-start-5 col-end-8 ml-[16.5rem]">
          Improved workflow returns to execution
        </ReturnPath>
      </div>
    </>
  );
}

function MobileCanvas({
  activeFlow,
  activeStep,
}: {
  activeFlow: FlowId | null;
  activeStep: StepId | null;
}) {
  return (
    <div className="space-y-3 xl:hidden">
      <StepFrame active={activeStep === "build"} mobile step="build">
        <BuildVisual active={activeStep === "build"} />
      </StepFrame>

      <Connector active={activeFlow === "build-market"} direction="vertical" />

      <StepFrame active={activeStep === "market"} mobile step="market">
        <MarketingVisual active={activeStep === "market"} activeFlow={activeFlow} />
      </StepFrame>

      <Connector active={activeFlow === "sales-portal"} direction="vertical" />

      <StepFrame active={activeStep === "fulfill"} mobile step="fulfill">
        <FulfillmentVisual active={activeStep === "fulfill"} activeFlow={activeFlow} compact />
      </StepFrame>

      <Connector active={activeFlow === "result-improve"} direction="vertical" label="Completed run" />

      <StepFrame active={activeStep === "improve"} mobile step="improve">
        <ImprovementVisual active={activeStep === "improve"} activeFlow={activeFlow} compact />
        <ReturnPath active={activeFlow === "improve-workflow"} className="mx-auto mt-3 w-60">
          Improved workflow returns to execution
        </ReturnPath>
      </StepFrame>
    </div>
  );
}

export default function WorkflowMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const [compactLayout, setCompactLayout] = useState(false);
  const [mobileActiveStep, setMobileActiveStep] = useState<StepId | null>(null);
  const [hoveredStep, setHoveredStep] = useState<StepId | null>(null);
  const [focusedStep, setFocusedStep] = useState<StepId | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const desktopActiveStep = focusedStep ?? hoveredStep;
  const interactionPaused = desktopActiveStep !== null;
  const activeFlow = useConnectorAnimation(
    sectionVisible && pageVisible && !reducedMotion && !interactionPaused,
  );

  useEffect(() => {
    const compact = window.matchMedia("(max-width: 1279px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCompactLayout(compact.matches);
      setReducedMotion(motion.matches);
    };
    sync();
    compact.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      compact.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { rootMargin: "-15% 0px -15% 0px", threshold: 0.01 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sync = () => setPageVisible(document.visibilityState === "visible");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (!compactLayout) return;

    const update = () => {
      const viewportHeight = window.innerHeight;
      const candidates = STEP_ORDER.map((step) => {
        const element = document.getElementById(`workflow-mobile-${step}`);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        if (rect.bottom < viewportHeight * 0.12 || rect.top > viewportHeight * 0.82) return null;
        return {
          step,
          distance: Math.abs((rect.top + rect.bottom) / 2 - viewportHeight * 0.46),
        };
      })
        .filter((item): item is { step: StepId; distance: number } => item !== null)
        .sort((a, b) => a.distance - b.distance);
      setMobileActiveStep(candidates[0]?.step ?? null);
    };

    const initialUpdate = setTimeout(update, 0);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(initialUpdate);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [compactLayout]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="w-full scroll-mt-4 px-4 pb-16 sm:px-6 sm:pb-20"
      aria-labelledby="workflow-title"
    >
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
              Four connected steps turn your service into a system that delivers and learns.
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
            <span className="xl:hidden">Scroll to explore</span>
            <span className="hidden xl:inline">Hover to focus</span>
          </p>
        </header>

        <div className="space-y-4 p-4 sm:p-6">
          <div className="rounded-2xl border border-[var(--field-border-focus)] p-4 sm:p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                Skilldwork service system
              </p>
              <div className="flex flex-wrap gap-3 text-[0.55rem] text-[var(--muted-text)]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--workflow-blue)]" /> Automated
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--workflow-accent)]" /> Handled by you
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-3.5 border border-[var(--field-border-focus)] bg-[var(--card-bg)]" /> Client page
                </span>
              </div>
            </div>

            <DesktopCanvas
              activeFlow={activeFlow}
              activeStep={desktopActiveStep}
              onFocusStep={setFocusedStep}
              onHoverStep={setHoveredStep}
            />
            <MobileCanvas activeFlow={activeFlow} activeStep={mobileActiveStep} />
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-[var(--field-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[var(--text)] sm:text-sm">
              You create demand. Skilldwork delivers each service and improves the next run.
            </p>
            <button
              className="shrink-0 rounded-full bg-[var(--btn-bg)] px-5 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)]"
              onClick={requestBookingOpen}
              type="button"
            >
              Build my workflow
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
