"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OctaPharmaDashboard from "./index";
import { Header } from "@/components/layout/Header";
import { LeftRail } from "@/components/layout/LeftRail";
import { RightRail } from "@/components/layout/RightRail";
import { AuditFooter } from "@/components/layout/AuditFooter";
import { LayoutContext } from "@/context/layout-context";
import { sourceToggles } from "@/data/dashboard";
import type { AgentTraceRun, UserRole } from "@/types/dashboard";
import { toast } from "sonner";

const generateSessionId = () => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `AZ-${new Date().getFullYear()}-${random}`;
};

export function OctaPharmaChatDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("R&D");
  const [agentTrace, setAgentTrace] = useState<AgentTraceRun | null>(null);
  const [activeScopeId, setActiveScopeId] = useState<string | null>(null);
  const [activeSources, setActiveSources] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sourceToggles.map((toggle) => [toggle.id, toggle.activeByDefault])),
  );
  const sessionId = useMemo(() => generateSessionId(), []);

  const triggerToast = useCallback(
    (variant: "success" | "warning" | "error", message: string) => {
      const baseClass = "rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur";
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

  const layoutContextValue = {
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

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-gray-700">
            OctaPharma Document Intelligence Dashboard
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Expand OctaPharma Dashboard button clicked");
            setIsDialogOpen(true);
          }}
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          title="Expand to fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
          <span className="sr-only">Expand dashboard to fullscreen</span>
        </Button>
      </div>

      <div className="h-[900px] overflow-hidden relative bg-surface-base text-foreground">
        <LayoutContext.Provider value={layoutContextValue}>
          <div className="flex flex-col h-full">
            <div className="shrink-0 border-b border-border/60">
              <Header />
            </div>
            <div className="flex flex-1 overflow-hidden min-h-0">
              <div className="shrink-0 border-r border-border/50">
                <LeftRail />
              </div>
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-surface-base via-white to-surface-base px-5 py-8 lg:px-10 lg:py-10 min-w-0">
                <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
                  <OctaPharmaDashboard className="" />
                </div>
              </div>
              <div className="shrink-0 border-l border-border/50">
                <RightRail />
              </div>
            </div>
            <div className="shrink-0 border-t border-border/50">
              <AuditFooter />
            </div>
          </div>
        </LayoutContext.Provider>
      </div>

      {/* Full-screen dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="p-0 m-0 max-w-[99vw] w-[99vw] max-h-[99vh] h-[99vh] overflow-auto border-0 rounded-none">
          <DialogTitle className="sr-only">
            OctaPharma Document Intelligence Dashboard - Full Screen
          </DialogTitle>
          <div className="h-full w-full flex flex-col bg-surface-base">
            <LayoutContext.Provider value={layoutContextValue}>
              <div className="flex flex-col h-full">
                <div className="shrink-0">
                  <Header />
                </div>
                <div className="flex flex-1 overflow-hidden">
                  <div className="shrink-0">
                    <LeftRail />
                  </div>
                  <div className="flex-1 overflow-y-auto bg-gradient-to-br from-surface-base via-white to-surface-base px-5 py-8 lg:px-10 lg:py-10">
                    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
                      <OctaPharmaDashboard className="" />
                    </div>
                  </div>
                  <div className="shrink-0">
                    <RightRail />
                  </div>
                </div>
                <div className="shrink-0">
                  <AuditFooter />
                </div>
              </div>
            </LayoutContext.Provider>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

