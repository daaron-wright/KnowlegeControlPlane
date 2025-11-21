import { useMemo } from "react";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLayoutContext } from "@/context/layout-context";
import { savedScopes, sourceToggles } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/formatters";

export const LeftRail = () => {
  const {
    role,
    triggerToast,
    activeScopeId,
    setActiveScopeId,
    activeSources,
    setSourceState,
  } = useLayoutContext();

  const scopesForRole = useMemo(
    () => savedScopes.filter((scope) => scope.role === role),
    [role],
  );

  const handleScopeApply = (scopeLabel: string, scopeId: string) => {
    setActiveScopeId(scopeId);
    triggerToast("success", `${scopeLabel} scope applied to search, cases, and charts.`);
  };

  const handleToggle = (id: string, label: string) => (checked: boolean) => {
    setSourceState(id, checked);
    triggerToast(
      checked ? "success" : "warning",
      checked
        ? `${label} sources enabled in semantic retrieval.`
        : `${label} sources excluded until re-enabled.`,
    );
  };

  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-border/50 bg-gradient-to-b from-surface-base/50 to-surface-base px-6 py-8 lg:block">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80">
        <span>Saved scopes</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-primary"
          onClick={() =>
            triggerToast(
              "warning",
              "Scope management is handled in Admin — change-control required to edit global scopes.",
            )
          }
        >
          <Filter className="mr-1 h-3.5 w-3.5" aria-hidden />
          Manage
        </Button>
      </div>
      <div className="mt-4 space-y-4">
        {scopesForRole.map((scope) => {
          const isActive = activeScopeId === scope.id;
          return (
            <div
              key={scope.id}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg",
                isActive && "border-primary/60 shadow-[0_18px_40px_-24px_rgba(38,82,200,0.45)]",
              )}
            >
              <span
                className={cn(
                  "absolute inset-y-4 left-4 w-1 rounded-full bg-gradient-to-b from-primary/80 via-primary to-primary/50 opacity-0 transition group-hover:opacity-70",
                  isActive && "opacity-90",
                )}
                aria-hidden
              />
              <div className="pl-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{scope.label}</h3>
                    <p className="mt-1 text-xs text-muted-foreground/80">{scope.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {scope.filters.map((filter) => (
                    <span
                      key={filter}
                      className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-primary"
                    >
                      {filter}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground/80">
                  <span>Updated {formatRelativeTime(scope.lastUpdated)}</span>
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 rounded-full px-4 text-[11px] font-semibold",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "border-primary/30 text-primary hover:bg-primary/10",
                    )}
                    onClick={() => handleScopeApply(scope.label, scope.id)}
                  >
                    {isActive ? "Scope active" : "Apply scope"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 border-t border-border/40 pt-6">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80">
          <span>Sources</span>
          <span className="text-[10px] text-muted-foreground/80">Role-aware</span>
        </div>
        <div className="mt-4 space-y-3.5">
          {sourceToggles.map((source) => {
            const active = activeSources[source.id];
            return (
              <label
                key={source.id}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-3xl border bg-card px-4 py-3.5 shadow-sm transition hover:shadow-md",
                  active ? "border-primary/50" : "border-border/50",
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{source.label}</p>
                  <p className="text-xs text-muted-foreground/80">{source.description}</p>
                </div>
                <Switch
                  checked={active}
                  onCheckedChange={handleToggle(source.id, source.label)}
                  className="mt-1"
                />
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
