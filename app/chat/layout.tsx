"use client";

import AuthGuard from "@/components/auth/auth-guard";
import { LettaChatProvider } from "@/lib/mock-letta-chat-provider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <LettaChatProvider>{children}</LettaChatProvider>
    </AuthGuard>
  );
}
