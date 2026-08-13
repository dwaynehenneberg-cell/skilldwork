"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { OfferId } from "./offers";

export type OnboardingData = {
  companyName: string;
  industry: string;
  size: string;
  state: string;
  revenue: string;
  goal: string;
  legalForm: string;
};

export type RunStatus = "idle" | "running" | "ready" | "accepted";

export type ChatMessage = {
  id: string;
  from: "client" | "provider";
  text: string;
  at: number;
};

export type GrantApplication = {
  grantId: string;
  grantName: string;
  contactEmail: string;
  note: string;
  submittedAt: number;
};

export type FoerderklarState = {
  offerId: OfferId;
  email: string;
  checkoutCompany: string;
  cardConnected: boolean;
  cardLast4: string;
  onboarding: OnboardingData;
  onboardingComplete: boolean;
  runStatus: RunStatus;
  revisionNote: string;
  revisionCount: number;
  runSeed: number;
  messages: ChatMessage[];
  applications: GrantApplication[];
};

const STORAGE_KEY = "foerderklar-run";

const defaultOnboarding: OnboardingData = {
  companyName: "",
  industry: "software",
  size: "10-49",
  state: "BY",
  revenue: "500k-2m",
  goal: "digitalization",
  legalForm: "gmbh",
};

const defaults: FoerderklarState = {
  offerId: "check",
  email: "",
  checkoutCompany: "",
  cardConnected: false,
  cardLast4: "",
  onboarding: defaultOnboarding,
  onboardingComplete: false,
  runStatus: "idle",
  revisionNote: "",
  revisionCount: 0,
  runSeed: 1,
  messages: [],
  applications: [],
};

function normalizeOfferId(id: unknown): OfferId {
  if (id === "apply" || id === "full") return "apply";
  return "check";
}

type StoreContextValue = {
  state: FoerderklarState;
  hydrated: boolean;
  selectOffer: (id: OfferId) => void;
  completeCheckout: (input: {
    email: string;
    company: string;
    last4: string;
  }) => void;
  saveOnboarding: (data: OnboardingData) => void;
  startRun: () => void;
  markReady: () => void;
  requestRevision: (note: string) => void;
  acceptResult: () => void;
  sendMessage: (text: string, autoReply?: string) => void;
  ensureWelcomeMessage: (welcome: string) => void;
  submitApplication: (app: Omit<GrantApplication, "submittedAt">) => void;
  reset: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function loadState(): FoerderklarState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      offerId: normalizeOfferId(parsed.offerId),
      onboarding: {
        ...defaultOnboarding,
        ...(parsed.onboarding ?? {}),
      },
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
    };
  } catch {
    return defaults;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FoerderklarState>(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const selectOffer = useCallback((id: OfferId) => {
    setState((s) => ({ ...s, offerId: id }));
  }, []);

  const completeCheckout = useCallback(
    (input: { email: string; company: string; last4: string }) => {
      setState((s) => ({
        ...s,
        email: input.email,
        checkoutCompany: input.company,
        cardConnected: true,
        cardLast4: input.last4,
        onboarding: {
          ...s.onboarding,
          companyName: s.onboarding.companyName || input.company,
        },
      }));
    },
    [],
  );

  const saveOnboarding = useCallback((data: OnboardingData) => {
    setState((s) => ({
      ...s,
      onboarding: data,
      onboardingComplete: true,
    }));
  }, []);

  const startRun = useCallback(() => {
    setState((s) => ({
      ...s,
      runStatus: "running",
      runSeed: s.runSeed + 1,
    }));
  }, []);

  const markReady = useCallback(() => {
    setState((s) => ({ ...s, runStatus: "ready" }));
  }, []);

  const requestRevision = useCallback((note: string) => {
    setState((s) => ({
      ...s,
      revisionNote: note,
      revisionCount: s.revisionCount + 1,
      runStatus: "running",
      runSeed: s.runSeed + 1,
    }));
  }, []);

  const acceptResult = useCallback(() => {
    setState((s) => ({ ...s, runStatus: "accepted" }));
  }, []);

  const sendMessage = useCallback((text: string, autoReply?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const clientMsg: ChatMessage = {
      id: `c-${Date.now()}`,
      from: "client",
      text: trimmed,
      at: Date.now(),
    };
    setState((s) => ({ ...s, messages: [...s.messages, clientMsg] }));

    if (!autoReply) return;
    window.setTimeout(() => {
      setState((s) => ({
        ...s,
        messages: [
          ...s.messages,
          {
            id: `p-${Date.now()}`,
            from: "provider",
            text: autoReply,
            at: Date.now(),
          },
        ],
      }));
    }, 700);
  }, []);

  const ensureWelcomeMessage = useCallback((welcome: string) => {
    setState((s) => {
      if (s.messages.length > 0) return s;
      return {
        ...s,
        messages: [
          {
            id: "welcome",
            from: "provider",
            text: welcome,
            at: Date.now(),
          },
        ],
      };
    });
  }, []);

  const submitApplication = useCallback(
    (app: Omit<GrantApplication, "submittedAt">) => {
      setState((s) => ({
        ...s,
        applications: [
          ...s.applications.filter((a) => a.grantId !== app.grantId),
          { ...app, submittedAt: Date.now() },
        ],
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setState(defaults);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      state,
      hydrated,
      selectOffer,
      completeCheckout,
      saveOnboarding,
      startRun,
      markReady,
      requestRevision,
      acceptResult,
      sendMessage,
      ensureWelcomeMessage,
      submitApplication,
      reset,
    }),
    [
      state,
      hydrated,
      selectOffer,
      completeCheckout,
      saveOnboarding,
      startRun,
      markReady,
      requestRevision,
      acceptResult,
      sendMessage,
      ensureWelcomeMessage,
      submitApplication,
      reset,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
