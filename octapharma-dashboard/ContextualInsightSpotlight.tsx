"use client";

import { type ReactNode } from "react";
import { ArrowUpRight, ClipboardCheck, FileText, Layers, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatConfidence, formatDate, formatRelativeTime } from "./adapters/formatters";
import type { DocumentRecord, SavedScope } from "./adapters/types";

interface ContextualInsightSpotlightProps {
  primaryDocument: DocumentRecord;
  supportingDocument?: DocumentRecord | null;
  primarySummary: ReactNode;
  supportingSummary?: ReactNode | null;
  prompt: string;
  scope: SavedScope | null | undefined;
  contextFilters: string[];
  onOpenBrief: () => void;
  onRouteAction: (actionLabel: string, summary: string) => void;
}

const buildRecommendationList = (
  primaryDocument: DocumentRecord,
  supportingDocument?: DocumentRecord | null,
  contextFilters: string[] = [],
) => {
  const items: string[] = [
    `Route ${primaryDocument.title} (${primaryDocument.version}) to ${primaryDocument.owner} for R&D sign-off`,
    `Capture contextual brief metadata and confidence (${formatConfidence(primaryDocument.confidence)}) in the case workspace`,
  ];

  if (supportingDocument) {
    items.push(`Attach ${supportingDocument.title} (${supportingDocument.version}) as quantitative backing`);
  }

  if (contextFilters.length > 0) {
    items.push(`Lock scope filters: ${contextFilters.join(", ")}`);
  }

  return items;
};

export const ContextualInsightSpotlight = ({
  primaryDocument,
  supportingDocument,
  primarySummary,
  supportingSummary,
  prompt,
  scope,
  contextFilters,
  onOpenBrief,
  onRouteAction,
}: ContextualInsightSpotlightProps) => {
  const recommendationItems = buildRecommendationList(primaryDocument, supportingDocument, contextFilters);

  return (
    <section className="rounded-[32px] border border-border/60 bg-surface-base/85 p-6 shadow-[0_32px_80px_-60px_rgba(33,71,182,0.65)]">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
              Contextual insight
            </Badge>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
              {formatConfidence(primaryDocument.confidence)} confidence
            </span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">{primaryDocument.title}</h2>
          <p className="text-xs text-muted-foreground/70">
            Version {primaryDocument.version} • Owner {primaryDocument.owner} • Validated {formatDate(primaryDocument.lastValidated)} • Last opened {formatRelativeTime(primaryDocument.lastOpened)}
          </p>
        </div>
      </header>

      <Tabs defaultValue="insight" className="mt-6 w-full">
        <TabsList className="flex w-full flex-wrap gap-2 rounded-2xl bg-primary/10 p-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary/70">
          <TabsTrigger
            value="insight"
            className="flex-1 rounded-xl px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Insight
          </TabsTrigger>
          <TabsTrigger
            value="evidence"
            className="flex-1 rounded-xl px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Evidence
          </TabsTrigger>
          <TabsTrigger
            value="plan"
            className="flex-1 rounded-xl px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Plan
          </TabsTrigger>
          <TabsTrigger
            value="scope"
            className="flex-1 rounded-xl px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Scope
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insight" className="mt-4">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground/90">
            <p>{primarySummary}</p>
            {supportingDocument && supportingSummary && (
              <p className="text-muted-foreground/80">
                Supporting evidence in <span className="font-semibold text-foreground">{supportingDocument.title}</span> highlights {supportingSummary}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/75">
              <FileText className="h-4 w-4" aria-hidden />
              <span>
                Prompt: <span className="font-semibold text-foreground">"{prompt}"</span>
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="mt-4">
          <div className="space-y-4">
            <dl className="space-y-3 text-sm text-muted-foreground/90">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground/70">Document</dt>
                <dd className="text-right font-semibold text-foreground">
                  {primaryDocument.title} • {primaryDocument.version}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground/70">Owner</dt>
                <dd className="text-right font-semibold text-foreground">{primaryDocument.owner}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground/70">Validated</dt>
                <dd className="text-right font-semibold text-foreground">{formatDate(primaryDocument.lastValidated)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground/70">Confidence</dt>
                <dd className="text-right font-semibold text-foreground">{formatConfidence(primaryDocument.confidence)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground/70">Last opened</dt>
                <dd className="text-right font-semibold text-foreground">{formatRelativeTime(primaryDocument.lastOpened)}</dd>
              </div>
            </dl>
            {supportingDocument && (
              <div className="rounded-2xl border border-border/50 bg-background/60 p-3 text-xs text-muted-foreground/75">
                <p className="font-semibold text-foreground">Supporting source</p>
                <p className="mt-1 text-muted-foreground/80">
                  {supportingDocument.title} • {supportingDocument.version} ({formatConfidence(supportingDocument.confidence)})
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="plan" className="mt-4">
          <div className="space-y-4">
            <ul className="space-y-3 text-sm text-muted-foreground/90">
              {recommendationItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Target className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="rounded-full border-border/60 px-5 py-2 text-sm font-semibold text-primary hover:border-primary/40 hover:bg-primary/10"
                onClick={onOpenBrief}
              >
                Create contextual brief
                <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                className="rounded-full px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                onClick={() =>
                  onRouteAction(
                    `Assign follow-up to ${primaryDocument.owner}`,
                    `${primaryDocument.title} requires R&D action`
                  )
                }
              >
                Assign follow-up owner
                <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scope" className="mt-4">
          <div className="space-y-4 text-sm text-muted-foreground/90">
            <div className="flex items-start gap-3">
              <Layers className="mt-1 h-4 w-4 text-primary" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">Scope</p>
                <p className="text-sm font-semibold text-foreground">{scope?.label ?? "Default scope"}</p>
                {scope?.description && <p className="text-xs text-muted-foreground/70">{scope.description}</p>}
              </div>
            </div>
            {contextFilters.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">Filters</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {contextFilters.map((filter) => (
                    <Badge
                      key={filter}
                      variant="outline"
                      className="border-border/60 bg-background/70 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/75"
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-2xl border border-border/50 bg-background/60 p-3 text-xs text-muted-foreground/75">
              <ClipboardCheck className="h-4 w-4 text-primary" aria-hidden />
              <span>Audit trail updated {formatRelativeTime(primaryDocument.lastOpened)} with confidence vector sync.</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

