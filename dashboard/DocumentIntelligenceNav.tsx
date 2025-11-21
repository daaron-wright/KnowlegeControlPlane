import { type LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface DocumentIntelligenceNavItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  path: string;
  icon: LucideIcon;
}

interface DocumentIntelligenceNavProps {
  items: DocumentIntelligenceNavItem[];
  onNavigate: (item: DocumentIntelligenceNavItem) => void;
}

export const DocumentIntelligenceNav = ({ items, onNavigate }: DocumentIntelligenceNavProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="AI document intelligence navigation"
      className="grid gap-3 rounded-[28px] border border-border/50 bg-surface-base/70 p-4 shadow-inner md:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            type="button"
            variant="ghost"
            className="group flex h-full flex-col items-start rounded-2xl border border-transparent bg-transparent p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
            onClick={() => onNavigate(item)}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/70">
              {item.eyebrow}
            </span>
            <div className="mt-3 flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/70 text-primary transition group-hover:border-primary/40 group-hover:bg-primary/10">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground/80">{item.description}</p>
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition group-hover:gap-2">
              {item.actionLabel}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </Button>
        );
      })}
    </nav>
  );
};
