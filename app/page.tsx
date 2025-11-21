"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Clear any existing agent ID and use our properly configured one
  useEffect(() => {
            // Set the agent ID directly in localStorage to the one created by make agent-create
        if (typeof window !== "undefined") {
            localStorage.setItem(
                "letta_agent_id",
                "agent-fa8319a7-ce81-440b-aeb9-b91f46e6967c"
            );
            console.log(
                "Set localStorage to use the agent created by make agent-create"
            );
    }
  }, []);

  // Redirect authenticated users to the main app
  useEffect(() => {
    if (!isLoading && user) {
      console.log("User already authenticated, redirecting to /prompt");
      router.push("/prompt");
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a1622]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <p className="text-cyan-400 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't show login form (redirect is happening)
  if (user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a1622]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <p className="text-cyan-400 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
