import { Search, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { SavedScope, SearchExample } from "@/types/dashboard";

interface GlobalSearchPanelProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  activeScope: SavedScope | undefined;
  scopes: SavedScope[];
  onScopeChange: (scope: SavedScope) => void;
  examples: SearchExample[];
}

export const GlobalSearchPanel = ({
  query,
  onQueryChange,
  onSubmit,
  placeholder,
  activeScope,
  scopes,
  onScopeChange,
  examples,
}: GlobalSearchPanelProps) => {
  const [open, setOpen] = useState(false);
  const showcaseScope = activeScope ?? scopes[0] ?? null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-primary/15 bg-gradient-to-br from-primary/95 via-primary/85 to-[#3b5ed7] p-6 text-primary-foreground shadow-[0_48px_96px_-60px_rgba(33,71,182,0.65)] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -top-32 right-[-18%] h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-[-25%] left-[10%] h-80 w-80 rounded-full bg-white/5 blur-3xl" aria-hidden />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white">
              KNOWLEDGE CONTROL PLANE
            </span>
            <p className="max-w-xl text-sm leading-relaxed text-white">
              Launch semantic searches anchored in validated evidence, compare revisions, and brief leadership with a single prompt.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/30 bg-white/10 p-5 text-white shadow-xl backdrop-blur">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
            >
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60"
                  aria-hidden
                />
                <Input
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder={placeholder}
                  className="h-14 rounded-2xl border border-white/35 bg-white/10 pl-12 pr-4 text-base text-white placeholder:text-white/60 focus-visible:border-white/60 focus-visible:ring-2 focus-visible:ring-white/40"
                />
              </div>
              <div className="flex flex-col gap-2 sm:w-auto sm:flex-row">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-14 rounded-2xl border border-white/40 bg-white/5 px-5 text-sm font-semibold text-white shadow-none hover:bg-white/15"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden />
                      Examples
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-[320px] rounded-3xl border border-white/30 bg-white/10 p-4 text-white shadow-xl backdrop-blur"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
                      Quick prompts
                    </p>
                    <div className="mt-3 space-y-2">
                      {examples.map((example) => (
                        <button
                          key={example.id}
                          type="button"
                          onClick={() => {
                            onQueryChange(example.prompt);
                            setOpen(false);
                            onSubmit();
                          }}
                          className="w-full rounded-2xl border border-white/30 bg-white/5 px-3 py-3 text-left text-sm text-white transition hover:border-white/50 hover:bg-white/10"
                        >
                          <span className="block font-semibold">{example.prompt}</span>
                          <span className="mt-1 block text-xs text-white">
                            {example.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  type="submit"
                  variant="outline"
                  className="h-14 rounded-2xl border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white shadow-[0_20px_40px_-20px_rgba(33,71,182,0.65)] hover:bg-white/20"
                >
                  Search
                </Button>
              </div>
            </form>

            {activeScope && (
              <div className="mt-5 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Active scope
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {activeScope.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeScope.filters.map((filter) => (
                    <span
                      key={filter}
                      className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white"
                    >
                      {filter}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {scopes.map((scope) => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => onScopeChange(scope)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 transition",
                        activeScope.id === scope.id
                          ? "border-white/60 bg-white/20 text-white"
                          : "border-white/30 bg-white/5 text-white hover:border-white/50",
                      )}
                    >
                      {scope.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative hidden min-h-[280px] overflow-hidden rounded-[28px] border border-white/25 bg-white/10 p-6 text-white shadow-xl backdrop-blur lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-10 bottom-[-30%] h-56 w-56 rounded-full bg-white/20 blur-3xl" aria-hidden />
          <div className="relative space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
              Snapshot
            </p>
            <h2 className="text-2xl font-semibold leading-snug text-white">
              {showcaseScope ? showcaseScope.label : "Role-ready evidence"}
            </h2>
            <p className="text-sm leading-relaxed text-white">
              {showcaseScope
                ? showcaseScope.description
                : "Curated filters keep Octapharma’s MSAT teams aligned on the latest validations and deviations."}
            </p>
          </div>
          {showcaseScope && (
            <div className="relative mt-4 space-y-2 text-xs text-white">
              {showcaseScope.filters.map((filter) => (
                <div
                  key={filter}
                  className="flex items-center gap-3 rounded-2xl border border-white/35 bg-white/10 px-3 py-2"
                >
                  <span className="h-2 w-2 rounded-full bg-white" aria-hidden />
                  <span className="font-semibold uppercase tracking-wide text-white">{filter}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
