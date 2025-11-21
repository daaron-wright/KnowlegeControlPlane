"use client";

import React, { useState, useEffect } from "react";
import { useLayoutContext } from "@/context/layout-context";
import { DocumentIntelligenceShowcase } from "./DocumentIntelligenceShowcase";
import { SavedPromptList } from "./SavedPromptList";
import { savedPrompts } from "@/data/dashboard";
import type { DocumentRecord, SavedPrompt, AgentTraceRun } from "./adapters/types";

interface OctaPharmaDashboardProps {
  className?: string;
  workflowType?: "msat" | "rd" | "all";
}

// Helper to clone agent trace template
const cloneTrace = (query: string): AgentTraceRun => {
  const startedAt = new Date();
  const steps = [
    {
      id: "step-retrieve",
      stage: "Retrieve",
      toolName: "VectorSearch@Databricks",
      startedAt: new Date(startedAt.getTime() + 0).toISOString(),
      durationMs: 520,
      tokensUsed: 820,
      notes: "Top 20 candidates filtered by role scopes.",
      status: "completed" as const,
    },
    {
      id: "step-resolve",
      stage: "Version Resolver",
      toolName: "VersionResolver@SharePoint",
      startedAt: new Date(startedAt.getTime() + 320).toISOString(),
      durationMs: 310,
      tokensUsed: 210,
      notes: "Normalized to latest approved + archived variants.",
      status: "completed" as const,
    },
    {
      id: "step-validate",
      stage: "Validator",
      toolName: "ComplianceCheck@Azure",
      startedAt: new Date(startedAt.getTime() + 640).toISOString(),
      durationMs: 420,
      tokensUsed: 180,
      notes: "Documents validated for compliance.",
      status: "completed" as const,
    },
    {
      id: "step-summarize",
      stage: "Summarizer",
      toolName: "MedLM-AnswerSynth",
      startedAt: new Date(startedAt.getTime() + 1060).toISOString(),
      durationMs: 610,
      tokensUsed: 640,
      notes: "Traceable summary ready for case packaging.",
      status: "completed" as const,
    },
  ];

  const totalDurationMs = steps.reduce((acc, step) => acc + step.durationMs, 0);
  const totalTokens = steps.reduce((acc, step) => acc + step.tokensUsed, 0);

  return {
    id: `trace-${Date.now()}`,
    query,
    startedAt: startedAt.toISOString(),
    totalDurationMs,
    totalTokens,
    steps,
  };
};

function OctaPharmaDashboardContent({ 
  className = "", 
  workflowType = "all" 
}: OctaPharmaDashboardProps) {
  const { triggerToast, setAgentTrace, role, setRole } = useLayoutContext();
  const [query, setQuery] = useState("Production deviation analysis");
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  
  // Update role when workflowType changes
  useEffect(() => {
    if (workflowType === "rd") {
      setRole("R&D");
    } else if (workflowType === "msat") {
      setRole("MSAT");
    }
  }, [workflowType, setRole]);
  
  // Mock documents - in production, these would come from an API
  const [documents] = useState<DocumentRecord[]>([
    {
      id: "doc-1",
      title: "SOP-123 v9",
      docType: "Standard Operating Procedure",
      version: "v9",
      status: "Approved",
      lastOpened: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      owner: "QA Team",
      confidence: 0.92,
      lastValidated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      highlight: "[[Five new aseptic checks]] introduced; cleaning cycle extended by 12 minutes. Operator training completion at 94%.",
      source: "Document Management System",
      validated: true,
    },
    {
      id: "doc-2",
      title: "Batch Excursion Report #24-D-311",
      docType: "Deviation Report",
      version: "v1",
      status: "In Review",
      lastOpened: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      owner: "MSAT Team",
      confidence: 0.87,
      lastValidated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      highlight: "[[Lubricant viscosity shift]] linked to ambient humidity spike at 12:04. Mechanical engineering owns immediate actions.",
      source: "Quality Management System",
      validated: true,
    },
    {
      id: "doc-3",
      title: "PQ-Line-5-2024Q4",
      docType: "Process Qualification",
      version: "v2",
      status: "Approved",
      lastOpened: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      owner: "R&D Team",
      confidence: 0.95,
      lastValidated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      highlight: "Yield uplift sustained at [[+2.1%]] with all holds released. Five PQ attachments included with lineage metadata.",
      source: "Validation System",
      validated: true,
    },
  ]);

  const handlePromptSelect = (prompt: SavedPrompt) => {
    const effectiveQuery = prompt.prompt.trim();
    if (!effectiveQuery) {
      return;
    }
    setQuery(effectiveQuery);
    setActivePromptId(prompt.id);
    
    // Create agent trace and trigger toast (matching KNOWLEDGECONTROLPLANE behavior)
    const trace = cloneTrace(effectiveQuery);
    setAgentTrace(trace);
    triggerToast("success", "Semantic search completed with compliant trace.");
  };

  const handlePromptReset = () => {
    setQuery("Production deviation analysis");
    setActivePromptId(null);
    setAgentTrace(null);
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-6">
        <SavedPromptList 
          prompts={savedPrompts} 
          onSelect={handlePromptSelect}
          activePromptId={activePromptId}
          onReset={handlePromptReset}
        />
        <DocumentIntelligenceShowcase
          query={query}
          documents={documents}
          activeScope={null}
        />
      </div>
    </div>
  );
}

export default function OctaPharmaDashboard({ 
  className = "", 
  workflowType = "all" 
}: OctaPharmaDashboardProps) {
  // Note: LayoutProvider is provided by OctaPharmaChatDashboard, so we don't need to wrap here
  // The role will be managed by the parent context
  return (
    <div className={className}>
      <OctaPharmaDashboardContent className={className} workflowType={workflowType} />
    </div>
  );
}

