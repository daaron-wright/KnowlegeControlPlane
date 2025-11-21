import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { useChat } from "@/lib/chat-provider";

interface ChatInputProps {
  className?: string;
  // Optional callback for external message handling (for Letta integration)
  onSendMessage?: (content: string) => Promise<void>;
  // Optional prop to disable the input externally
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  className,
  onSendMessage,
  disabled: externalDisabled,
}) => {
  const [message, setMessage] = useState("");
  // Use the chat context only if onSendMessage is not provided
  const { sendMessage, streaming } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine if input should be disabled based on external prop or streaming state
  const isDisabled =
    externalDisabled !== undefined ? externalDisabled : streaming;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      // Use the provided callback or fall back to context
      if (onSendMessage) {
        await onSendMessage(message);
      } else {
        await sendMessage(message);
      }
      setMessage("");
    }
  };

  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center space-x-2 ${className}`}
    >
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isDisabled}
        className="flex-grow"
      />
      <Button
        type="submit"
        disabled={!message.trim() || isDisabled}
        variant="default"
        size="icon"
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
