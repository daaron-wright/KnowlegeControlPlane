import { useEffect, useState } from "react";
import { Fingerprint, ShieldCheck } from "lucide-react";

import { useLayoutContext } from "@/context/layout-context";
import { formatDateTime } from "@/lib/formatters";
import { personaDetailsByRole } from "@/data/personas";

export const AuditFooter = () => {
  const { role, sessionId } = useLayoutContext();
  const persona = personaDetailsByRole[role];
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
