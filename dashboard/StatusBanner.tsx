import { AlertOctagon, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatusBannerProps {
  type: "warning" | "error";
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const iconMap = {
  warning: <AlertTriangle className="h-5 w-5" aria-hidden />,
  error: <AlertOctagon className="h-5 w-5" aria-hidden />,
};

export const StatusBanner = ({ type, title, description, actionLabel, onAction }: StatusBannerProps) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-4 py-3",
      type === "warning"
        ? "border-banner-warning-border bg-banner-warning text-banner-warning-foreground"
        : "border-banner-error-border bg-banner-error text-banner-error-foreground",
    )}
  >
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/30 text-current">
        {iconMap[type]}
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs opacity-90">{description}</p>
      </div>
    </div>
    <Button
      size="sm"
      variant={type === "warning" ? "secondary" : "outline"}
      className={cn(
        "rounded-full px-4 text-xs font-semibold",
        type === "error" && "border-current text-current hover:bg-white/20",
      )}
      onClick={onAction}
    >
      {actionLabel}
    </Button>
  </div>
);
