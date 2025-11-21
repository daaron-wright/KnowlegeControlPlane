"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-provider";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    const checkAuth = () => {
      const hasSession = !!session;
      
      console.log("Auth check result:", hasSession ? "Authenticated" : "Not authenticated");
      
      if (!hasSession) {
        console.log("No session found, redirecting to login");
        window.location.href = "/";
        return;
      }
      
      setIsAuthenticated(true);
    };
    
    checkAuth();
  }, [session]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}