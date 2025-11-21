"use client";

import { useEffect, useState } from "react";
import { Fingerprint, ShieldCheck } from "lucide-react";
import { useLayoutContext } from "@/context/layout-context";

// Simple date/time formatter
const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.valueOf())) {
    return isoDate;
  }
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Persona details by role
const personaDetailsByRole: Record<string, { name: string; title: string }> = {
  "R&D": {
    name: "Research & Development",
    title: "R&D Analyst",
  },
  MSAT: {
    name: "Manufacturing Science & Technology",
    title: "MSAT Specialist",
  },
};

export const AuditFooter = () => {
  const context = useLayoutContext();
  const role = context?.role || "R&D";
  const sessionId = context?.sessionId || "N/A";
  const persona = personaDetailsByRole[role] || personaDetailsByRole["R&D"];
  const [timestamp, setTimestamp] = useState(() => formatDateTime(new Date().toISOString()));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const interval = window.setInterval(() => {
      setTimestamp(formatDateTime(new Date().toISOString()));
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <footer className="mt-auto border-t border-border/50 bg-gradient-to-r from-surface-base via-white to-surface-base px-6 py-5 text-xs text-muted-foreground/80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
          Session persona: {persona.name} • Role: {persona.title}
        </span>
        <span className="inline-flex items-center gap-2 text-muted-foreground/70">
          <Fingerprint className="h-4 w-4 text-muted-foreground/70" aria-hidden />
          Session ID: {sessionId} • {timestamp}
        </span>
      </div>
    </footer>
  );
};

