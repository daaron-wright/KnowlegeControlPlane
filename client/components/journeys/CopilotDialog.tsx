import { useMemo, useState } from "react";

import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLayoutContext } from "@/context/layout-context";
import type {
  JourneyActionFeedback,
  JourneyCopilotConfig,
  JourneyCopilotFollowUp,
  JourneyCopilotMessage,
} from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface CopilotDialogProps {
  config: JourneyCopilotConfig;
}

const mapFeedbackToToastVariant = (feedback?: JourneyActionFeedback) => feedback?.variant ?? "success";

const CopilotMessage = ({ message }: { message: JourneyCopilotMessage }) => {
  const isAssistant = message.role === "assistant";
  const badgeClasses = cn(
    "rounded-full px-3 py-1 text-xs",
    isAssistant ? "bg-status-info/15 text-status-info" : "bg-primary/15 text-primary",
  );
  const bubbleClasses = cn(
    "space-y-2 rounded-2xl border px-4 py-3 text-sm shadow-sm",
    isAssistant
      ? "border-border/70 bg-surface-raised text-foreground"
      : "border-primary/30 bg-primary text-primary-foreground",
  );
  const alignment = cn("flex max-w-[540px] flex-col gap-2", isAssistant ? "mr-auto" : "ml-auto");

  return (
    <div className={alignment}>
      <div className="flex items-center gap-2">
        <Badge className={badgeClasses}>{message.author}</Badge>
        {message.timestamp && <span className="text-[11px] text-muted-foreground">{message.timestamp}</span>}
      </div>
      <div className={bubbleClasses}>
        <p>{message.content}</p>
        {message.highlights && message.highlights.length > 0 && (
          <ul className="space-y-1 text-xs text-muted-foreground">
            {message.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
        {message.suggestion && <p className="text-xs text-muted-foreground">{message.suggestion}</p>}
      </div>
    </div>
  );
};

const FollowUpButton = ({ followUp, onSelect }: { followUp: JourneyCopilotFollowUp; onSelect: () => void }) => (
  <Button
    key={followUp.id}
    variant="outline"
    className="h-auto rounded-full px-5 py-2 text-sm font-semibold"
    onClick={onSelect}
  >
    {followUp.label}
  </Button>
);

export const CopilotDialog = ({ config }: CopilotDialogProps) => {
  const { triggerToast } = useLayoutContext();
  const [open, setOpen] = useState(false);

  const followUpDescriptions = useMemo(
    () => config.followUps?.filter((followUp) => followUp.description) ?? [],
    [config.followUps],
  );

  const handleFollowUp = (followUp: JourneyCopilotFollowUp) => {
    setOpen(false);
    if (followUp.feedback) {
      triggerToast(mapFeedbackToToastVariant(followUp.feedback), followUp.feedback.message);
    } else {
      triggerToast("success", `${followUp.label} sent to Copilot.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-5 text-sm font-semibold">
          <MessageCircle className="mr-2 h-4 w-4" aria-hidden />
          {config.triggerLabel}
          <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl gap-6">
        <DialogHeader>
          <DialogTitle>Investigation Copilot</DialogTitle>
          <DialogDescription>{config.summary}</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border border-border/60 bg-surface-raised/70 p-4 shadow-inner">
          <ScrollArea className="max-h-[420px] pr-4">
            <div className="flex flex-col gap-4 py-2">
              {config.conversation.map((message) => (
                <CopilotMessage key={message.id} message={message} />
              ))}
            </div>
          </ScrollArea>
        </div>
        {config.followUps && config.followUps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Copilot follow-ups
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {config.followUps.map((followUp) => (
                <FollowUpButton key={followUp.id} followUp={followUp} onSelect={() => handleFollowUp(followUp)} />
              ))}
            </div>
            {followUpDescriptions.length > 0 && (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {followUpDescriptions.map((followUp) => (
                  <li key={followUp.id}>
                    <span className="font-semibold text-foreground">{followUp.label}:</span> {followUp.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <DialogClose asChild>
            <Button className="rounded-full px-5">Close window</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
