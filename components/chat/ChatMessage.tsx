import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChatMessage as IChatMessage } from "@/lib/chat-provider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BeatLoader } from "react-spinners";

interface ChatMessageProps {
  message: IChatMessage;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, className }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-xs font-semibold">
            AI
          </div>
        </Avatar>
      )}
      <div
        className={cn(
          "relative rounded-lg p-3 max-w-[80%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="italic text-gray-500">Empty message</p>
          )}
          {message.isStreaming && (
            <div className="mt-1">
              <BeatLoader size={8} color={isUser ? "#ffffff" : "#666666"} />
            </div>
          )}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <div className="bg-secondary text-secondary-foreground h-full w-full flex items-center justify-center text-xs font-semibold">
            You
          </div>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
