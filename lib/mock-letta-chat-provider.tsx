"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useToast } from "@/components/ui/use-toast";

// Exact autonomous truck case prompt
const HEALTH_CASE_PROMPT =
  "Show today's autonomous truck performance with insights from Gatik, NVIDIA, and Applied Intuition.";

// Define the interface for chat messages
export interface LettaChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
}

// Interface for the LettaChatContext
interface LettaChatContextType {
  messages: LettaChatMessage[];
  setMessages: Dispatch<SetStateAction<LettaChatMessage[]>>;
  sendMessage: (message: string, onBeforeSend?: () => void) => Promise<boolean>;
  isTyping: boolean;
  resetChat: () => Promise<void>;
  initialPrompt: string;
  setInitialPrompt: Dispatch<SetStateAction<string>>;
  sendInitialPrompt: () => Promise<void>;
  streaming: boolean;
  agentId: string | null;
  // Add dashboard state
  showMeaslesDashboard: boolean;
  isDashboardLoading: boolean;
}

// Create the context with default values
const LettaChatContext = createContext<LettaChatContextType>({
  messages: [],
  setMessages: () => {},
  sendMessage: async () => false,
  isTyping: false,
  resetChat: async () => {},
  initialPrompt: "",
  setInitialPrompt: () => {},
  sendInitialPrompt: async () => {},
  streaming: false,
  agentId: "mock-agent-id",
  // Default dashboard state
  showMeaslesDashboard: false,
  isDashboardLoading: false,
});

// Hook to use the LettaChatContext
export const useLettaChat = () => useContext(LettaChatContext);

// Mock agent ID
const MOCK_AGENT_ID = "mock-agent-id";

// The provider component that wraps the app
export const LettaChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<LettaChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(MOCK_AGENT_ID);

  // Dashboard state for measles use case
  const [showMeaslesDashboard, setShowMeaslesDashboard] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [healthPromptDetected, setHealthPromptDetected] = useState(false);
  const [responseProcessed, setResponseProcessed] = useState(false);

  // Add a new state variable to track health prompt message IDs
  const [healthPromptMessageIds, setHealthPromptMessageIds] = useState<
    Set<string>
  >(new Set());

  // Initialize the mock agent when the component mounts
  useEffect(() => {
    console.log("Initializing mock Letta agent...");
    setAgentId(MOCK_AGENT_ID);
  }, []);

  // Mock response generator
  const generateMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Health case prompts
    if (lowerMessage.includes("autonomous truck") && lowerMessage.includes("performance")) {
      return "I'm analyzing today's autonomous truck performance data from Gatik, NVIDIA, and Applied Intuition. The dashboard shows comprehensive metrics including fleet efficiency, safety scores, and operational insights. Key highlights include 98.5% route completion rate, zero safety incidents, and 15% improvement in fuel efficiency compared to last quarter.";
    }
    
    // Health related prompts
    if (lowerMessage.includes("health") || lowerMessage.includes("medical") || lowerMessage.includes("measles")) {
      return "I'm processing health data and generating insights. The system shows current health metrics, outbreak patterns, and preventive measures. Based on the latest data, I can provide detailed analysis of health trends and recommendations.";
    }
    
    // Border control prompts
    if (lowerMessage.includes("border") || lowerMessage.includes("security") || lowerMessage.includes("customs")) {
      return "Analyzing border control and security data. The system shows real-time monitoring of border crossings, security alerts, and compliance metrics. Current status indicates normal operations with enhanced screening protocols in place.";
    }
    
    // ESG and investment analysis prompts
    if (lowerMessage.includes("esg") || lowerMessage.includes("scope") || lowerMessage.includes("carbon") || 
        lowerMessage.includes("investment") || lowerMessage.includes("portfolio") || lowerMessage.includes("analysis") ||
        lowerMessage.includes("excel") || lowerMessage.includes("spreadsheet") || lowerMessage.includes("upload")) {
      return `**OMNIS is reasoning….**

Please help me calculate my (Scope 3 Category 15) financed emissions for the new set of investments I am considering. The portfolio consists of bonds, infrastructure (project finance) and real estate equity which I have uploaded via the Excel spreadsheet. I need to calculate these financed emissions in line with PCAF standard as well as our L&G internal guidance. Finally, I need to understand how these 'green' investments are compared to internal and external benchmarks.

I will read the Excel file you have uploaded and then dynamically create the required workflow to perform this task. At a high level I will perform the work using a number of agents logically grouped into distinctive categories (which can be inspected in the Directed Acyclic Graph (DAG) tab).
 
• Data acquisition agents will fetch internal and external data
• Data validation, quality, imputation and review agents will validate and assess the data quality, fetch the (internal and external) datasets to address the identified data quality issues (e.g. anomalies, gaps etc), and use agentic worker agents to independently assure the work performance
• Emission calculation agents will convert the activity data into financed emissions per the PCAF method
• Evidence collation and report production agents will produce the final output

The full workflow breakdown can be inspected in the Directed Acyclic Graph (DAG) tab

**Benchmark Comparison**

As a comparison, I will contract my Scope 3 calculations for the new investments against L&G's existing portfolio and external benchmarks.

Existing L&G Portfolio will be taken from L&G 2024 Sustainability Report unless otherwise stated.

**Analysis Execution**

**OMNIS is performing the analysis….**

**OMNIS has completed the analysis**`;
    }
    
    // Natural disaster prompts
    if (lowerMessage.includes("disaster") || lowerMessage.includes("emergency") || lowerMessage.includes("weather")) {
      return "Processing natural disaster and emergency response data. The system provides real-time alerts, risk assessments, and resource allocation recommendations. Current monitoring shows stable conditions with preventive measures activated.";
    }
    
    // Default responses - prioritize ESG analysis
    const defaultResponses = [
      `**OMNIS is reasoning….**

Please help me calculate my (Scope 3 Category 15) financed emissions for the new set of investments I am considering. The portfolio consists of bonds, infrastructure (project finance) and real estate equity which I have uploaded via the Excel spreadsheet. I need to calculate these financed emissions in line with PCAF standard as well as our L&G internal guidance. Finally, I need to understand how these 'green' investments are compared to internal and external benchmarks.

I will read the Excel file you have uploaded and then dynamically create the required workflow to perform this task. At a high level I will perform the work using a number of agents logically grouped into distinctive categories (which can be inspected in the Directed Acyclic Graph (DAG) tab).
 
• Data acquisition agents will fetch internal and external data
• Data validation, quality, imputation and review agents will validate and assess the data quality, fetch the (internal and external) datasets to address the identified data quality issues (e.g. anomalies, gaps etc), and use agentic worker agents to independently assure the work performance
• Emission calculation agents will convert the activity data into financed emissions per the PCAF method
• Evidence collation and report production agents will produce the final output

The full workflow breakdown can be inspected in the Directed Acyclic Graph (DAG) tab

**Benchmark Comparison**

As a comparison, I will contract my Scope 3 calculations for the new investments against L&G's existing portfolio and external benchmarks.

Existing L&G Portfolio will be taken from L&G 2024 Sustainability Report unless otherwise stated.

**Analysis Execution**

**OMNIS is performing the analysis….**

**OMNIS has completed the analysis**`,
      "Thank you for your message. I'm a demo assistant helping you explore the Omnis platform capabilities.",
      "Based on your query, I can provide relevant data analysis and actionable insights. The platform integrates multiple data sources for comprehensive reporting.",
      "Your message has been processed. The Omnis platform offers advanced analytics and visualization capabilities for decision-making support.",
      "I'm analyzing your request. The system provides real-time monitoring and intelligent insights to support operational efficiency."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  // Replace the existing check for measles health prompt
  useEffect(() => {
    if (messages.length === 0) return;

    // Check for any new messages that match the health prompt
    const newHealthPromptIds = new Set(healthPromptMessageIds);
    let hasNewHealthPrompt = false;

    // Check all user messages
    messages.forEach((message: LettaChatMessage) => {
      if (
        message.role === "user" &&
        !healthPromptMessageIds.has(message.id)
      ) {
        const isHealthPrompt =
          message.content === HEALTH_CASE_PROMPT.trim() ||
          (message.content.toLowerCase().includes("autonomous truck") &&
            message.content.toLowerCase().includes("performance") &&
            (message.content.toLowerCase().includes("gatik") ||
              message.content.toLowerCase().includes("nvidia") ||
              message.content.toLowerCase().includes("applied intuition")));

        if (isHealthPrompt) {
          console.log("Health prompt detected in message:", message.id);
          newHealthPromptIds.add(message.id);
          hasNewHealthPrompt = true;
        }
      }
    });

    // Update the health prompt message IDs if we found new ones
    if (hasNewHealthPrompt) {
      setHealthPromptMessageIds(newHealthPromptIds);
      setHealthPromptDetected(true);
    }

    // Only trigger dashboard if we have new health prompts AND we're not streaming AND we haven't processed a response yet
    if (hasNewHealthPrompt && !streaming && !responseProcessed) {
      setResponseProcessed(true);

      // Show loading for 5 seconds then dashboard
      setIsDashboardLoading(true);
      setTimeout(() => {
        setIsDashboardLoading(false);
        setShowMeaslesDashboard(true);
      }, 5000); // 5 seconds loading state
    }
  }, [messages, streaming, healthPromptMessageIds, responseProcessed]);

  // Function to send a message to the mock agent
  const sendMessage = useCallback(
    async (message: string, onBeforeSend?: () => void): Promise<boolean> => {
      // Prevent sending empty messages
      const trimmedMessage = message.trim();
      if (!trimmedMessage) return false;

      // Check if this is a health prompt (for debugging purposes only)
      const isHealthPrompt =
        trimmedMessage === HEALTH_CASE_PROMPT.trim() ||
        (trimmedMessage.toLowerCase().includes("autonomous truck") &&
          trimmedMessage.toLowerCase().includes("performance") &&
          (trimmedMessage.toLowerCase().includes("gatik") ||
            trimmedMessage.toLowerCase().includes("nvidia") ||
            trimmedMessage.toLowerCase().includes("applied intuition")));

      console.log("Health prompt detected:", isHealthPrompt);

      setIsTyping(true);
      setStreaming(true);

      // Create a placeholder assistant message
      const assistantResponse: LettaChatMessage = {
        id: `assistant-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      try {
        console.log("Sending mock message:", {
          message: trimmedMessage,
          agentId: MOCK_AGENT_ID,
        });

        // Add a user message to the UI immediately
        const userMessage: LettaChatMessage = {
          id: `user-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`, // Ensure uniqueness
          role: "user",
          content: trimmedMessage,
          timestamp: new Date(),
        };

        // Update state with user message
        setMessages((prevMessages: LettaChatMessage[]) => [...prevMessages, userMessage]);

        // Call the onBeforeSend callback if provided
        if (onBeforeSend) {
          onBeforeSend();
        }

        // Add the placeholder assistant message
        setMessages((prevMessages: LettaChatMessage[]) => [...prevMessages, assistantResponse]);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Generate mock response
        const responseContent = generateMockResponse(trimmedMessage);

        // Update the assistant message with the response
        setMessages((prevMessages: LettaChatMessage[]) => {
          const updatedMessages = [...prevMessages];
          const assistantIndex = updatedMessages.findIndex(
            (msg) => msg.id === assistantResponse.id
          );

          if (assistantIndex !== -1) {
            updatedMessages[assistantIndex] = {
              ...updatedMessages[assistantIndex],
              content: responseContent,
              isStreaming: false,
            };
          }

          return updatedMessages;
        });

        // Set streaming to false
        setStreaming(false);
        setIsTyping(false);
        return true;
      } catch (error: any) {
        console.error("Error in mock message processing:", error);

        // Update the assistant message with an error
        setMessages((prevMessages: LettaChatMessage[]) => {
          const updatedMessages = [...prevMessages];
          const assistantIndex = updatedMessages.findIndex(
            (msg) => msg.id === assistantResponse.id
          );

          if (assistantIndex !== -1) {
            updatedMessages[assistantIndex] = {
              ...updatedMessages[assistantIndex],
              content:
                "I'm currently in demo mode. This is a simulated response to showcase the platform's capabilities.",
              isStreaming: false,
            };
          }

          return updatedMessages;
        });

        // Set streaming to false
        setStreaming(false);
        setIsTyping(false);
        return false;
      }
    },
    [agentId]
  );

  // Function to send the initial prompt
  const sendInitialPrompt = useCallback(async () => {
    if (initialPrompt) {
      await sendMessage(initialPrompt);
    }
  }, [initialPrompt, sendMessage]);

  // Function to reset the chat
  const resetChat = useCallback(async () => {
    try {
      console.log("Resetting chat - clearing local state");

      // Clear messages in the UI
      setMessages([]);
      // Make sure we're not in streaming mode
      setStreaming(false);
      // Reset typing state
      setIsTyping(false);
      // Reset dashboard state
      setShowMeaslesDashboard(false);
      setIsDashboardLoading(false);
      setHealthPromptDetected(false);
      setResponseProcessed(false);
      // Clear health prompt message IDs
      setHealthPromptMessageIds(new Set());

      console.log("Chat fully reset, all states cleared");
    } catch (error) {
      console.error("Error resetting chat:", error);
      // Even if there's an error, we still want to clear local state
      setMessages([]);
      setStreaming(false);
      setIsTyping(false);
      setShowMeaslesDashboard(false);
      setIsDashboardLoading(false);
      setHealthPromptDetected(false);
      setResponseProcessed(false);
      setHealthPromptMessageIds(new Set());
    }
  }, [agentId]);

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
    agentId,
    showMeaslesDashboard,
    isDashboardLoading,
  };

  return (
    <LettaChatContext.Provider value={value}>
      {children}
    </LettaChatContext.Provider>
  );
};
