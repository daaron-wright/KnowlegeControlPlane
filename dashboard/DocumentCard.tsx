import {
  AlertTriangle,
  FileCheck2,
  FileText,
  GitCompare,
  Layers,
  NotebookPen,
} from "lucide-react";
import { Fragment, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatConfidence, formatDate, formatRelativeTime } from "@/lib/formatters";
import type { DocumentRecord } from "@/types/dashboard";

interface DocumentCardProps {
  record: DocumentRecord;
  onOpen: (record: DocumentRecord) => void;
  onCompare: (record: DocumentRecord) => void;
  onAddToCase: (record: DocumentRecord) => void;
  isSelected?: boolean;
}

const iconMap: Record<string, ReactNode> = {
  SOP: <NotebookPen className="h-5 w-5" aria-hidden />,
  Deviation: <AlertTriangle className="h-5 w-5" aria-hidden />,
  Validation: <FileCheck2 className="h-5 w-5" aria-hidden />,
  PQ: <Layers className="h-5 w-5" aria-hidden />,
};

const parseHighlight = (text: string) => {
  const parts = text.split(/(\[\[|\]\])/);
  const content: ReactNode[] = [];
  let isHighlight = false;

  for (const part of parts) {
    if (part === "[[") {
      isHighlight = true;
      continue;
    }
    if (part === "]]" && isHighlight) {
      isHighlight = false;
      continue;
    }
    if (!part) continue;

    content.push(
      <Fragment key={`${part}-${content.length}`}>
        {isHighlight ? (
          <mark className="rounded bg-white/20 px-1 font-semibold text-white">{part}</mark>
        ) : (
          part
        )}
      </Fragment>,
    );
  }

  return content;
};

const getConfidenceTone = (confidence: number) => {
  if (confidence >= 0.9) {
    return {
      label: "High confidence",
      indicatorClass: "bg-emerald-300",
    };
  }
  if (confidence >= 0.8) {
    return {
      label: "Moderate confidence",
      indicatorClass: "bg-amber-300",
    };
  }
  return {
    label: "Low confidence",
    indicatorClass: "bg-rose-300",
  };
};

export const DocumentCard = ({ record, onOpen, onCompare, onAddToCase, isSelected = false }: DocumentCardProps) => {
  const Icon = iconMap[record.docType] ?? <FileText className="h-5 w-5" aria-hidden />;
  const confidenceTone = getConfidenceTone(record.confidence);

  return (
    <article
      className={cn(
        "rounded-[28px] border border-white/20 bg-white/10 p-6 text-white shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl",
        isSelected && "border-white/70 bg-white/15 shadow-xl"
      )}
      aria-pressed={isSelected}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          {isSelected && (
            <span className="sr-only">Selected document context</span>
          )}
          <span className="flex h-12 w-12 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white">
            {Icon}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{record.title}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    {record.version}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Lock this version</TooltipContent>
              </Tooltip>
              <span className="rounded-full border border-white/30 bg-white/10 px-2 py-1 text-[11px] font-medium text-white/80">
                {record.docType}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{parseHighlight(record.highlight)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/70">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            <span className={cn("h-1.5 w-1.5 rounded-full", confidenceTone.indicatorClass)} />
            {confidenceTone.label}
          </span>
          <span className="text-white/75">Confidence {formatConfidence(record.confidence)}</span>
          <span className="text-white/70">Last validated {formatDate(record.lastValidated)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/70">
          <span>Owner: {record.owner}</span>
          <span>
            Last opened {formatRelativeTime(record.lastOpened)} • Source: {record.source}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" className="rounded-full px-5 shadow-none" onClick={() => onOpen(record)}>
            Open
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-white/50 bg-white/10 px-5 text-white shadow-none hover:bg-white/20"
            onClick={() => onCompare(record)}
          >
            <GitCompare className="mr-2 h-4 w-4" aria-hidden /> Compare
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full px-5 text-white hover:bg-white/15"
            onClick={() => onAddToCase(record)}
          >
            Add to Case
          </Button>
          {!record.validated && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-300/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> Needs validation
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
