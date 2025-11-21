"use client";

import React from "react";
import { LettaChatProvider } from "@/lib/mock-letta-chat-provider";
import LettaChat from "@/components/chat/LettaChat";

export default function LettaChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Letta Agent Chat
        </h1>
        <div className="h-[calc(100vh-120px)]">
          <LettaChatProvider>
            <LettaChat />
          </LettaChatProvider>
        </div>
      </div>
    </div>
  );
}
