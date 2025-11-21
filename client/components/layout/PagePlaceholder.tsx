import { FileInput, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useLayoutContext } from "@/context/layout-context";

interface PagePlaceholderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export const PagePlaceholder = ({
  title,
  description,
  actionLabel = "Return to dashboard",
  actionTo = "/",
}: PagePlaceholderProps) => {
  const { role } = useLayoutContext();

  return (
    <section className="rounded-3xl border border-dashed border-border/60 bg-surface-raised px-8 py-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {title === "Cases" ? (
          <Workflow className="h-6 w-6" aria-hidden />
        ) : (
          <FileInput className="h-6 w-6" aria-hidden />
        )}
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      <p className="mt-2 text-xs text-muted-foreground/80">
        Current role context: <span className="font-semibold text-foreground">{role}</span>
      </p>
      <div className="mt-6 flex justify-center">
        <Button asChild variant="secondary" className="rounded-full px-6">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      </div>
    </section>
  );
};
