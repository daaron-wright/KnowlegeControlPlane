import { createContext, useContext } from "react";

import type { AgentTraceRun, UserRole } from "@/types/dashboard";

export interface LayoutContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  sessionId: string;
  agentTrace: AgentTraceRun | null;
  setAgentTrace: (trace: AgentTraceRun | null) => void;
  triggerToast: (variant: "success" | "warning" | "error", message: string) => void;
  activeScopeId: string | null;
  setActiveScopeId: (scopeId: string | null) => void;
  activeSources: Record<string, boolean>;
  setSourceState: (id: string, enabled: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextValue | null>(null);

export const useLayoutContext = () => {
  const ctx = useContext(LayoutContext);

  if (!ctx) {
    throw new Error("useLayoutContext must be used within a LayoutContext provider");
  }

  return ctx;
};
