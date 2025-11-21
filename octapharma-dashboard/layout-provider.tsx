"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
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

interface LayoutProviderProps {
  children: React.ReactNode;
  initialRole?: UserRole;
}

export function LayoutProvider({ children, initialRole = "R&D" }: LayoutProviderProps) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [agentTrace, setAgentTrace] = useState<AgentTraceRun | null>(null);
  const [activeScopeId, setActiveScopeId] = useState<string | null>(null);
  const [activeSources, setActiveSources] = useState<Record<string, boolean>>({});

  const triggerToast = useCallback((variant: "success" | "warning" | "error", message: string) => {
    // Use browser console for now, can be replaced with a toast library
    console.log(`[Toast ${variant}]: ${message}`);
  }, []);

  const setSourceState = useCallback((id: string, enabled: boolean) => {
    setActiveSources((prev) => ({ ...prev, [id]: enabled }));
  }, []);

  const value: LayoutContextValue = {
    role,
    setRole,
    sessionId,
    agentTrace,
    setAgentTrace,
    triggerToast,
    activeScopeId,
    setActiveScopeId,
    activeSources,
    setSourceState,
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

