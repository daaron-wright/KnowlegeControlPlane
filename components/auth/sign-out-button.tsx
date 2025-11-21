"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";

type SignOutButtonProps = {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

export function SignOutButton({
  className,
  variant = "ghost",
}: SignOutButtonProps) {
  const { signOut, isLoading } = useAuth();

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={signOut}
      disabled={isLoading}
      className={className}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
}