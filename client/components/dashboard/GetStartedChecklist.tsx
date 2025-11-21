import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ChecklistItem } from "@/types/dashboard";

interface GetStartedChecklistProps {
  items: ChecklistItem[];
}

export const GetStartedChecklist = ({ items }: GetStartedChecklistProps) => (
  <section className="rounded-3xl border border-dashed border-border/70 bg-surface-base px-6 py-6 text-sm shadow-inner">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <ClipboardList className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">Get started checklist</h2>
        <p className="text-xs text-muted-foreground">Pin scopes, upload evidence, and invite SMEs.</p>
      </div>
    </div>
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
          <Button size="sm" variant="secondary" className="rounded-full px-4 text-xs">
            {item.actionLabel}
          </Button>
        </li>
      ))}
    </ul>
  </section>
);
