"use client";

import { BookmarkCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SavedPrompt } from "./adapters/types";

interface SavedPromptListProps {
  prompts: SavedPrompt[];
  onSelect: (prompt: SavedPrompt) => void;
  activePromptId?: string | null;
  onReset?: () => void;
}

export const SavedPromptList = ({ prompts, onSelect, activePromptId, onReset }: SavedPromptListProps) => (
  <section className="rounded-[28px] border border-border/50 bg-card/95 px-6 py-5 shadow-lg">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Saved prompts</h2>
        <p className="text-xs text-muted-foreground/75">Reusable instructions tailored to your role</p>
      </div>
      <div className="flex items-center gap-2">
        {activePromptId && onReset && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-3 text-xs font-semibold text-muted-foreground hover:text-primary"
            onClick={onReset}
          >
            Clear
          </Button>
        )}
        <BookmarkCheck className="h-4 w-4 text-muted-foreground/80" aria-hidden />
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {prompts.map((prompt) => {
        const isActive = activePromptId === prompt.id;
        return (
          <Button
            key={prompt.id}
            variant="outline"
            className={cn(
              "rounded-full border-border/70 bg-surface-base px-4 py-1.5 text-xs font-semibold text-muted-foreground transition",
              isActive && "border-primary/50 bg-primary/10 text-primary",
            )}
            onClick={() => onSelect(prompt)}
            title={prompt.description}
            aria-pressed={isActive}
          >
            {prompt.label}
          </Button>
        );
      })}
    </div>
  </section>
);

