"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useLayoutContext } from "@/context/layout-context";
import type { UserRole } from "@/types/dashboard";

const navItems = [
  { label: "Search", to: "/" },
  { label: "Cases", to: "/cases" },
  { label: "Reviews", to: "/reviews" },
  { label: "Admin", to: "/admin" },
];

const roleLabel: Record<UserRole, string> = {
  "R&D": "R&D",
  MSAT: "MSAT",
};

const personaDetailsByRole: Record<UserRole, { name: string; title: string; initials: string }> = {
  "R&D": {
    name: "Research & Development",
    title: "R&D Analyst",
    initials: "RD",
  },
  MSAT: {
    name: "Manufacturing Science & Technology",
    title: "MSAT Specialist",
    initials: "MS",
  },
};

export const Header = () => {
  const { role, setRole } = useLayoutContext();
  const persona = personaDetailsByRole[role];
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex h-16 items-center gap-8 px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-4">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F4f55495a54b1427b9bd40ba1c8f3c8aa%2F287cb887cca04e3486a22c41221e9d33?format=webp&width=800"
            alt="Octapharma"
            className="h-8"
          />
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/80 md:inline">
            Knowledge Control Plane
          </span>
        </Link>

        <nav className="flex flex-1 items-center gap-2 text-sm font-semibold text-muted-foreground/80">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "rounded-full px-4 py-2 transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="rounded-full border border-transparent p-2 text-muted-foreground transition hover:border-border/60 hover:text-primary">
                <Sparkles className="h-5 w-5" aria-hidden />
                <span className="sr-only">How this answer was assembled</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                How this answer was assembled
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border/70 bg-surface-strong px-3 py-1.5 text-left text-xs font-medium text-foreground shadow-sm transition-colors hover:text-primary">
              <Badge className="bg-primary/15 text-primary">
                {roleLabel[role]}
              </Badge>
              <span className="hidden text-xs font-semibold text-muted-foreground sm:inline">
                Role context
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuLabel>Switch role context</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(roleLabel) as UserRole[]).map((currentRole) => (
                <DropdownMenuItem
                  key={currentRole}
                  onSelect={() => setRole(currentRole)}
                  className={cn(
                    "flex items-center justify-between gap-2",
                    currentRole === role && "text-primary",
                  )}
                >
                  <span>{currentRole}</span>
                  {currentRole === role && <Badge className="bg-primary text-primary-foreground">Active</Badge>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-3 rounded-full border border-border/70 bg-surface-strong px-3 py-1.5 shadow-sm">
            <Avatar className="h-9 w-9 border border-border/70">
              <AvatarFallback className="bg-primary/15 text-primary">{persona.initials}</AvatarFallback>
            </Avatar>
            <div className="hidden text-xs sm:flex sm:flex-col">
              <span className="font-semibold text-foreground">{persona.name}</span>
              <span className="text-muted-foreground">{persona.title}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

