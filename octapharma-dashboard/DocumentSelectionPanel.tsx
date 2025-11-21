"use client";

import { type KeyboardEvent } from "react";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatConfidence, formatRelativeTime } from "./adapters/formatters";
import { cn } from "@/lib/utils";
import type { DocumentRecord } from "./adapters/types";

interface DocumentSelectionPanelProps {
  documents: DocumentRecord[];
  selectedIds: string[];
  focusedId: string | null;
  promptedIds: string[];
  onToggle: (id: string) => void;
  onFocus: (id: string) => void;
  onPrompt: (document: DocumentRecord) => void;
  onClear: () => void;
  lastPromptedId?: string | null;
}

const highlightPreview = (text: string) => text.replace(/\[\[|\]\]/g, "").trim();

export const DocumentSelectionPanel = ({
  documents,
  selectedIds,
  focusedId,
  promptedIds,
  onToggle,
  onFocus,
  onPrompt,
  onClear,
  lastPromptedId,
}: DocumentSelectionPanelProps) => {
  const hasSelection = selectedIds.length > 0;

  return (
    <section className="rounded-[28px] border border-border/50 bg-card/90 p-5 shadow-lg">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/65">Document selection</p>
          <h2 className="text-lg font-semibold text-foreground">Select documents to brief</h2>
          <p className="text-xs text-muted-foreground/75">
            Choose one or more validated sources. Prompting focused documents drives the contextual insight spotlight.
          </p>
        </div>
        {hasSelection && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-4 text-xs font-semibold text-primary hover:bg-primary/10"
            onClick={onClear}
          >
            Clear selection
          </Button>
        )}
      </header>

      {documents.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground/75">No documents available. Run a search to populate selectable records.</p>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-2">
          {documents.map((document) => {
            const isSelected = selectedIds.includes(document.id);
            const isFocused = focusedId === document.id;
            const isLatestPrompt = lastPromptedId === document.id;
            const isPrompted = promptedIds.includes(document.id);
            const preview = highlightPreview(document.highlight);

            const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onToggle(document.id);
              }
            };

            return (
              <div
                key={document.id}
                role="button"
                tabIndex={0}
                onClick={() => onToggle(document.id)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "group flex h-full flex-col rounded-3xl border px-5 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-card",
                  isSelected
                    ? "border-primary/60 bg-primary/10 shadow-[0_12px_40px_-24px_rgba(37,99,235,0.5)]"
                    : "border-border/60 bg-card/85 hover:border-primary/30 hover:bg-primary/5",
                )}
                aria-pressed={isSelected}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border bg-background/70",
                      isPrompted ? "border-primary/50 text-primary" : "border-border/60 text-primary",
                    )}
                  >
                    {isPrompted ? <Sparkles className="h-5 w-5" aria-hidden /> : isSelected ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <Circle className="h-5 w-5" aria-hidden />}
                  </span>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{document.title}</p>
                      {isLatestPrompt && (
                        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
                          Latest prompt
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground/65">
                      {document.docType} • Version {document.version}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/55">
                      {isPrompted ? (isLatestPrompt ? "Insights ready • recent prompt" : "Insights ready") : isSelected ? "Ready to prompt" : "Awaiting prompt"}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground/85">
                  {preview ? (preview.length > 160 ? `${preview.slice(0, 157)}…` : preview) : "No summary snippet captured."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground/70">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                    {formatConfidence(document.confidence)} confidence
                  </span>
                  <span>Last opened {formatRelativeTime(document.lastOpened)}</span>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/60">
                    {isPrompted ? (isFocused ? "Insights ready • focused" : "Insights ready") : isSelected ? "Select a prompt" : "Select to prompt"}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant={isPrompted ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-9 rounded-full px-4 text-xs font-semibold",
                        isPrompted
                          ? "bg-primary text-primary-foreground"
                          : isSelected
                            ? "border-primary/50 text-primary hover:bg-primary/10"
                            : "border-border/60 text-muted-foreground",
                      )}
                      disabled={!isSelected}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (!isSelected) {
                          return;
                        }
                        onPrompt(document);
                      }}
                    >
                      {isPrompted ? "Refresh insight" : "Prompt insight"}
                      <Sparkles className="ml-2 h-4 w-4" aria-hidden />
                    </Button>
                    <Button
                      variant={isFocused ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-9 rounded-full px-4 text-xs font-semibold",
                        isFocused ? "bg-primary text-primary-foreground" : "border-primary/40 text-primary hover:bg-primary/10",
                      )}
                      onClick={(event) => {
                        event.stopPropagation();
                        onFocus(document.id);
                      }}
                    >
                      {isFocused ? "Focused" : "Focus insight"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

