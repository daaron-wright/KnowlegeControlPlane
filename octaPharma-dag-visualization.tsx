"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DAGVisualization } from "@/components/dag";

export function OctaPharmaDAGVisualization({ 
  onDAGComplete, 
  messageId,
  workflowType = "all"
}: { 
  onDAGComplete?: () => void;
  messageId?: string;
  workflowType?: "msat" | "rd" | "all";
}) {
  const [shouldRenderDAG, setShouldRenderDAG] = useState(false);
  const dagMountedRef = useRef(false);

  // Use messageId if provided, otherwise generate a stable ID that persists across renders
  const DAG_ID = useMemo(() => {
    if (messageId) {
      return `octa-dag-${messageId}`;
    }
    // Fallback: generate a stable ID that doesn't change on re-renders
    return `octa-dag-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }, [messageId]); // Only regenerate if messageId changes

  console.log(`OctaPharmaDAGVisualization: Using DAG_ID: ${DAG_ID} (messageId: ${messageId})`);

  useEffect(() => {
    console.log(`OctaPharmaDAGVisualization mounted for OctaPharma workflow with ID: ${DAG_ID}`);

    // Only mount the DAG once it hasn't been mounted yet
    if (!dagMountedRef.current) {
      // Add a slight delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setShouldRenderDAG(true);
        dagMountedRef.current = true;
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [DAG_ID]);

  return (
    <div className="mt-4">
      <div
        className="h-[600px] relative overflow-y-auto rounded-lg border border-gray-200 shadow-md"
        id={`octa-dag-container-${DAG_ID}`}
      >
        {shouldRenderDAG ? (
          <DAGVisualization
            isOctaPharma={true}
            messageId={DAG_ID}
            onDAGComplete={onDAGComplete}
            octaPharmaWorkflow={workflowType}
            legend={[
              { color: "#ea580c", label: "Workflow Orchestration & Control" },
              { color: "#dc2626", label: "Access & Compliance" },
              { color: "#22c55e", label: "Performance & Optimization" },
              { color: "#7c3aed", label: "Data Retrieval & Acquisition" },
              { color: "#3b82f6", label: "Data Quality & Enrichment" },
              { color: "#008080", label: "Domain Workflows" }
            ]}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto mb-3"></div>
              <span className="text-gray-600">Loading OctaPharma workflow...</span>
              <div className="text-xs text-gray-500 mt-1">
                Initializing data sources and analytics pipeline
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
