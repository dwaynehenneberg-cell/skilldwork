"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/foerderklar/i18n";
import { useStore } from "@/lib/foerderklar/store";
import { PortalChrome } from "./chrome";

const STEP_KEYS = [
  "profile",
  "scan",
  "score",
  "draft",
  "review",
  "deliver",
] as const;

export default function WorkflowPage() {
  const { t } = useI18n();
  const { state, hydrated, markReady } = useStore();
  const router = useRouter();
  const [active, setActive] = useState(0);

  const steps = useMemo(
    () => STEP_KEYS.map((key) => t.workflow.steps[key]),
    [t],
  );

  useEffect(() => {
    if (!hydrated) return;
    if (!state.onboardingComplete) {
      router.replace("/sales/foerderklar/portal");
      return;
    }
    if (state.runStatus === "ready" || state.runStatus === "accepted") {
      router.replace("/sales/foerderklar/results");
    }
  }, [hydrated, state.onboardingComplete, state.runStatus, router]);

  useEffect(() => {
    if (!hydrated || state.runStatus !== "running") return;
    setActive(0);
    const timers: number[] = [];
    STEP_KEYS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setActive(i), i * 700));
    });
    timers.push(
      window.setTimeout(() => {
        markReady();
        router.push("/sales/foerderklar/results");
      }, STEP_KEYS.length * 700 + 400),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [hydrated, state.runStatus, state.runSeed, markReady, router]);

  if (!hydrated) {
    return (
      <PortalChrome title={t.workflow.title} subtitle={t.workflow.subtitle}>
        <div className="fk-card h-48 animate-pulse bg-[var(--fk-soft)]" />
      </PortalChrome>
    );
  }

  return (
    <PortalChrome title={t.workflow.title} subtitle={t.workflow.subtitle}>
      <div className="fk-card fk-rise overflow-hidden p-5 sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--workflow-blue)] text-white">
            <span
              className="h-7 w-7 rounded-full border-2 border-white border-t-transparent"
              style={{ animation: "fk-spin-soft 0.8s linear infinite" }}
            />
          </div>
          <p className="mt-5 text-sm font-semibold text-[var(--muted-text)]">
            {state.revisionCount > 0
              ? t.workflow.revisionRunning
              : t.workflow.running}
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text)]">
            {state.onboarding.companyName || t.workflow.status}
          </p>
        </div>

        <ol className="mx-auto mt-8 max-w-md space-y-2">
          {steps.map((label, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  current
                    ? "bg-[var(--fk-blue-soft)] font-semibold text-[var(--workflow-blue)]"
                    : done
                      ? "text-[var(--text)]"
                      : "text-[var(--muted-text)]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                    current
                      ? "bg-[var(--workflow-blue)] text-white"
                      : done
                        ? "bg-[var(--text)] text-[var(--page-bg)]"
                        : "bg-[var(--field-bg)]"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span>{label}</span>
                {current && (
                  <span
                    className="ml-auto h-4 w-4 rounded-full border-2 border-[var(--workflow-blue)] border-t-transparent"
                    style={{ animation: "fk-spin-soft 0.8s linear infinite" }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </PortalChrome>
  );
}
