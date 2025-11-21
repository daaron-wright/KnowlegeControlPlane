"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  SendHorizontal,
  Shield,
  Timer,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate, formatRelativeTime } from "@/components/octapharma-dashboard/adapters/formatters";
import { useLayoutContext } from "@/context/layout-context";
import type { AgentTraceRun, AssignmentTask } from "@/types/dashboard";

// Simple formatters for RightRail
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

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

const formatTokens = (tokens: number) => {
  if (tokens < 1000) return `${tokens}`;
  return `${(tokens / 1000).toFixed(1)}k`;
};

// Mock data
const assignedTasks: AssignmentTask[] = [
  {
    id: "task-1",
    title: "Review SOP-123 v9 changes",
    relatedDocument: "SOP-123 v9",
    dueDate: "2025-01-20T00:00:00Z",
    owner: "R&D",
  },
  {
    id: "task-2",
    title: "Approve PQ evidence packet",
    relatedDocument: "PQ-Line-5-2024Q4",
    dueDate: "2025-01-18T00:00:00Z",
    owner: "MSAT",
  },
];

const complianceBadges = {
  dataPolicy: "GDPR compliant",
  environment: "Production",
};

const TraceStep = ({ trace }: { trace: AgentTraceRun }) => (
  <ol className="relative ml-2 border-l border-dashed border-border/80 pl-6">
    {trace.steps.map((step) => {
      const isWarning = step.status === "warning";
      const isError = step.status === "error";
      return (
        <li key={step.id} className="mb-6 last:mb-0">
          <span
            className={cn(
              "absolute -left-[10px] mt-1 flex h-5 w-5 items-center justify-center rounded-full border bg-surface-raised",
              isWarning && "border-banner-warning-border bg-banner-warning",
              isError && "border-banner-error-border bg-banner-error",
              !isWarning && !isError && "border-primary/40 text-primary",
            )}
          >
            {isWarning ? (
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            ) : isError ? (
              <Shield className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            )}
          </span>
          <div className="rounded-2xl border border-border/60 bg-surface-raised p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{step.stage}</p>
                <p className="text-sm font-semibold text-foreground">{step.toolName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  {formatDuration(step.durationMs)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Database className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  {formatTokens(step.tokensUsed)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  {formatDateTime(step.startedAt)}
                </span>
              </div>
            </div>
            {step.notes && <p className="mt-3 text-sm text-muted-foreground/90">{step.notes}</p>}
          </div>
        </li>
      );
    })}
  </ol>
);

export const RightRail = () => {
  const { agentTrace, sessionId, role, triggerToast } = useLayoutContext();

  const assignments = useMemo(
    () => assignedTasks.filter((assignment) => assignment.owner === role || assignment.owner === "Quality"),
    [role],
  );

  const handleRoute = (assignment: AssignmentTask) => {
    triggerToast("warning", `Route for review initiated for ${assignment.relatedDocument}.`);
  };

  return (
    <aside className="hidden w-[320px] shrink-0 border-l border-border/50 bg-gradient-to-b from-surface-base/40 to-surface-base px-6 py-8 xl:block">
      <Accordion type="multiple" defaultValue={["assigned", "compliance", "agent-trace"]} className="space-y-4">
        <AccordionItem
          value="assigned"
          className="overflow-hidden rounded-[28px] border border-border/60 bg-card/95 shadow-lg"
        >
          <AccordionTrigger className="px-5 text-left text-sm font-semibold text-foreground">
            <span className="flex flex-col text-left">
              <span>Assigned to me</span>
              <span className="text-xs font-normal text-muted-foreground/80">Reviews and approvals awaiting action</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            {assignments.length > 0 ? (
              <ul className="space-y-3">
                {assignments.map((assignment) => (
                  <li
                    key={assignment.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface-base/80 px-4 py-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground/80">
                        {assignment.relatedDocument} • Due {formatDate(assignment.dueDate)} ({formatRelativeTime(assignment.dueDate)})
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full px-4 text-xs font-semibold shadow-none"
                      onClick={() => handleRoute(assignment)}
                    >
                      <SendHorizontal className="mr-2 h-4 w-4" aria-hidden /> Route
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-surface-base/80 px-4 py-6 text-center text-sm text-muted-foreground">
                No assignments require your action right now.
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="compliance"
          className="overflow-hidden rounded-[28px] border border-border/60 bg-card/95 shadow-lg"
        >
          <AccordionTrigger className="px-5 text-left text-sm font-semibold text-foreground">
            <span className="flex flex-col text-left">
              <span>Compliance</span>
              <span className="text-xs font-normal text-muted-foreground/80">Session controls</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="flex items-center gap-3 rounded-2xl bg-primary/10 px-4 py-3 text-primary">
              <Shield className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wide">Audit ready</span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-semibold text-foreground">{role}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Data policy</dt>
                <dd className="font-semibold text-foreground">{complianceBadges.dataPolicy}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Session ID</dt>
                <dd className="font-semibold text-foreground">{sessionId}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Platform</dt>
                <dd className="font-semibold text-foreground">{complianceBadges.environment}</dd>
              </div>
            </dl>
            <div className="mt-5 rounded-2xl bg-status-info/10 px-4 py-3 text-xs text-status-info">
              <p className="font-semibold uppercase tracking-wide">Audit logging enabled</p>
              <p className="text-status-info/80">
                Every agent orchestration is captured with immutable timestamps.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="agent-trace"
          className="overflow-hidden rounded-[28px] border border-border/60 bg-card/95 shadow-lg"
        >
          <AccordionTrigger className="px-5 text-left text-sm font-semibold text-foreground">
            <span className="flex flex-col text-left">
              <span>Agent trace</span>
              <span className="text-xs font-normal text-muted-foreground/80">Traceable orchestration steps</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            {agentTrace ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-surface-strong px-3.5 py-3 text-xs text-muted-foreground/80">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{agentTrace.query}</span>
                    <span>{formatDateTime(agentTrace.startedAt)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>{formatTokens(agentTrace.totalTokens)}</span>
                    <span>{formatDuration(agentTrace.totalDurationMs)}</span>
                  </div>
                </div>
                <TraceStep trace={agentTrace} />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-surface-base/80 px-4 py-6 text-center">
                <p className="text-sm font-medium text-foreground">Agent trace will appear after your next search.</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  We log every tool call with timestamps, tokens, and validation outcomes.
                </p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

