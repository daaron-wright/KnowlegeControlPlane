"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { processQuery, processStreamQuery } from "./api";

// Define the interface for chat messages
export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
}

// Interface for the ChatContext
interface ChatContextType {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  sendMessage: (content: string) => Promise<void>;
  isTyping: boolean;
  resetChat: () => void;
  initialPrompt: string;
  setInitialPrompt: Dispatch<SetStateAction<string>>;
  sendInitialPrompt: () => Promise<void>;
  streaming: boolean;
}

// Create the context with default values
const ChatContext = createContext<ChatContextType>({
  messages: [],
  setMessages: () => {},
  sendMessage: async () => {},
  isTyping: false,
  resetChat: () => {},
  initialPrompt: "",
  setInitialPrompt: () => {},
  sendInitialPrompt: async () => {},
  streaming: false,
});

// Hook to use the ChatContext
export const useChat = () => useContext(ChatContext);

// The provider component that wraps the app
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [streaming, setStreaming] = useState(false);

  // Function to send a message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create a user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Create an empty assistant message that will be filled with streaming content
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isStreaming: true,
    };

    // Add both messages to the chat
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsTyping(true);
    setStreaming(true);

    try {
      await processStreamQuery(
        content,
        true,
        (chunk) => {
          // Update the assistant message with each new chunk
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const assistantMessageIndex = updatedMessages.findIndex(
              (msg) => msg.id === assistantMessage.id
            );

            if (assistantMessageIndex !== -1) {
              updatedMessages[assistantMessageIndex] = {
                ...updatedMessages[assistantMessageIndex],
                content: updatedMessages[assistantMessageIndex].content + chunk,
              };
            }

            return updatedMessages;
          });
        },
        (error) => {
          // Handle error in streaming
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const assistantMessageIndex = updatedMessages.findIndex(
              (msg) => msg.id === assistantMessage.id
            );

            if (assistantMessageIndex !== -1) {
              updatedMessages[assistantMessageIndex] = {
                ...updatedMessages[assistantMessageIndex],
                content: `Error: ${error}`,
                isStreaming: false,
              };
            }

            return updatedMessages;
          });
          setIsTyping(false);
          setStreaming(false);
        },
        () => {
          // Mark streaming as complete
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const assistantMessageIndex = updatedMessages.findIndex(
              (msg) => msg.id === assistantMessage.id
            );

            if (assistantMessageIndex !== -1) {
              updatedMessages[assistantMessageIndex] = {
                ...updatedMessages[assistantMessageIndex],
                isStreaming: false,
              };
            }

            return updatedMessages;
          });
          setIsTyping(false);
          setStreaming(false);
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);

      // Update the assistant message with the error
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const assistantMessageIndex = updatedMessages.findIndex(
          (msg) => msg.id === assistantMessage.id
        );

        if (assistantMessageIndex !== -1) {
          updatedMessages[assistantMessageIndex] = {
            ...updatedMessages[assistantMessageIndex],
            content: "Sorry, there was an error processing your request.",
            isStreaming: false,
          };
        }

        return updatedMessages;
      });

      setIsTyping(false);
      setStreaming(false);
    }
  };

  // Function to send the initial prompt
  const sendInitialPrompt = async () => {
    if (initialPrompt) {
      await sendMessage(initialPrompt);
    }
  };

  // Function to reset the chat
  const resetChat = () => {
    setMessages([]);
  };

  // The provider value
  const value = {
    messages,
    setMessages,
    sendMessage,
    isTyping,
    resetChat,
    initialPrompt,
    setInitialPrompt,
    sendInitialPrompt,
    streaming,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
