import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useChat } from "@/lib/chat-provider";

interface ChatContainerProps {
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  const { messages, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg border",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              Start a conversation with Omnis AI
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {error && (
          <div className="my-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            Error: {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatContainer;
