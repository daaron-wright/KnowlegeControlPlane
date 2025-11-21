"use client";

import { useState, useEffect, useRef, Suspense, useMemo, useCallback } from "react";
import type { ComponentType, KeyboardEvent } from "react";
import { Mic, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useInitialPrompt } from "@/hooks/useInitialPrompt";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-provider";
import { useLettaChat } from "@/lib/mock-letta-chat-provider";
import { ChatDashboard } from "@/components/measles-dashboard/chat-dashboard";
import { TVGChatDashboard } from "@/components/tvg-dashboard/tvg-chat-dashboard";
import { ESGChatProvider } from "@/components/esg-chat-provider";
import { ESGChatDashboard } from "@/components/esg-dashboard/chat-dashboard";
import { OctaPharmaDAGVisualization } from "@/components/octaPharma-dag-visualization";
import { ESGDAGVisualization } from "@/components/esg-dag-visualization";
import { OctaPharmaChatDashboard } from "@/components/octapharma-dashboard/chat-dashboard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { VideoPopup } from "@/components/VideoPopup";
import { useVideoSettings } from "@/lib/video-settings-provider";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { clearDAGMemory } from "@/components/dag/visualization";
import { toast } from "sonner";

import { LayoutContext } from "@/context/layout-context";
import { Header } from "@/components/layout/Header";
import { LeftRail } from "@/components/layout/LeftRail";
import { RightRail } from "@/components/layout/RightRail";
import { AuditFooter } from "@/components/layout/AuditFooter";
import { sourceToggles } from "@/data/dashboard";
import type { AgentTraceRun, UserRole } from "@/types/dashboard";

const DAGVisualization = dynamic(
  () => import("@/components/dag").then((mod) => mod.DAGVisualization),
  { ssr: false },
);

// Prompt detection functions - shared across components
const isHealthPrompt = (content: string) => {
  const HEALTH_KEYWORDS = [
    "health",
    "hospital",
    "medical",
    "patient",
    "diagnosis",
    "treatment",
    "symptoms",
    "disease",
    "infection",
    "vaccine",
    "measles",
    "uae",
    "emirates",
  ];
  const lowerContent = content.toLowerCase();
  return HEALTH_KEYWORDS.some((keyword) => lowerContent.includes(keyword));
};

const isIzuzuPrompt = (content: string) => {
  const ISUZU_CASE_PROMPT = "Show me productivity and sustainability insights for the Isuzu pickup.";
  const exactMatch = content.trim() === ISUZU_CASE_PROMPT.trim();
  const partialMatch =
    content.toLowerCase().includes("isuzu") &&
    content.toLowerCase().includes("pickup") &&
    (content.toLowerCase().includes("productivity") ||
      content.toLowerCase().includes("sustainability"));
  const result = exactMatch || partialMatch;
  console.log(`ISUZU CHECK: "${content.substring(0, 30)}..." - Result: ${result ? "YES" : "NO"}`);
  return result;
};

const isBackToSchoolPrompt = (content: string) => {
  const BACK_TO_SCHOOL_PROMPT =
    "What's the best way to increase attach rate for Back-to-School customers like Emily, while reducing WISMO contact volume over the next 4 weeks?";
  const exactMatch = content.trim() === BACK_TO_SCHOOL_PROMPT.trim();
  const partialMatch =
    content.toLowerCase().includes("back-to-school") &&
    content.toLowerCase().includes("attach rate") &&
    content.toLowerCase().includes("emily") &&
    content.toLowerCase().includes("wismo");
  const result = exactMatch || partialMatch;
  console.log(`BACK-TO-SCHOOL CHECK: "${content.substring(0, 30)}..." - Result: ${result ? "YES" : "NO"}`);
  return result;
};

const isESGPrompt = (content: string) => {
  // First check if it's an OctaPharma prompt - if so, don't match as ESG
  // This prevents false positives when OctaPharma prompts contain words like "compliance" or "sustainability"
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes("octapharma") || 
      lowerContent.includes("octa pharma") ||
      lowerContent.includes("msat") ||
      lowerContent.includes("r&d") ||
      lowerContent.includes("deviation") ||
      lowerContent.includes("batch") ||
      lowerContent.includes("sop") ||
      lowerContent.includes("pq") ||
      lowerContent.includes("pharmaceutical")) {
    return false;
  }
  
  const ESG_KEYWORDS = [
    "esg",
    "scope 3",
    "financed emissions",
    "carbon footprint",
    "greenhouse gas",
    "ghg",
    "pcaf",
    "category 15",
  ];
  const hasESGKeywords = ESG_KEYWORDS.some((keyword) => lowerContent.includes(keyword));
  
  // Require more specific ESG context to avoid false positives
  const isESGAnalysis =
    lowerContent.includes("financed emissions") ||
    lowerContent.includes("category 15") ||
    lowerContent.includes("scope 3") ||
    (lowerContent.includes("portfolio") && lowerContent.includes("esg")) ||
    (lowerContent.includes("investments") && (lowerContent.includes("emissions") || lowerContent.includes("esg")));
  
  return hasESGKeywords && isESGAnalysis;
};

const isOctaPharmaPrompt = (content: string) => {
  const OCTAPHARMA_KEYWORDS = [
    "octapharma",
    "octa pharma",
    "manufacturing",
    "deviation",
    "msat",
    "r&d",
    "research",
    "experiment",
    "batch",
    "sop",
    "pq",
    "quality",
    "pharmaceutical",
    "production",
    "compliance",
    "validation",
  ];
  const lowerContent = content.toLowerCase();
  return OCTAPHARMA_KEYWORDS.some((keyword) => lowerContent.includes(keyword));
};

const generateSessionId = () => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `AZ-${new Date().getFullYear()}-${random}`;
};

function ChatExperience() {
  const { initialPrompt, clearInitialPrompt } = useInitialPrompt();
  const { user } = useAuth();
  const { isVideoEnabled } = useVideoSettings();
  const [inputValue, setInputValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("Chat");
  const [showNewMessageAnimation, setShowNewMessageAnimation] = useState(false);
  const [initialPromptProcessed, setInitialPromptProcessed] = useState(false);
  const [dashboardLoadingState, setDashboardLoadingState] = useState<Record<string, boolean>>({});
  const [dashboardLoaded, setDashboardLoaded] = useState<Record<string, boolean>>({});
  const [tabSwitched, setTabSwitched] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadedDashboardsRef = useRef<Set<string>>(new Set());
  const [initialRender, setInitialRender] = useState(true);
  const router = useRouter();
  const { messages, sendMessage, streaming, resetChat, agentId } = useLettaChat();
  const defaultResponse = `Following the surge in hospital visits after the major public event in UAE, our analysis has revealed several important patterns and potential risk factors. The findings suggest targeted interventions may be required in specific regions.

1. Key Health Metrics
Analysis of data collected from health facilities across the country shows a 28% increase in respiratory complaints in the three days following the event. This is particularly pronounced in the northern emirates where attendance was highest.
• Infection Rate Spike: 18% increase over the baseline in Abu Dhabi and 23% in Dubai.
• Vaccination Coverage: Areas with lower vaccination rates showed 3.2x higher hospitalization rates.
• Demographic Distribution: 62% of cases were in the 20-40 age group, correlating with event attendance demographics.`;
  const deduplicatedMessages = useMemo(() => {
    const uniqueMessageIds = new Set<string>();
    return messages.filter((message) => {
      if (uniqueMessageIds.has(message.id)) {
        return false;
      }
      uniqueMessageIds.add(message.id);
      return true;
    });
  }, [messages]);
  const latestQuery = useMemo(() => {
    for (let i = deduplicatedMessages.length - 1; i >= 0; i--) {
      if (deduplicatedMessages[i].role === "user") {
        return deduplicatedMessages[i].content;
      }
    }
    return initialPrompt || "Chat";
  }, [deduplicatedMessages, initialPrompt]);
  const [newMessageSent, setNewMessageSent] = useState(false);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const seenHealthPromptsRef = useRef<Set<string>>(new Set());
  const [showMeaslesVideoPopup, setShowMeaslesVideoPopup] = useState(false);
  const [showChatOutputVideoPopup, setShowChatOutputVideoPopup] = useState(false);
  const [dagCompleted, setDagCompleted] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [lastCompletedMessageId, setLastCompletedMessageId] = useState("");
  const [completedDAGsByMessage, setCompletedDAGsByMessage] = useState<Record<string, boolean>>({});
  const [completedDashboardsByMessage, setCompletedDashboardsByMessage] = useState<Record<string, boolean>>({});

  const handleClearConversation = async () => {
    if (confirm("Are you sure you want to clear the conversation history?")) {
      try {
        await resetChat();
        console.log("Conversation history cleared successfully");
      } catch (error) {
        console.error("Error clearing conversation history:", error);
        alert("Failed to clear conversation history. See console for details.");
      }
    }
  };

  const processInitialPrompt = async () => {
    if (agentId && initialPrompt && !initialPromptProcessed) {
      setInitialPromptProcessed(true);
      console.log(
        `Processing initial prompt for agent ${agentId}: ${initialPrompt.substring(0, 30)}...`,
      );
      const isHealth = isHealthPrompt(initialPrompt);
      const isIsuzu = isIzuzuPrompt(initialPrompt);
      const isESG = isESGPrompt(initialPrompt);
      if (isHealth || isIsuzu || isESG) {
        const workflowType = isHealth ? "health" : isIsuzu ? "isuzu" : "esg";
          console.log(`Initial prompt: Clearing cached DAG state for ${workflowType} workflow to ensure fresh execution`);
         try {
           // Clear all DAG memory - clearDAGMemory requires an ID, but we want to clear all
           if (typeof window !== "undefined") {
             localStorage.removeItem("omnis_completed_dags");
           }
         } catch (error) {
           console.error("Failed to clear DAG memory on initial prompt:", error);
         }
        if (isESG) {
          const storedDAGs = localStorage.getItem("omnis_completed_dags");
          if (storedDAGs) {
            try {
              const completedDAGs = JSON.parse(storedDAGs);
              const filteredDAGs = completedDAGs.filter((id: string) => !id.startsWith("esg-dag-"));
              localStorage.setItem("omnis_completed_dags", JSON.stringify(filteredDAGs));
              console.log("Initial prompt: Cleared all ESG DAG cache entries for fresh execution");
            } catch (e) {
              console.error("Error clearing ESG DAG cache on initial prompt:", e);
            }
          }
        }
      }
      try {
        const success = await sendMessage(initialPrompt);
        console.log("Initial prompt sent, result:", success);
        if (success && (isHealth || isIsuzu || isESG)) {
          console.log("Health/Isuzu/ESG-related initial prompt, switching to DAG tab");
          setTimeout(() => {
            setActiveTab("DAG");
          }, 800);
        }
        if (success) {
          console.log("Initial prompt sent successfully, clearing...");
          clearInitialPrompt();
        } else {
          console.warn("Initial prompt sending failed. You may need to resend your message.");
          clearInitialPrompt();
        }
      } catch (error: any) {
        console.error("Error sending initial prompt:", error);
        clearInitialPrompt();
      }
    }
  };

  useEffect(() => {
    processInitialPrompt();
  }, [agentId, initialPrompt, initialPromptProcessed, sendMessage, clearInitialPrompt]);

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      const hasServerError =
        typeof window !== "undefined" && localStorage.getItem("letta_server_error") === "true";
      if (!agentId && messages.length === 0 && !initialPrompt && !hasServerError) {
        console.log("No agent, messages, or initial prompt found after delay. Redirecting to /prompt.");
        router.push("/prompt");
      }
    }, 1500);
    return () => clearTimeout(redirectTimeout);
  }, [agentId, messages.length, initialPrompt, router]);

  useEffect(() => {
    if (initialPrompt) {
      console.log("Initial prompt detected, checking if it's a health prompt");
      setDagCompleted(false);
      setVideoWatched(false);
      const isHealth = isHealthPrompt(initialPrompt);
      setVideoWatched(true);
    }
  }, [initialPrompt, isVideoEnabled]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 20;
      const maxScrollEffect = 80;
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > scrollThreshold);
      const progress = Math.min(
        (scrollTop - scrollThreshold) / (maxScrollEffect - scrollThreshold),
        1,
      );
      setScrollProgress(scrollTop <= scrollThreshold ? 0 : progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (latestQuery && headerRef.current) {
      headerRef.current.classList.add("animate-title-change");
      setTimeout(() => {
        if (headerRef.current) {
          headerRef.current.classList.remove("animate-title-change");
        }
      }, 500);
    }
  }, [latestQuery]);

  const headerTransform = `translateY(-${scrollProgress * 12}px)`;
  const titleScale = 1 - scrollProgress * 0.3;
  const titleBottomMargin = 16 - scrollProgress * 6;
  const tabsTransform = `translateY(-${scrollProgress * 6}px)`;

  useEffect(() => {
    const preferredTab = localStorage.getItem("preferredTab");
    if (preferredTab) {
      console.log(`Setting active tab from localStorage: ${preferredTab}`);
      setActiveTab(preferredTab);
      setTabSwitched(true);
      localStorage.removeItem("preferredTab");
    }
  }, []);

  const handleTabClick = (tabName: string) => {
    console.log(`Tab clicked: ${tabName}`);
    setActiveTab(tabName);
    setTabSwitched(true);
    console.log(`Tab switched to ${tabName} - preserving completion state`);
  };

  useEffect(() => {
    if (deduplicatedMessages.length > 0) {
      setTabSwitched(false);
    }
  }, [deduplicatedMessages.length]);

  useEffect(() => {
    deduplicatedMessages.forEach((msg, idx) => {
      if (msg.role === "assistant" && idx > 0) {
        const userMsg = deduplicatedMessages[idx - 1];
        if (userMsg.role === "user" && isHealthPrompt(userMsg.content)) {
          const msgId = msg.id;
          if (!loadedDashboardsRef.current.has(msgId) && dashboardLoadingState[msgId] === undefined) {
            console.log(
              `NEW dashboard detected for message ${msgId.substring(0, 8)} - setting loading state`,
            );
            setDashboardLoadingState((prev) => ({
              ...prev,
              [msgId]: true,
            }));
            setTimeout(() => {
              console.log(`Loading COMPLETE for dashboard at message ${msgId.substring(0, 8)}`);
              setDashboardLoadingState((prev) => ({
                ...prev,
                [msgId]: false,
              }));
              setDashboardLoaded((prev) => ({
                ...prev,
                [msgId]: true,
              }));
              loadedDashboardsRef.current.add(msgId);
            }, 4000);
          }
        }
      }
    });
  }, [deduplicatedMessages, dashboardLoadingState]);

  useEffect(() => {
    if (deduplicatedMessages.length > 0) {
      console.log("CRITICAL DEBUG - All messages:");
      deduplicatedMessages.forEach((msg, idx) => {
        console.log(`[${idx}] ${msg.role}: ${msg.content.substring(0, 50)}...`);
      });
    }
  }, [deduplicatedMessages]);

  const isHealthPrompt = (content: string) => {
    const HEALTH_CASE_PROMPT =
      "Show today's autonomous truck performance with insights from Gatik, NVIDIA, and Applied Intuition.";
    const exactMatch = content.trim() === HEALTH_CASE_PROMPT.trim();
    const partialMatch =
      content.toLowerCase().includes("autonomous truck") &&
      content.toLowerCase().includes("performance") &&
      (content.toLowerCase().includes("gatik") ||
        content.toLowerCase().includes("nvidia") ||
        content.toLowerCase().includes("applied intuition"));
    const result = exactMatch || partialMatch;
    console.log(`HEALTH CHECK: "${content.substring(0, 30)}..." - Result: ${result ? "YES" : "NO"}`);
    return result;
  };

  const isIzuzuPrompt = (content: string) => {
    const ISUZU_CASE_PROMPT = "Show me productivity and sustainability insights for the Isuzu pickup.";
    const exactMatch = content.trim() === ISUZU_CASE_PROMPT.trim();
    const partialMatch =
      content.toLowerCase().includes("isuzu") &&
      content.toLowerCase().includes("pickup") &&
      (content.toLowerCase().includes("productivity") ||
        content.toLowerCase().includes("sustainability"));
    const result = exactMatch || partialMatch;
    console.log(`ISUZU CHECK: "${content.substring(0, 30)}..." - Result: ${result ? "YES" : "NO"}`);
    return result;
  };

  const isBackToSchoolPrompt = (content: string) => {
    const BACK_TO_SCHOOL_PROMPT =
      "What's the best way to increase attach rate for Back-to-School customers like Emily, while reducing WISMO contact volume over the next 4 weeks?";
    const exactMatch = content.trim() === BACK_TO_SCHOOL_PROMPT.trim();
    const partialMatch =
      content.toLowerCase().includes("back-to-school") &&
      content.toLowerCase().includes("attach rate") &&
      content.toLowerCase().includes("emily") &&
      content.toLowerCase().includes("wismo");
    const result = exactMatch || partialMatch;
    console.log(`BACK-TO-SCHOOL CHECK: "${content.substring(0, 30)}..." - Result: ${result ? "YES" : "NO"}`);
    return result;
  };

  const isOctaPharmaPrompt = (content: string) => {
    const OCTAPHARMA_KEYWORDS = [
      "octapharma",
      "octa pharma",
      "manufacturing",
      "deviation",
      "msat",
      "r&d",
      "research",
      "experiment",
      "batch",
      "sop",
      "pq",
      "quality",
      "pharmaceutical",
      "production",
      "compliance",
      "validation",
    ];
    const lowerContent = content.toLowerCase();
    return OCTAPHARMA_KEYWORDS.some((keyword) => lowerContent.includes(keyword));
  };

  const isMSATPrompt = (content: string) => {
    const lowerContent = content.toLowerCase();
    const MSAT_KEYWORDS = [
      "msat",
      "deviation",
      "anomaly",
      "manufacturing",
      "batch issue",
      "production problem",
      "quality deviation",
      "non-conformance",
      "root cause",
      "corrective action",
      "resolution",
    ];
    return (
      MSAT_KEYWORDS.some((keyword) => lowerContent.includes(keyword)) ||
      (lowerContent.includes("deviation") && lowerContent.includes("resolution"))
    );
  };

  const isRDPrompt = (content: string) => {
    const lowerContent = content.toLowerCase();
    const RD_KEYWORDS = [
      "r&d",
      "research",
      "experiment",
      "experimental",
      "study",
      "trial",
      "protocol",
      "methodology",
      "hypothesis",
      "analysis",
      "retrieval",
      "experiment data",
      "research data",
    ];
    return (
      RD_KEYWORDS.some((keyword) => lowerContent.includes(keyword)) ||
      (lowerContent.includes("experiment") && lowerContent.includes("retrieval"))
    );
  };

  const isESGPrompt = (content: string) => {
    const ESG_KEYWORDS = [
      "esg",
      "environmental",
      "social",
      "governance",
      "portfolio",
      "sustainability",
      "carbon",
      "climate",
      "regulatory",
      "compliance",
      "sfdr",
      "tcfd",
      "emissions",
      "scope 3",
      "financed emissions",
      "investments",
      "category 15",
      "supply chain",
    ];
    const lowerContent = content.toLowerCase();
    const hasESGKeywords = ESG_KEYWORDS.some((keyword) => lowerContent.includes(keyword));
    const isESGAnalysis =
      (lowerContent.includes("portfolio") &&
        (lowerContent.includes("esg") || lowerContent.includes("sustainability"))) ||
      (lowerContent.includes("climate") && lowerContent.includes("risk")) ||
      (lowerContent.includes("esg") &&
        (lowerContent.includes("score") || lowerContent.includes("analysis"))) ||
      (lowerContent.includes("regulatory") && lowerContent.includes("compliance")) ||
      (lowerContent.includes("emissions") &&
        (lowerContent.includes("scope") || lowerContent.includes("carbon"))) ||
      lowerContent.includes("financed emissions") ||
      lowerContent.includes("category 15") ||
      (lowerContent.includes("investments") &&
        (lowerContent.includes("emissions") ||
          lowerContent.includes("esg") ||
          lowerContent.includes("sustainability")));
    const result = hasESGKeywords && isESGAnalysis;
    console.log(`ESG CHECK: "${content.substring(0, 30)}..." - Result: ${result ? "YES" : "NO"}`);
    return result;
  };

  const handleDAGCompletion = (section: number, messageId: string) => {
    console.log(`DAG workflow completed for section ${section}, messageId ${messageId} - persisting completion state`);
    setDagCompleted(true);
    setLastCompletedMessageId(messageId);
    setCompletedDAGsByMessage((prev) => ({
      ...prev,
      [messageId]: true,
    }));
    seenHealthPromptsRef.current.add(messageId);
    console.log(`DAG completion persisted for message ${messageId} - dashboard will remain available`);
    
    // Automatically switch to Chat tab to show dashboard after DAG completes
    console.log("DAG completed, switching to Chat tab to show dashboard");
    setTimeout(() => {
      setActiveTab("Chat");
    }, 1000); // Small delay to let user see the completion
  };

  const renderChatSections = () => {
    const sections = [] as JSX.Element[];
    for (let i = 0; i < deduplicatedMessages.length; i += 2) {
      const userMessage = deduplicatedMessages[i];
      const assistantMessage = i + 1 < deduplicatedMessages.length ? deduplicatedMessages[i + 1] : null;
      const sectionIndex = Math.floor(i / 2);
      const messageId = assistantMessage?.id || "";
      const userMessageId = userMessage?.id || "";
      const isLatestSection =
        i === deduplicatedMessages.length - 2 ||
        (i === deduplicatedMessages.length - 1 && !assistantMessage);
      const isNewMessage = isLatestSection && !tabSwitched;
      if (userMessage && userMessage.role === "user") {
        sections.push(
          <div
            key={userMessage.id}
            className={`message-section ${
              isLatestSection && showNewMessageAnimation ? "animate-fadeIn" : ""
            }`}
            id={`section-${sectionIndex}`}
            ref={isLatestSection ? latestMessageRef : null}
            data-is-latest={isLatestSection ? "true" : "false"}
          >
            <div className="sticky top-0 bg-white z-50">
              <div className="pt-8 px-4 md:px-12 lg:px-24 xl:px-36">
                <h2
                  className="text-2xl font-medium text-gray-800 text-left font-noto-kufi transition-all duration-300"
                  style={{
                    height: "6rem",
                    maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                    overflow: "auto",
                    marginBottom: "16px",
                    paddingBottom: "1.5rem",
                    paddingLeft: "4px",
                    transform: `scale(${titleScale})`,
                    transformOrigin: "left center",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {userMessage.content}
                </h2>
                <div
                  className="flex border-b border-gray-200 transition-all duration-300"
                  style={{
                    transform: tabsTransform,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === "Chat" ? "border-b-2" : ""}`}
                    onClick={() => handleTabClick("Chat")}
                    style={{
                      color: activeTab === "Chat" ? "#e84990" : "rgb(75 85 99)",
                      borderBottomColor: activeTab === "Chat" ? "#e84990" : "transparent",
                    }}
                  >
                    Chat
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === "DAG" ? "border-b-2" : ""}`}
                    onClick={() => handleTabClick("DAG")}
                    style={{
                      color: activeTab === "DAG" ? "#e84990" : "rgb(75 85 99)",
                      borderBottomColor: activeTab === "DAG" ? "#e84990" : "transparent",
                    }}
                  >
                    DAG
                  </button>
                  <div className="flex-grow" />
                  <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === "Tasks" ? "border-b-2" : ""}`}
                    onClick={() => handleTabClick("Tasks")}
                    style={{
                      color: activeTab === "Tasks" ? "#e84990" : "rgb(75 85 99)",
                      borderBottomColor: activeTab === "Tasks" ? "#e84990" : "transparent",
                    }}
                  >
                    Tasks
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-6 pb-10 px-4 md:px-12 lg:px-24 xl:px-36">
              {activeTab === "Chat" ? (
                assistantMessage ? (
                  assistantMessage.isStreaming ? (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="inline-block h-4 w-4 animate-pulse rounded-full" style={{ backgroundColor: "#775A0B" }} />
                      <span className="text-sm" style={{ color: "#775A0B" }}>
                        Omnis is thinking...
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap text-gray-800">
                        <style jsx global>{`
                          .markdown-content h1,
                          .markdown-content h2,
                          .markdown-content h3,
                          .markdown-content h4,
                          .markdown-content h5,
                          .markdown-content h6 {
                            font-weight: 600;
                            margin-top: 6px;
                            margin-bottom: 4px;
                          }
                          .markdown-content h1 {
                            font-size: 1.5rem;
                          }
                          .markdown-content h2 {
                            font-size: 1.25rem;
                          }
                          .markdown-content h3 {
                            font-size: 1.125rem;
                          }
                          .markdown-content p {
                            margin-top: 2px;
                            margin-bottom: 2px;
                            line-height: 1.3;
                          }
                          .markdown-content ul,
                          .markdown-content ol {
                            margin-top: 2px;
                            margin-bottom: 2px;
                            padding-left: 1.5rem;
                          }
                          .markdown-content li {
                            margin-top: 0px;
                            margin-bottom: 0px;
                            padding-left: 0.25rem;
                          }
                          .markdown-content strong {
                            font-weight: 600;
                          }
                          .markdown-content a {
                            color: #775a0b;
                            text-decoration: underline;
                          }
                          .markdown-content code {
                            background-color: rgba(0, 0, 0, 0.05);
                            padding: 0.1rem 0.2rem;
                            border-radius: 0.2rem;
                            font-size: 0.9em;
                          }
                          .markdown-content pre {
                            background-color: rgba(0, 0, 0, 0.05);
                            padding: 0.5rem;
                            border-radius: 0.2rem;
                            overflow-x: auto;
                            margin: 4px 0;
                          }
                          .markdown-content pre code {
                            background-color: transparent;
                            padding: 0;
                          }
                          .markdown-content blockquote {
                            border-left: 3px solid #775a0b;
                            padding-left: 0.5rem;
                            margin-left: 0;
                            margin-right: 0;
                            font-style: italic;
                          }
                          .markdown-content hr {
                            border: 0;
                            border-top: 1px solid #e0e0e0;
                            margin: 4px 0;
                          }
                          .markdown-content table {
                            border-collapse: collapse;
                            width: 100%;
                            margin-top: 4px;
                            margin-bottom: 4px;
                          }
                          .markdown-content th,
                          .markdown-content td {
                            border: 1px solid #e0e0e0;
                            padding: 0.25rem 0.5rem;
                            text-align: left;
                          }
                          .markdown-content th {
                            background-color: rgba(0, 0, 0, 0.05);
                          }
                        `}</style>
                        {(() => {
                          const isHealthPromptCheck = isHealthPrompt(userMessage.content);
                          const isIzuzuPromptCheck = isIzuzuPrompt(userMessage.content);
                          const isBackToSchoolPromptCheck = isBackToSchoolPrompt(userMessage.content);
                          const isESGPromptCheck = isESGPrompt(userMessage.content);
                          const isOctaPharmaPromptCheck = isOctaPharmaPrompt(userMessage.content);
                          const shouldShowDashboard =
                            isHealthPromptCheck ||
                            isIzuzuPromptCheck ||
                            isBackToSchoolPromptCheck ||
                            isESGPromptCheck ||
                            isOctaPharmaPromptCheck;
                          
                          // Hide assistant message content for OctaPharma prompts when dashboard is showing
                          const shouldHideMessage = isOctaPharmaPromptCheck && shouldShowDashboard;
                          
                          if (!shouldHideMessage) {
                            return (
                              <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {assistantMessage.content || defaultResponse}
                                </ReactMarkdown>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      {(() => {
                        const isHealthPromptCheck = isHealthPrompt(userMessage.content);
                        const isIzuzuPromptCheck = isIzuzuPrompt(userMessage.content);
                        const isBackToSchoolPromptCheck = isBackToSchoolPrompt(userMessage.content);
                        const isESGPromptCheck = isESGPrompt(userMessage.content);
                        const isOctaPharmaPromptCheck = isOctaPharmaPrompt(userMessage.content);
                        const shouldShowDashboard =
                          isHealthPromptCheck ||
                          isIzuzuPromptCheck ||
                          isBackToSchoolPromptCheck ||
                          isESGPromptCheck ||
                          isOctaPharmaPromptCheck;
                        console.log(`Dashboard routing check for: "${userMessage.content.substring(0, 50)}..."`);
                        console.log(
                          `- Health: ${isHealthPromptCheck}, Isuzu: ${isIzuzuPromptCheck}, BackToSchool: ${isBackToSchoolPromptCheck}, ESG: ${isESGPromptCheck}, OctaPharma: ${isOctaPharmaPromptCheck}`,
                        );
                        console.log(`- Should show dashboard: ${shouldShowDashboard}`);
                        console.log(`- Active Tab: ${activeTab}`);
                        console.log(`- DAG Completed: ${dagCompleted}, Message ID: ${messageId}`);
                        
                        // If this is a DAG prompt and we're on the Chat tab, don't show dashboard yet
                        // User should see the DAG visualization first
                        if (shouldShowDashboard && activeTab === "Chat") {
                          // Check if DAG has completed - if not, show message directing user to DAG tab
                          const checkDAGCompletionForMessage = () => {
                            if (typeof window === "undefined") return false;
                            try {
                              const completedDAGs = localStorage.getItem("omnis_completed_dags");
                              if (completedDAGs) {
                                const completedIds = JSON.parse(completedDAGs);
                                const isOctaPharma = isOctaPharmaPromptCheck;
                                const isESG = isESGPromptCheck;
                                
                                if (isOctaPharma) {
                                  return (
                                    completedIds.includes(`octa-dag-${userMessageId}`) ||
                                    completedIds.includes(userMessageId) ||
                                    completedIds.some((id: string) => id.includes(`octa-dag-${userMessageId}`) || id.includes(userMessageId))
                                  );
                                } else if (isESG) {
                                  return (
                                    completedIds.includes(`esg-dag-${userMessageId}`) ||
                                    completedIds.includes(userMessageId) ||
                                    completedIds.some((id: string) => id.includes(`esg-dag-${userMessageId}`) || id.includes(userMessageId))
                                  );
                                } else {
                                  return (
                                    completedIds.includes(userMessageId) ||
                                    completedIds.includes(`dag-${userMessageId}`) ||
                                    completedIds.some((id: string) => id.includes(userMessageId))
                                  );
                                }
                              }
                            } catch {
                              return false;
                            }
                            return false;
                          };
                          
                          const isDagCompleted = 
                            (dagCompleted && lastCompletedMessageId === userMessageId) ||
                            completedDAGsByMessage[userMessageId] === true ||
                            checkDAGCompletionForMessage();
                          
                          if (!isDagCompleted) {
                            return (
                              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="inline-block h-4 w-4 animate-pulse rounded-full bg-amber-600" />
                                  <span className="text-sm font-medium text-amber-800">DAG visualization in progress...</span>
                                </div>
                                <p className="text-sm text-amber-700">
                                  Please switch to the <strong>DAG</strong> tab to view the workflow visualization. 
                                  The dashboard will appear here once the DAG completes.
                                </p>
                              </div>
                            );
                          }
                        }
                        
                        if (shouldShowDashboard) {
                          // Check OctaPharma first (more specific) before ESG (more general)
                          const DashboardComponent = isBackToSchoolPromptCheck
                            ? TVGChatDashboard
                            : isOctaPharmaPromptCheck
                            ? OctaPharmaChatDashboard
                            : isESGPromptCheck
                            ? ESGChatDashboard
                            : ChatDashboard;
                          console.log(
                            `Selected dashboard: ${
                              isBackToSchoolPromptCheck
                                ? "TVGChatDashboard (Retail)"
                                : isOctaPharmaPromptCheck
                                ? "OctaPharmaChatDashboard (OctaPharma)"
                                : isESGPromptCheck
                                ? "ESGChatDashboard (ESG Portfolio)"
                                : "ChatDashboard (Vehicle)"
                            }`,
                          );
                          // Check DAG completion from localStorage for this specific message
                          const checkDAGCompletionForMessage = () => {
                            if (typeof window === "undefined") return false;
                            try {
                              const completedDAGs = localStorage.getItem("omnis_completed_dags");
                              if (completedDAGs) {
                                const completedIds = JSON.parse(completedDAGs);
                                const isOctaPharma = isOctaPharmaPromptCheck;
                                const isESG = isESGPromptCheck;
                                
                                // Check various possible ID formats based on prompt type
                                if (isOctaPharma) {
                                  return (
                                    completedIds.includes(`octa-dag-${userMessageId}`) ||
                                    completedIds.includes(userMessageId) ||
                                    completedIds.some((id: string) => id.includes(`octa-dag-${userMessageId}`) || id.includes(userMessageId))
                                  );
                                } else if (isESG) {
                                  return (
                                    completedIds.includes(`esg-dag-${userMessageId}`) ||
                                    completedIds.includes(userMessageId) ||
                                    completedIds.some((id: string) => id.includes(`esg-dag-${userMessageId}`) || id.includes(userMessageId))
                                  );
                                } else {
                                  // Health, Isuzu, BackToSchool
                                  return (
                                    completedIds.includes(userMessageId) ||
                                    completedIds.includes(`dag-${userMessageId}`) ||
                                    completedIds.some((id: string) => id.includes(userMessageId))
                                  );
                                }
                              }
                            } catch {
                              return false;
                            }
                            return false;
                          };
                          
                          const isDagCompletedForThisMessage =
                            (dagCompleted && lastCompletedMessageId === userMessageId) ||
                            completedDAGsByMessage[userMessageId] === true ||
                            checkDAGCompletionForMessage();
                          console.log(
                            `Dashboard completion check for ${userMessageId}: global=${
                              dagCompleted && lastCompletedMessageId === userMessageId
                            }, persistent=${completedDAGsByMessage[userMessageId]}, localStorage=${checkDAGCompletionForMessage()}, final=${isDagCompletedForThisMessage}`,
                          );
                          if (!isDagCompletedForThisMessage) {
                            return (
                              <div className="mt-4 flex items-center space-x-2">
                                <div className="inline-block h-4 w-4 animate-pulse rounded-full bg-amber-600" />
                                <span className="text-sm text-amber-700">Waiting for DAG visualization to complete...</span>
                              </div>
                            );
                          }
                          if ((dashboardLoaded[messageId] && !isNewMessage) || tabSwitched) {
                            return (
                              <div className="mt-4 w-full max-w-full">
                                <div className="z-10 w-full" style={{ isolation: "isolate" }} id={`chat-dashboard-container-${messageId}`}>
                                  <DashboardComponent key={messageId} />
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="mt-4 w-full max-w-full">
                              <DashboardWithLoading
                                messageId={messageId}
                                dashboardComponent={DashboardComponent}
                                onLoad={() => {
                                  setDashboardLoaded((prev) => ({
                                    ...prev,
                                    [messageId]: true,
                                  }));
                                }}
                              />
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </>
                  )
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="inline-block h-4 w-4 animate-pulse rounded-full bg-amber-500" />
                    <span className="text-sm text-amber-700">Waiting for response...</span>
                  </div>
                )
              ) : activeTab === "DAG" ? (
                (() => {
                  const shouldShowDAG =
                    isHealthPrompt(userMessage.content) ||
                    isIzuzuPrompt(userMessage.content) ||
                    isBackToSchoolPrompt(userMessage.content) ||
                    isESGPrompt(userMessage.content) ||
                    isOctaPharmaPrompt(userMessage.content);
                  if (shouldShowDAG) {
                    if (isOctaPharmaPrompt(userMessage.content)) {
                      let workflowType: "msat" | "rd" | "all" = "all";
                      if (isMSATPrompt(userMessage.content)) {
                        workflowType = "msat";
                      } else if (isRDPrompt(userMessage.content)) {
                        workflowType = "rd";
                      }
                      return (
                        <Suspense
                          fallback={
                            <div className="min-h-[450px] flex items-center justify-center">
                              <div className="text-center">
                                <div
                                  className="w-12 h-12 border-4 border-t-2 rounded-full animate-spin mx-auto mb-4"
                                  style={{ borderColor: "#059669", borderTopColor: "#16a34a" }}
                                />
                                <p className="text-gray-600">
                                  Loading OctaPharma {workflowType === "msat" ? "MSAT" : workflowType === "rd" ? "R&D" : ""} workflow...
                                </p>
                              </div>
                            </div>
                          }
                        >
                          <OctaPharmaDAGVisualization
                            messageId={userMessage.id}
                            workflowType={workflowType}
                            onDAGComplete={() => handleDAGCompletion(sectionIndex, userMessageId)}
                          />
                        </Suspense>
                      );
                    }
                    if (isESGPrompt(userMessage.content)) {
                      return (
                        <Suspense
                          fallback={
                            <div className="min-h-[450px] flex items-center justify-center">
                              <div className="text-center">
                                <div
                                  className="w-12 h-12 border-4 border-t-2 rounded-full animate-spin mx-auto mb-4"
                                  style={{ borderColor: "#059669", borderTopColor: "#16a34a" }}
                                />
                                <p className="text-gray-600">Loading OctaPharma analysis workflow...</p>
                              </div>
                            </div>
                          }
                        >
                          <ESGDAGVisualization
                            messageId={userMessage.id}
                            onDAGComplete={() => handleDAGCompletion(sectionIndex, userMessageId)}
                          />
                        </Suspense>
                      );
                    }
                    return (
                      <Suspense
                        fallback={
                          <div className="min-h-[450px] flex items-center justify-center">
                            <div className="text-center">
                              <div
                                className="w-12 h-12 border-4 border-t-2 rounded-full animate-spin mx-auto mb-4"
                                style={{ borderColor: "#a18b5c44", borderTopColor: "#a18b5c" }}
                              />
                              <p className="text-gray-600">Loading visualization...</p>
                            </div>
                          </div>
                        }
                      >
                        <DAGVisualization
                          onDAGComplete={() => handleDAGCompletion(sectionIndex, userMessageId)}
                          messageId={userMessage.id}
                          isMeaslesUseCase={false}
                          isIzuzuUseCase={isIzuzuPrompt(userMessage.content)}
                          isBackToSchoolUseCase={isBackToSchoolPrompt(userMessage.content)}
                          isOctaPharma
                        />
                      </Suspense>
                    );
                  }
                  return (
                    <div className="min-h-[450px] flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-600 mb-2">No DAG visualization available for this query.</p>
                        <p className="text-gray-500 text-sm">Try the healthcare use case for a demonstration.</p>
                      </div>
                    </div>
                  );
                })()
              ) : null}
            </div>
          </div>,
        );
      }
    }
    return sections;
  };

  useEffect(() => {
    if (deduplicatedMessages.length <= 1) return;
    const scrollToLatestSection = () => {
      if (!contentRef.current) {
        console.log("Content ref not available");
        return;
      }
      const latestSection = document.querySelector('[data-is-latest="true"]') as HTMLElement;
      if (!latestSection) {
        console.log("Latest section not found");
        return;
      }
      latestSection.scrollIntoView({ block: "start", behavior: "auto" });
      setShowNewMessageAnimation(true);
      setTimeout(() => setShowNewMessageAnimation(false), 1000);
    };
    const timeout = setTimeout(scrollToLatestSection, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [deduplicatedMessages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const query = inputValue.trim();
    setInputValue("");
    setTabSwitched(false);
    setDagCompleted(false);
    setVideoWatched(false);
    const isHealth = isHealthPrompt(query);
    const isIsuzu = isIzuzuPrompt(query);
    const isBackToSchool = isBackToSchoolPrompt(query);
    const isESG = isESGPrompt(query);
    const isOctaPharma = isOctaPharmaPrompt(query);
    if (isHealth || isIsuzu || isBackToSchool || isESG || isOctaPharma) {
      const promptType = isESG
        ? "ESG"
        : isOctaPharma
        ? "OctaPharma"
        : isHealth
        ? "Health"
        : isIsuzu
        ? "Isuzu"
        : "BackToSchool";
        console.log(`New ${promptType} message detected - clearing DAG cache for fresh execution`);
       try {
         // Clear all DAG memory - clearDAGMemory requires an ID, but we want to clear all
         if (typeof window !== "undefined") {
           localStorage.removeItem("omnis_completed_dags");
         }
       } catch (error) {
         console.log("Could not clear DAG memory:", error);
       }
      try {
        const completedDAGs = localStorage.getItem("omnis_completed_dags");
        if (completedDAGs) {
          console.log("Clearing previous DAG cache for fresh execution");
          localStorage.removeItem("omnis_completed_dags");
        }
      } catch (error) {
        console.log("Could not clear DAG cache:", error);
      }
    }
    await sendMessage(query);
    if (isHealth || isIsuzu || isBackToSchool || isESG || isOctaPharma) {
      console.log("Health/Isuzu/ESG/Back-to-School/OctaPharma-related message detected, switching to DAG tab immediately");
      // Switch to DAG tab immediately to show the visualization
      setActiveTab("DAG");
    }
    setTimeout(() => {
      const latestSection = document.querySelector('[data-is-latest="true"]') as HTMLElement;
      if (latestSection) {
        latestSection.scrollIntoView({ block: "start", behavior: "auto" });
      }
    }, 500);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  function MainDAGContent() {
    const { messages } = useLettaChat();
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const mainDagMountedRef = useRef(false);
    const hasDAGPrompt = useMemo(() => {
      return messages.some(
        (msg) =>
          msg.role === "user" &&
          (isHealthPrompt(msg.content) || isIzuzuPrompt(msg.content) || isBackToSchoolPrompt(msg.content)),
      );
    }, [messages]);
    const latestDAGPromptId = useMemo(() => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (
          msg.role === "user" &&
          (isHealthPrompt(msg.content) || isIzuzuPrompt(msg.content) || isBackToSchoolPrompt(msg.content))
        ) {
          return msg.id;
        }
      }
      return "main-content";
    }, [messages]);
    useEffect(() => {
      if (hasDAGPrompt && !mainDagMountedRef.current) {
        setIsVisible(true);
        const timer = setTimeout(() => {
          setIsLoading(false);
          mainDagMountedRef.current = true;
        }, 3000);
        return () => clearTimeout(timer);
      } else if (hasDAGPrompt) {
        setIsVisible(true);
        setIsLoading(false);
      } else {
        setIsVisible(false);
        setIsLoading(true);
        mainDagMountedRef.current = false;
      }
    }, [hasDAGPrompt]);
    const handleMainDAGCompletion = () => {
      console.log("Main DAG workflow completed - waiting for video");
      const latestHealthId = latestDAGPromptId || "main-content";
      seenHealthPromptsRef.current.add(latestHealthId);
      setDagCompleted(true);
      setLastCompletedMessageId(latestHealthId);
      if (!showMeaslesVideoPopup || videoWatched) {
        console.log("Video already completed, switching to Chat tab");
        setActiveTab("Chat");
      } else {
        console.log("Waiting for video to complete before switching to Chat tab");
      }
    };
    if (!isVisible) {
      return (
        <div className="min-h-[450px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-2">No DAG visualization available.</p>
            <p className="text-gray-500 text-sm">Try the healthcare use case for a demonstration.</p>
          </div>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="min-h-[450px] flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-12 h-12 border-4 border-t-2 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "#a18b5c44", borderTopColor: "#a18b5c" }}
            />
            <p className="text-gray-600">Generating DAG visualization...</p>
          </div>
        </div>
      );
    }
    return (
      <div>
        <Suspense fallback={<DAGLoadingFallback />}>
          <DAGVisualization
            onDAGComplete={handleMainDAGCompletion}
            messageId={latestDAGPromptId}
            isMeaslesUseCase={false}
            isIzuzuUseCase={(() => {
              for (let i = messages.length - 1; i >= 0; i--) {
                const msg = messages[i];
                if (
                  msg.role === "user" &&
                  (isHealthPrompt(msg.content) || isIzuzuPrompt(msg.content) || isBackToSchoolPrompt(msg.content))
                ) {
                  return isIzuzuPrompt(msg.content);
                }
              }
              return false;
            })()}
            isBackToSchoolUseCase={(() => {
              for (let i = messages.length - 1; i >= 0; i--) {
                const msg = messages[i];
                if (
                  msg.role === "user" &&
                  (isHealthPrompt(msg.content) || isIzuzuPrompt(msg.content) || isBackToSchoolPrompt(msg.content))
                ) {
                  return isBackToSchoolPrompt(msg.content);
                }
              }
              return false;
            })()}
            isOctaPharma
          />
        </Suspense>
      </div>
    );
  }

  useEffect(() => {
    if (deduplicatedMessages.length === 0) return;
    let lastUserMessageIndex = -1;
    for (let i = deduplicatedMessages.length - 1; i >= 0; i--) {
      if (deduplicatedMessages[i].role === "user") {
        lastUserMessageIndex = i;
        break;
      }
    }
    if (lastUserMessageIndex === -1) return;
    const lastUserMessage = deduplicatedMessages[lastUserMessageIndex];
    if (seenHealthPromptsRef.current.has(lastUserMessage.id)) return;
    if (
      !isHealthPrompt(lastUserMessage.content) &&
      !isIzuzuPrompt(lastUserMessage.content) &&
      !isBackToSchoolPrompt(lastUserMessage.content)
    ) {
      return;
    }
    if (activeTab === "DAG") return;
    const hasResponse =
      lastUserMessageIndex < deduplicatedMessages.length - 1 &&
      deduplicatedMessages[lastUserMessageIndex + 1].role === "assistant";
    console.log(
      `Health/Isuzu/Back-to-School prompt detected (messageId: ${lastUserMessage.id}), switching to DAG tab automatically`,
    );
    setActiveTab("DAG");
    if (!hasResponse) {
      console.log(`New health prompt ${lastUserMessage.id} without response yet`);
    }
  }, [deduplicatedMessages, activeTab]);

  // Check if there's an ESG prompt in the messages
  const hasESGPrompt = useMemo(() => {
    return deduplicatedMessages.some(
      (msg) => msg.role === "user" && isESGPrompt(msg.content),
    );
  }, [deduplicatedMessages]);

  return (
    <>
      <div className="h-screen bg-gray-50 font-noto-kufi">
        <ChatSidebar>
          <div className="flex flex-col h-full max-h-screen overflow-hidden">
            <div ref={contentRef} className="flex-1 overflow-y-auto pb-4 relative z-0">
              <div className="text-gray-700">
                {deduplicatedMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[50vh] px-4 md:px-20 lg:px-40 xl:px-60">
                      <div className="text-center">
                        {agentId === null ? (
                          typeof window !== "undefined" &&
                          localStorage.getItem("letta_server_error") === "true" ? (
                            <div>
                              <p className="text-red-500 mb-2">Failed to create or connect to Letta agent.</p>
                              <p className="text-gray-500 mb-4">
                                Please check the server configuration and ensure it's running correctly.
                              </p>
                              <p className="text-gray-500 mb-4">
                                If the problem persists, try clearing the stored connection state:
                              </p>
                              <ul className="text-left text-gray-600 mb-4 mx-auto max-w-md">
                                <li className="mb-2">
                                  • Verify server address: {
                                    <code className="bg-gray-100 px-1 rounded">
                                      {process.env.NEXT_PUBLIC_LETTA_URL || "http://localhost:8283"}
                                    </code>
                                  }
                                </li>
                                <li className="mb-2">• Confirm required API keys (e.g., OpenAI) are set on the server.</li>
                                <li className="mb-2">• Ensure the model and embedding provider/names are correct.</li>
                                <li className="mb-2">• Check server logs for detailed errors.</li>
                              </ul>
                              <button
                                onClick={async () => {
                                  if (typeof window !== "undefined") {
                                    console.log(
                                      "Clearing letta_server_error and letta_agent_id from localStorage.",
                                    );
                                    localStorage.removeItem("letta_server_error");
                                    localStorage.removeItem("letta_agent_id");
                                    alert("Local cache cleared. Reloading page to retry connection.");
                                    window.location.reload();
                                  }
                                }}
                                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                              >
                                Clear Local Cache & Retry Connection
                              </button>
                            </div>
                          ) : (
                            <p className="text-gray-500">Initializing agent connection...</p>
                          )
                        ) : messages.length === 0 ? (
                          <p className="text-gray-500">
                            No results yet. Start a conversation from the prompt page.
                          </p>
                        ) : (
                          <div className="space-y-0">
                            {renderChatSections()}
                            <div ref={messagesEndRef} className="h-20" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {renderChatSections()}
                      <div ref={messagesEndRef} className="h-20" />
                    </div>
                  )}
                </div>
              </div>
              <div className="sticky bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-12 lg:px-24 xl:px-36 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message here..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent"
                        disabled={streaming}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || streaming}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                          !inputValue.trim() || streaming
                            ? "text-gray-400"
                            : "text-amber-800 hover:bg-amber-100"
                        }`}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                      onClick={() => {}}
                      disabled={streaming}
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                    <Link href="/prompt" className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                      <Plus className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ChatSidebar>
        </div>
      {/* Only render ESGChatProvider (ESG AI Assistant window) for ESG prompts */}
      {hasESGPrompt && <ESGChatProvider />}
    </>
  );
}

const DashboardShell = () => {
  const { messages } = useLettaChat();
  const [role, setRole] = useState<UserRole>("R&D");
  const [agentTrace, setAgentTrace] = useState<AgentTraceRun | null>(null);
  const [activeScopeId, setActiveScopeId] = useState<string | null>(null);
  const [activeSources, setActiveSources] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sourceToggles.map((toggle) => [toggle.id, toggle.activeByDefault])),
  );
  const sessionId = useMemo(() => generateSessionId(), []);
  
  // Check if there's a DAG prompt and if it has completed
  const { hasDAGPrompt, dagCompleted } = useMemo(() => {
    if (typeof window === "undefined") {
      return { hasDAGPrompt: false, dagCompleted: false };
    }
    
    // Find all DAG prompts in messages
    const dagPrompts = messages.filter(
      (msg) =>
        msg.role === "user" &&
        (isHealthPrompt(msg.content) ||
          isIzuzuPrompt(msg.content) ||
          isBackToSchoolPrompt(msg.content) ||
          isESGPrompt(msg.content) ||
          isOctaPharmaPrompt(msg.content)),
    );
    
    const hasPrompt = dagPrompts.length > 0;
    
    // Check if any DAG prompt has completed
    let completed = false;
    if (hasPrompt) {
      try {
        const completedDAGs = localStorage.getItem("omnis_completed_dags");
        if (completedDAGs) {
          const completedIds = JSON.parse(completedDAGs);
          // Check if any of the DAG prompt message IDs are in the completed list
          // The DAG instanceId format varies by type:
          // - OctaPharma: `octa-dag-${messageId}`
          // - ESG: `esg-dag-${messageId}` or similar
          // - Health/Isuzu/BackToSchool: `dag-${messageId}` or just `messageId`
          completed = dagPrompts.some((prompt) => {
            const isOctaPharma = isOctaPharmaPrompt(prompt.content);
            const isESG = isESGPrompt(prompt.content);
            
            // Check various possible ID formats based on prompt type
            if (isOctaPharma) {
              return (
                completedIds.includes(`octa-dag-${prompt.id}`) ||
                completedIds.includes(prompt.id) ||
                completedIds.some((id: string) => id.includes(`octa-dag-${prompt.id}`) || id.includes(prompt.id))
              );
            } else if (isESG) {
              return (
                completedIds.includes(`esg-dag-${prompt.id}`) ||
                completedIds.includes(prompt.id) ||
                completedIds.some((id: string) => id.includes(`esg-dag-${prompt.id}`) || id.includes(prompt.id))
              );
            } else {
              // Health, Isuzu, BackToSchool
              return (
                completedIds.includes(prompt.id) ||
                completedIds.includes(`dag-${prompt.id}`) ||
                completedIds.some((id: string) => id.includes(prompt.id))
              );
            }
          });
        }
      } catch {
        completed = false;
      }
    }
    
    return { hasDAGPrompt: hasPrompt, dagCompleted: completed };
  }, [messages]);

  // Listen for DAG completion events
  const [dagCompletedState, setDagCompletedState] = useState(dagCompleted);
  
  useEffect(() => {
    if (typeof window === "undefined" || !hasDAGPrompt) return;
    
    const checkDAGCompletion = () => {
      try {
        const completedDAGs = localStorage.getItem("omnis_completed_dags");
        if (completedDAGs) {
          const completedIds = JSON.parse(completedDAGs);
          const dagPrompts = messages.filter(
            (msg) =>
              msg.role === "user" &&
              (isHealthPrompt(msg.content) ||
                isIzuzuPrompt(msg.content) ||
                isBackToSchoolPrompt(msg.content) ||
                isESGPrompt(msg.content) ||
                isOctaPharmaPrompt(msg.content)),
          );
          
          const hasCompleted = dagPrompts.some((prompt) => {
            const isOctaPharma = isOctaPharmaPrompt(prompt.content);
            const isESG = isESGPrompt(prompt.content);
            
            // Check various possible ID formats based on prompt type
            if (isOctaPharma) {
              return (
                completedIds.includes(`octa-dag-${prompt.id}`) ||
                completedIds.includes(prompt.id) ||
                completedIds.some((id: string) => id.includes(`octa-dag-${prompt.id}`) || id.includes(prompt.id))
              );
            } else if (isESG) {
              return (
                completedIds.includes(`esg-dag-${prompt.id}`) ||
                completedIds.includes(prompt.id) ||
                completedIds.some((id: string) => id.includes(`esg-dag-${prompt.id}`) || id.includes(prompt.id))
              );
            } else {
              // Health, Isuzu, BackToSchool
              return (
                completedIds.includes(prompt.id) ||
                completedIds.includes(`dag-${prompt.id}`) ||
                completedIds.some((id: string) => id.includes(prompt.id))
              );
            }
          });
          
          setDagCompletedState(hasCompleted);
        } else {
          setDagCompletedState(false);
        }
      } catch {
        setDagCompletedState(false);
      }
    };
    
    // Check on mount and periodically
    checkDAGCompletion();
    const interval = setInterval(checkDAGCompletion, 500);
    
    // Also listen for storage events
    window.addEventListener("storage", checkDAGCompletion);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkDAGCompletion);
    };
  }, [messages, hasDAGPrompt]);

  // Show layout only if: no DAG prompt OR DAG has completed
  const shouldShowLayout = !hasDAGPrompt || dagCompletedState;

  const triggerToast = useCallback(
    (variant: "success" | "warning" | "error", message: string) => {
      const baseClass = "rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur";
      switch (variant) {
        case "success":
          toast.success(message, {
            className: `${baseClass} border-status-success/50 bg-status-success/10 text-status-success`,
          });
          break;
        case "warning":
          toast.warning(message, {
            className: `${baseClass} border-banner-warning-border bg-banner-warning text-banner-warning-foreground`,
          });
          break;
        case "error":
          toast.error(message, {
            className: `${baseClass} border-banner-error-border bg-banner-error text-banner-error-foreground`,
          });
          break;
      }
    },
    [],
  );
  const setSourceState = useCallback((id: string, enabled: boolean) => {
    setActiveSources((prev) => ({ ...prev, [id]: enabled }));
  }, []);
  useEffect(() => {
    setActiveScopeId(null);
  }, [role]);
  // Remove the full-screen layout - components are now contained in the dashboard
  return <ChatExperience />;
}

const ChatPage = () => {
  return <DashboardShell />;
};

export default ChatPage;

export function DashboardLoader() {
  return (
    <div className="mt-4 bg-gray-200 border border-blue/30 rounded-lg overflow-hidden">
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-blue/30">
        <h3 className="text-sm font-medium text-gray-700">Omnis is building your dashboard</h3>
      </div>
      <div className="h-[450px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue/30 border-t-blue rounded-full animate-spin" />
        <div className="ml-3 text-sm text-gray-600">Processing data for visualization...</div>
      </div>
    </div>
  );
}

function DashboardWithLoading({
  messageId,
  onLoad,
  dashboardComponent: DashboardComponent = ChatDashboard,
}: {
  messageId?: string;
  onLoad?: () => void;
  dashboardComponent?: ComponentType;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const dashboardMountedRef = useRef(false);
  useEffect(() => {
    console.log("DASHBOARD: Mounting with forced loading state");
    if (!dashboardMountedRef.current) {
      const timer = setTimeout(() => {
        console.log("DASHBOARD: Loading complete, showing dashboard");
        setIsLoading(false);
        dashboardMountedRef.current = true;
        if (onLoad) onLoad();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [onLoad]);
  const stableDashboardKey = useMemo(
    () => messageId || `dashboard-${Math.random().toString(36).substring(2, 9)}`,
    [messageId],
  );
  return isLoading ? (
    <div className="bg-gray-200 border border-blue/30 rounded-lg overflow-hidden z-10">
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-blue/30">
        <h3 className="text-sm font-medium text-gray-700">Omnis is building your dashboard</h3>
      </div>
      <div className="h-[450px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue/30 border-t-blue rounded-full animate-spin" />
        <div className="ml-3 text-sm text-gray-600">Processing data for visualization...</div>
      </div>
    </div>
  ) : (
    <div className="z-10" style={{ isolation: "isolate" }} id={`chat-dashboard-container-${stableDashboardKey}`}>
      <DashboardComponent key={stableDashboardKey} />
    </div>
  );
}

function DAGLoadingFallback() {
  return (
    <div className="min-h-[450px] flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-12 h-12 border-4 border-t-2 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: "#a18b5c44", borderTopColor: "#a18b5c" }}
        />
        <p className="text-gray-600">Loading DAG visualization...</p>
      </div>
    </div>
  );
}
