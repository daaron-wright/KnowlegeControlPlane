import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useLettaChat } from "@/lib/mock-letta-chat-provider";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { ChatDashboard } from "@/components/measles-dashboard/chat-dashboard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LettaChatProps {
  className?: string;
}

// Exact autonomous truck case prompt
const HEALTH_CASE_PROMPT =
  "Show today's autonomous truck performance with insights from Gatik, NVIDIA, and Applied Intuition.";

// Helper function to determine if text is the health prompt
const isHealthPrompt = (text: string) => {
  return (
    text.trim() === HEALTH_CASE_PROMPT.trim() ||
    (text.toLowerCase().includes("autonomous truck") &&
      text.toLowerCase().includes("performance") &&
      (text.toLowerCase().includes("gatik") ||
       text.toLowerCase().includes("nvidia") ||
       text.toLowerCase().includes("applied intuition")))
  );
};

const LettaChat: React.FC<LettaChatProps> = ({ className }) => {
  const { messages, sendMessage, isTyping, streaming, agentId, resetChat } =
    useLettaChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [healthPromptIds, setHealthPromptIds] = useState<Set<string>>(
    new Set()
  );
  const [messageCount, setMessageCount] = useState(0);
  const [dashboardLoading, setDashboardLoading] = useState<{
    [key: string]: boolean;
  }>({});

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();

    // New messages detection
    if (messages.length !== messageCount) {
      setMessageCount(messages.length);

      // Process all messages to find health prompts and their responses
      processHealthMessages();
    }
  }, [messages]);

  // Process messages to find health prompts and their responses
  const processHealthMessages = () => {
    // Look for health prompts and responses
    for (let i = 0; i < messages.length - 1; i++) {
      // Find user message that could be a health prompt
      if (
        messages[i].role === "user" &&
        messages[i + 1]?.role === "assistant" &&
        isHealthPrompt(messages[i].content)
      ) {
        // Get the response message ID
        const responseId = messages[i + 1].id;

        // Skip if we've already processed this response
        if (healthPromptIds.has(responseId)) continue;

        console.log(`Found health prompt response, id: ${responseId}`);

        // Add to health prompt IDs
        const newHealthPromptIds = new Set(healthPromptIds);
        newHealthPromptIds.add(responseId);
        setHealthPromptIds(newHealthPromptIds);

        // Set loading state for this response
        setDashboardLoading((prev) => ({
          ...prev,
          [responseId]: true,
        }));

        // After 5 seconds, finish loading
        setTimeout(() => {
          setDashboardLoading((prev) => ({
            ...prev,
            [responseId]: false,
          }));
          scrollToBottom();
        }, 5000);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (content.trim() && !streaming) {
      await sendMessage(content);
    }
  };

  const handleClearConversation = async () => {
    if (confirm("Are you sure you want to clear the conversation history?")) {
      try {
        // Reset all dashboard states
        setHealthPromptIds(new Set());
        setDashboardLoading({});

        await resetChat();
        console.log("Conversation history cleared successfully");
      } catch (error) {
        console.error("Error clearing conversation history:", error);
        alert("Failed to clear conversation history. See console for details.");
      }
    }
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg border",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              {agentId
                ? "Start a conversation with Letta Agent"
                : "No Letta Agent found. Please create one with `make agent-create`"}
            </p>
          </div>
        )}

        {/* DEBUG INFO */}
        <div className="text-xs text-gray-400 mb-2">
          Messages: {messages.length} | Health responses: {healthPromptIds.size}
        </div>

        {/* Render messages in sequence */}
        {messages.map((message, index) => (
          <React.Fragment key={message.id || index}>
            {/* Message bubble */}
            <div
              className={cn(
                "relative rounded-lg p-3 max-w-[80%] mb-4",
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {message.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <span>Empty message</span>
                )}
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 bg-gray-500 ml-1 animate-pulse"></span>
                )}
              </div>
            </div>

            {/* Only show dashboard below a specific assistant message */}
            {message.role === "assistant" &&
              healthPromptIds.has(message.id) &&
              !message.isStreaming && (
                <>
                  {/* Dashboard or loading state */}
                  {dashboardLoading[message.id] ? (
                    <div className="mt-4 bg-gray-200 border border-gold/30 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gold/30">
                        <h3 className="text-sm font-medium text-gray-700">
                          Omnis is building your dashboard
                        </h3>
                      </div>
                      <div className="h-[450px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                        <div className="ml-3 text-sm text-gray-600">
                          Processing data for visualization...
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ChatDashboard />
                  )}
                </>
              )}
          </React.Fragment>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex flex-col space-y-2">
          {agentId ? (
            <>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Connected to Letta Agent: {agentId}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleClearConversation}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    disabled={streaming}
                  >
                    Clear Conversation
                  </button>
                </div>
              </div>
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={streaming}
              />
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              No agent configured
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LettaChat;
