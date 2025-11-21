import type { ReactNode } from "react";

import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Circle,
  FileText,
  Info,
  Layers,
  MessageCircle,
  NotebookPen,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CopilotDialog } from "@/components/journeys/CopilotDialog";
import { useLayoutContext } from "@/context/layout-context";
import { cn } from "@/lib/utils";
import type {
  Journey,
  JourneyAction,
  JourneyEmptyState,
  JourneySection,
} from "@/types/dashboard";

type JourneyTone = "default" | "info" | "warning" | "success" | "danger" | "muted" | "positive";

type JourneyStatus = "completed" | "warning" | "pending";

type CalloutTone = "info" | "warning" | "success" | "danger";

type EmptyStateTone = "info" | "warning" | "error";

const toneClassMap: Record<JourneyTone, string> = {
  default: "text-foreground",
  info: "text-status-info",
  warning: "text-banner-warning-foreground",
  success: "text-status-success",
  danger: "text-banner-error-foreground",
  muted: "text-muted-foreground",
  positive: "text-status-success",
};

const chipToneClassMap: Partial<Record<JourneyTone, string>> = {
  default: "bg-surface-strong text-foreground",
  info: "bg-status-info/15 text-status-info",
  warning: "bg-banner-warning text-banner-warning-foreground",
  success: "bg-status-success/15 text-status-success",
  danger: "bg-banner-error text-banner-error-foreground",
  positive: "bg-status-success/15 text-status-success",
};

const calloutToneClassMap: Record<CalloutTone, string> = {
  info: "border-status-info/20 bg-status-info/10 text-status-info",
  warning: "border-banner-warning-border bg-banner-warning text-banner-warning-foreground",
  success: "border-status-success/20 bg-status-success/10 text-status-success",
  danger: "border-banner-error-border bg-banner-error text-banner-error-foreground",
};

const emptyStateToneConfig: Record<EmptyStateTone, { icon: ReactNode; className: string }> = {
  info: {
    icon: <Info className="h-5 w-5" aria-hidden />,
    className: "border-status-info/40 bg-status-info/10 text-status-info",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" aria-hidden />,
    className: "border-banner-warning-border bg-banner-warning text-banner-warning-foreground",
  },
  error: {
    icon: <AlertOctagon className="h-5 w-5" aria-hidden />,
    className: "border-banner-error-border bg-banner-error text-banner-error-foreground",
  },
};

const statusIconMap: Record<JourneyStatus, ReactNode> = {
  completed: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />,
  warning: <AlertTriangle className="h-3.5 w-3.5" aria-hidden />,
  pending: <Circle className="h-3.5 w-3.5" aria-hidden />,
};

const statusClassMap: Record<JourneyStatus, string> = {
  completed: "border-primary/40 bg-primary/10 text-primary",
  warning: "border-banner-warning-border bg-banner-warning text-banner-warning-foreground",
  pending: "border-border/60 bg-surface-base text-muted-foreground",
};

const journeyIcon = <NotebookPen className="h-5 w-5" aria-hidden />;

const scopeIconMap: Record<string, React.ReactNode> = {
  "SharePoint PDFs": <FileText className="h-4 w-4" aria-hidden />,
  "PPT decks": <Layers className="h-4 w-4" aria-hidden />,
  "DOCX procedures": <FileText className="h-4 w-4" aria-hidden />,
  Deviations: <AlertTriangle className="h-4 w-4" aria-hidden />,
  Validations: <CheckCircle2 className="h-4 w-4" aria-hidden />,
  PQ: <Layers className="h-4 w-4" aria-hidden />,
  "Batch records": <FileText className="h-4 w-4" aria-hidden />,
};

const renderSection = (section: JourneySection) => {
  switch (section.type) {
    case "description": {
      return (
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            section.emphasis && "text-foreground font-semibold",
          )}
        >
          {section.text}
        </p>
      );
    }
    case "chips": {
      const toneClass = chipToneClassMap[section.tone ?? "default"] ?? chipToneClassMap.default!;
      return (
        <div className="space-y-2">
          {section.label && <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{section.label}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {section.chips.map((chip) => (
              <Badge key={chip} className={cn("rounded-full px-3 py-1 text-xs", toneClass)}>
                {chip}
              </Badge>
            ))}
          </div>
        </div>
      );
    }
    case "key-value": {
      const columns = section.columns ?? 2;
      return (
        <dl
          className={cn(
            "grid gap-3",
            columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
          )}
        >
          {section.items.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-2xl border border-border/60 bg-surface-raised px-4 py-3 shadow-sm"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </dt>
              <dd className={cn("mt-2 text-sm font-semibold", item.tone && toneClassMap[item.tone])}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      );
    }
    case "bullet-list": {
      const ListTag = section.ordered ? "ol" : "ul";
      return (
        <div className="space-y-2">
          {section.title && <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{section.title}</p>}
          <ListTag className="space-y-3 text-sm text-muted-foreground">
            {section.items.map((item) => (
              <li key={item.label} className="rounded-2xl border border-border/50 bg-surface-raised px-4 py-3 shadow-sm">
                <p className="font-semibold text-foreground">{item.label}</p>
                {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
              </li>
            ))}
          </ListTag>
        </div>
      );
    }
    case "timeline": {
      return (
        <div className="space-y-3">
          {section.title && <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{section.title}</p>}
          <ol className="relative ml-3 border-l border-dashed border-border/70 pl-6">
            {section.steps.map((step) => (
              <li key={step.title} className="mb-6 last:mb-0">
                <span
                  className={cn(
                    "absolute -left-[13px] mt-2 flex h-6 w-6 items-center justify-center rounded-full border",
                    statusClassMap[step.status],
                  )}
                >
                  {statusIconMap[step.status]}
                </span>
                <div className="rounded-2xl border border-border/60 bg-surface-raised px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    }
    case "table": {
      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {section.title}
          </p>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface-raised shadow-sm">
            <table className="min-w-full divide-y divide-border/70 text-left text-sm">
              <thead className="bg-surface-strong text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {section.columns.map((column) => (
                    <th key={column} className="px-4 py-3">{column}</th>
                  ))}
                  {section.rows.some((row) => row.annotation) && <th className="px-4 py-3">Status</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-sm text-muted-foreground">
                {section.rows.map((row, index) => (
                  <tr key={row.cells.join("-") + index} className="odd:bg-surface-base even:bg-surface-raised/60">
                    {row.cells.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`} className="px-4 py-3 align-top">
                        {cell}
                      </td>
                    ))}
                    {section.rows.some((r) => r.annotation) && (
                      <td className="px-4 py-3 align-top">
                        {row.annotation ? (
                          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                            {row.annotation}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {section.footnotes && (
            <ul className="space-y-1 text-xs text-muted-foreground">
              {section.footnotes.map((footnote) => (
                <li key={footnote}>• {footnote}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    case "callout": {
      return (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm shadow-sm",
            calloutToneClassMap[section.tone],
          )}
        >
          <p className="text-sm font-semibold">{section.title}</p>
          <p className="mt-1 text-sm opacity-90">{section.body}</p>
        </div>
      );
    }
    case "insight": {
      return (
        <div className="rounded-2xl border border-border/60 bg-surface-raised px-4 py-4 shadow-sm">
          <p className="text-sm font-semibold text-foreground">Insight</p>
          <p className="mt-2 text-sm text-muted-foreground">{section.answer}</p>
          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold uppercase tracking-wide text-muted-foreground">Passage pins</p>
            <ul className="space-y-2">
              {section.sources.map((source) => (
                <li
                  key={source.title}
                  className="rounded-xl border border-border/60 bg-surface-base px-3 py-2 text-xs"
                >
                  <span className="block font-semibold text-foreground">{source.title}</span>
                  <span className="mt-1 block text-muted-foreground">{source.snippet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Assumptions
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {section.assumptions.map((assumption) => (
                <li key={assumption}>• {assumption}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    case "memo": {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {section.sections.map((memoSection) => (
            <div
              key={memoSection.title}
              className="rounded-2xl border border-border/60 bg-surface-raised px-4 py-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {memoSection.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{memoSection.content}</p>
              {memoSection.citation && (
                <p className="mt-3 text-xs font-semibold text-primary">{memoSection.citation}</p>
              )}
            </div>
          ))}
        </div>
      );
    }
    case "toggles": {
      return (
        <div className="space-y-3">
          {section.label && (
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.label}
            </p>
          )}
          <div className="space-y-2">
            {section.toggles.map((toggle) => (
              <label
                key={toggle.id}
                htmlFor={toggle.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-surface-raised px-4 py-3 shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{toggle.label}</p>
                  {toggle.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{toggle.description}</p>
                  )}
                </div>
                <Switch
                  id={toggle.id}
                  defaultChecked={toggle.defaultState ?? false}
                  className={cn(
                    "data-[state=checked]:bg-primary",
                    toggle.tone === "warning" && "data-[state=checked]:bg-banner-warning-border",
                    toggle.tone === "danger" && "data-[state=checked]:bg-banner-error-border",
                    toggle.tone === "success" && "data-[state=checked]:bg-status-success",
                  )}
                  disabled
                />
              </label>
            ))}
          </div>
          {section.note && <p className="text-xs text-muted-foreground">{section.note}</p>}
        </div>
      );
    }
    case "metrics": {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {section.items.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-2xl border border-border/60 bg-surface-raised px-4 py-3 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <p className={cn("mt-2 text-lg font-semibold", item.tone && toneClassMap[item.tone])}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
};

const renderActions = (
  actions: JourneyAction[] | undefined,
  onAction: (action: JourneyAction) => void,
) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  const mapVariant = (variant: JourneyAction["variant"]) => {
    switch (variant) {
      case "primary":
        return "default" as const;
      case "secondary":
        return "outline" as const;
      case "ghost":
      default:
        return "ghost" as const;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {actions.map((action) => (
        <div key={action.id} className="flex items-center gap-3">
          <Button
            variant={mapVariant(action.variant)}
            className="rounded-full px-5 py-2 text-sm font-semibold"
            onClick={() => onAction(action)}
          >
            {action.label}
          </Button>
          {action.description && (
            <span className="text-xs text-muted-foreground">{action.description}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const JourneyEmptyStates = ({ emptyStates }: { emptyStates: JourneyEmptyState[] }) => (
  <div className="mt-6 space-y-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      Key empty & error states
    </p>
    <div className="grid gap-3 md:grid-cols-2">
      {emptyStates.map((state) => {
        const config = emptyStateToneConfig[state.tone];
        return (
          <div
            key={state.id}
            className={cn(
              "rounded-2xl border px-4 py-4 shadow-sm",
              config.className,
            )}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                {config.icon}
              </span>
              <div>
                <p className="text-sm font-semibold">{state.title}</p>
                <p className="mt-1 text-xs opacity-90">{state.description}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide">Resolution</p>
                <p className="mt-1 text-xs opacity-90">{state.resolution}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export const JourneyTimeline = ({ journey }: { journey: Journey }) => {
  const { triggerToast } = useLayoutContext();

  const handleAction = (action: JourneyAction) => {
    if (action.feedback) {
      triggerToast(action.feedback.variant, action.feedback.message);
    } else {
      triggerToast("success", `${action.label} sent to Copilot.`);
    }
  };

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {journeyIcon}
              {journey.persona}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">{journey.name}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{journey.description}</p>
          </div>
          <Badge className="rounded-full bg-primary/10 px-4 py-1 text-primary">Journey</Badge>
        </div>

        <div className="rounded-2xl border border-border/60 bg-surface-raised px-4 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prompt</p>
          <p className="mt-2 text-base italic text-foreground">“{journey.defaultPrompt}”</p>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary px-4 py-1 text-primary-foreground">
              {journey.scopeLabel}
            </Badge>
            {journey.sources.map((source) => (
              <span
                key={source}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface-raised px-3 py-1 text-xs text-muted-foreground"
              >
                {scopeIconMap[source] ?? <FileText className="h-4 w-4" aria-hidden />}
                {source}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{journey.scopeDescription}</p>
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={journey.frames.map((frame) => frame.id)}
        className="mt-6 space-y-4"
      >
        {journey.frames.map((frame) => (
          <AccordionItem
            key={frame.id}
            value={frame.id}
            className="overflow-hidden rounded-3xl border border-border/60 bg-surface-raised shadow-sm"
          >
            <AccordionTrigger className="px-5 py-5 text-left text-base font-semibold text-foreground">
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {frame.subtitle}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{frame.title}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5">
              <div className="space-y-5">
                {frame.sections.map((section, index) => (
                  <div key={`${frame.id}-${index}`}>{renderSection(section)}</div>
                ))}
                {renderActions(frame.actions, handleAction)}
                {frame.copilot && (
                  <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-surface-base px-4 py-3 shadow-inner">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      Copilot assistance
                    </div>
                    <CopilotDialog config={frame.copilot} />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <JourneyEmptyStates emptyStates={journey.emptyStates} />
    </section>
  );
};
