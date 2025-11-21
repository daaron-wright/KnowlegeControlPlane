import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";

import { LayoutContext } from "@/context/layout-context";
import { Header } from "@/components/layout/Header";
import { LeftRail } from "@/components/layout/LeftRail";
import { RightRail } from "@/components/layout/RightRail";
import { AuditFooter } from "@/components/layout/AuditFooter";
import { sourceToggles } from "@/data/dashboard";
import type { AgentTraceRun, UserRole } from "@/types/dashboard";

const generateSessionId = () => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `AZ-${new Date().getFullYear()}-${random}`;
};

export const MainLayout = () => {
  const [role, setRole] = useState<UserRole>("R&D");
  const [agentTrace, setAgentTrace] = useState<AgentTraceRun | null>(null);
  const [activeScopeId, setActiveScopeId] = useState<string | null>(null);
  const [activeSources, setActiveSources] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sourceToggles.map((toggle) => [toggle.id, toggle.activeByDefault])),
  );
  const sessionId = useMemo(() => generateSessionId(), []);

  const triggerToast = useCallback(
    (variant: "success" | "warning" | "error", message: string) => {
      const baseClass =
        "rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur";

      switch (variant) {
        case "success":
          toast.success(message, {
            className: `${baseClass} border-status-success/50 bg-status-success/10 text-status-success`,
          });
          break;
        case "warning":
          toast.warning(message, {
            className: `${baseClass} border-banner-warning-border bg-banner-warning text-banner-warning-foreground`,
          });
          break;
        case "error":
          toast.error(message, {
            className: `${baseClass} border-banner-error-border bg-banner-error text-banner-error-foreground`,
          });
          break;
      }
    },
    [],
  );

  const setSourceState = useCallback((id: string, enabled: boolean) => {
    setActiveSources((prev) => ({ ...prev, [id]: enabled }));
  }, []);

  useEffect(() => {
    setActiveScopeId(null);
  }, [role]);

  return (
    <LayoutContext.Provider
      value={{
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
      }}
    >
      <div className="flex min-h-screen flex-col bg-surface-base text-foreground">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <LeftRail />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-surface-base via-white to-surface-base px-5 py-8 lg:px-10 lg:py-10">
            <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
              <Outlet />
            </div>
          </main>
          <RightRail />
        </div>
        <AuditFooter />
      </div>
    </LayoutContext.Provider>
  );
};
