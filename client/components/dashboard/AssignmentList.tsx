import { CalendarDays, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate, formatRelativeTime } from "@/lib/formatters";
import type { AssignmentTask } from "@/types/dashboard";

interface AssignmentListProps {
  assignments: AssignmentTask[];
  onRoute: (assignment: AssignmentTask) => void;
}

export const AssignmentList = ({ assignments, onRoute }: AssignmentListProps) => (
  <section className="rounded-[28px] border border-border/50 bg-card/95 p-6 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Assigned to me</h2>
        <p className="text-sm text-muted-foreground">Reviews and approvals awaiting action</p>
      </div>
      <CalendarDays className="h-5 w-5 text-muted-foreground" aria-hidden />
    </div>
    <ul className="mt-5 space-y-4">
      {assignments.map((assignment) => (
        <li
          key={assignment.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border/60 bg-surface-base/70 px-4 py-3.5"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">{assignment.title}</p>
            <p className="text-xs text-muted-foreground/80">
              {assignment.relatedDocument} ��� Due {formatDate(assignment.dueDate)} ({
                formatRelativeTime(assignment.dueDate)
              })
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full px-5 text-xs font-semibold shadow-none"
                onClick={() => onRoute(assignment)}
              >
                <SendHorizontal className="mr-2 h-4 w-4" aria-hidden /> Route
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Route for review</TooltipContent>
          </Tooltip>
        </li>
      ))}
    </ul>
  </section>
);
