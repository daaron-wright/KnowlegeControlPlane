"use client";

import type React from "react";

import { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  Background,
  type Node,
  type NodeTypes,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { debounce } from "lodash";
import { RefreshCw, Expand, X } from "lucide-react";
import dynamic from "next/dynamic";

// Import local components
import { CustomNode } from "./nodes/custom-node";
import { CloudNode } from "./nodes/cloud-node";
import { OnPremNode } from "./nodes/on-prem-node";
import { BackgroundLayer } from "./background/background-layer";
import "./styles/dag-styles.css";

// If you're using shadcn/ui Button, import it from your components
// If not, th  }, [clearAllTimers]);

  // Dynamic edge generation based on current animation statees a basic button implementation below
import { Button } from "./components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

// Import the VideoPopup component
import { VideoPopup } from "@/components/VideoPopup";

// Dynamically import the 3D component to avoid SSR issues
const ThreeDimensionalDAG = dynamic(() => import("@/components/3dm2m/mock-3d-dag"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue/30 border-t-blue rounded-full animate-spin"></div>
      <span className="ml-3">Preparing 3D visualization...</span>
    </div>
  ),
});

// Define node types including the new Cloud and On-Prem nodes
const nodeTypes: NodeTypes = {
  custom: CustomNode,
  cloud: CloudNode,
  onprem: OnPremNode,
};

// Helper function to check if we're in browser environment
const isBrowser = () => typeof window !== "undefined";

// Helper for localStorage interaction
const COMPLETED_DAGS_KEY = "omnis_completed_dags";
const hasCompletedDAG = (id: string): boolean => {
  if (!isBrowser()) return false;
  try {
    const stored = localStorage.getItem(COMPLETED_DAGS_KEY);
    if (!stored) return false;
    const completedDAGs = JSON.parse(stored);
    return Array.isArray(completedDAGs) && completedDAGs.includes(id);
  } catch (e) {
    console.error("Error checking completed DAGs:", e);
    return false;
  }
};

const markDAGCompleted = (id: string): void => {
  if (!isBrowser()) return;
  try {
    const stored = localStorage.getItem(COMPLETED_DAGS_KEY);
    let completedDAGs: string[] = [];
    if (stored) {
      completedDAGs = JSON.parse(stored);
      if (!Array.isArray(completedDAGs)) completedDAGs = [];
    }
    if (!completedDAGs.includes(id)) {
      completedDAGs.push(id);
      localStorage.setItem(COMPLETED_DAGS_KEY, JSON.stringify(completedDAGs));
      console.log(`Marked DAG ${id} as completed in localStorage`);
    }
  } catch (e) {
    console.error("Error marking DAG as completed:", e);
  }
};

const clearDAGMemory = (id: string): void => {
  if (!isBrowser()) return;
  try {
    const stored = localStorage.getItem(COMPLETED_DAGS_KEY);
    if (!stored) return;

    let completedDAGs = JSON.parse(stored);
    if (!Array.isArray(completedDAGs)) return;

    // Remove this ID from the completed list
    completedDAGs = completedDAGs.filter((dagId) => dagId !== id);
    localStorage.setItem(COMPLETED_DAGS_KEY, JSON.stringify(completedDAGs));
    console.log(`Cleared DAG ${id} from completed memory`);
  } catch (e) {
    console.error("Error clearing DAG memory:", e);
  }
};

// NEW: Clear all DAG cache - useful for forcing fresh starts
const clearAllDAGMemory = (): void => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(COMPLETED_DAGS_KEY);
    console.log("Cleared ALL DAG completion memory - all DAGs will restart fresh");
  } catch (e) {
    console.error("Error clearing all DAG memory:", e);
  }
};

// Export for external use
export { clearAllDAGMemory, clearDAGMemory };

// Define props interface with onDAGComplete callback and message ID
export interface DAGVisualizationProps {
  onDAGComplete?: () => void;
  messageId?: string; // Add messageId to make each DAG unique per chat message
  isMeaslesUseCase?: boolean; // Add flag to identify measles use case
  isIzuzuUseCase?: boolean; // Add flag to identify Isuzu use case
  isBackToSchoolUseCase?: boolean; // Add flag to identify Back-to-School use case
  isESGUseCase?: boolean; // Add flag to identify ESG use case
  isOctaPharma?: boolean; // Add flag to identify OctaPharma use case
  octaPharmaWorkflow?: "msat" | "rd" | "all"; // Workflow type for OctaPharma (MSAT, R&D, or all)
  legend?: { color: string; label: string }[]; // Optional color legend
}

// Main component with ReactFlowProvider
export function DAGVisualization({
  onDAGComplete,
  messageId = "default", // Default ID if none provided
  isMeaslesUseCase = false, // Default to false
  isIzuzuUseCase = false, // Default to false
  isBackToSchoolUseCase = false, // Default to false
  isESGUseCase = false, // Default to false
  isOctaPharma = false, // Default to false
  octaPharmaWorkflow = "all", // Default to showing all workflows
  legend,
}: DAGVisualizationProps = {}) {
  // Generate a unique ID for this DAG instance based on the message ID
  // This ensures each chat message has its own DAG state
  const instanceId = `health_prompt_dag_${messageId}`;

  return (
    <div className="dag-container relative h-[calc(100vh-18rem)] w-full overflow-visible rounded-lg border border-gray-200 shadow-sm">
      <BackgroundLayer />
      <ReactFlowProvider>
        <DAGFlow onDAGComplete={onDAGComplete} instanceId={instanceId} isMeaslesUseCase={isMeaslesUseCase} isIzuzuUseCase={isIzuzuUseCase} isBackToSchoolUseCase={isBackToSchoolUseCase} isESGUseCase={isESGUseCase} isOctaPharma={isOctaPharma} octaPharmaWorkflow={octaPharmaWorkflow} legend={legend} />
      </ReactFlowProvider>
    </div>
  );
}

// Separate flow component to use ReactFlow hooks
function DAGFlow({
  onDAGComplete,
  instanceId,
  isMeaslesUseCase = false,
  isIzuzuUseCase = false,
  isBackToSchoolUseCase = false,
  isESGUseCase = false,
  isOctaPharma = false,
  octaPharmaWorkflow = "all",
  legend
}: {
  onDAGComplete?: () => void;
  instanceId: string;
  isMeaslesUseCase?: boolean;
  isIzuzuUseCase?: boolean;
  isBackToSchoolUseCase?: boolean;
  isESGUseCase?: boolean;
  isOctaPharma?: boolean;
  octaPharmaWorkflow?: "msat" | "rd" | "all";
  legend?: { color: string; label: string }[];
}) {
  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [animationSpeed] = useState(200);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isM2MPopupOpen, setIsM2MPopupOpen] = useState(false);
  const [isM2MLoading, setIsM2MLoading] = useState(true);
  const [hasGeneratedBefore, setHasGeneratedBefore] = useState(false);
  // Add state for video popup
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  // Dynamic DAG data loading based on use case
  let initialNodes, initialEdges, getNodeDependencies;
  
  if (isMeaslesUseCase) {
    const dagData = require("./utils/dag-data");
    initialNodes = dagData.initialNodes;
    initialEdges = dagData.initialEdges;
    getNodeDependencies = dagData.getNodeDependencies;
  } else if (isIzuzuUseCase) {
    const dagData = require("./utils/isuzu-dag-data");
    initialNodes = dagData.initialNodes;
    initialEdges = dagData.initialEdges;
    getNodeDependencies = dagData.getNodeDependencies || (() => []); // Fallback if not defined
  } else if (isBackToSchoolUseCase) {
    const dagData = require("./utils/back-to-school-dag-data");
    initialNodes = dagData.initialNodes;
    initialEdges = dagData.initialEdges;
    getNodeDependencies = dagData.getNodeDependencies;
  } else if (isESGUseCase) {
    const dagData = require("./utils/esg-dag-data");
    initialNodes = dagData.initialNodes;
    initialEdges = dagData.initialEdges;
    getNodeDependencies = dagData.getNodeDependencies || (() => []); // Fallback if not defined
  } 
   else if (isOctaPharma) {
    const dagData = require("./utils/octapharma-dag-data");
    // Use workflow-specific filtering for OctaPharma
    initialNodes = dagData.getNodesForWorkflow(octaPharmaWorkflow);
    initialEdges = dagData.getEdgesForWorkflow(octaPharmaWorkflow);
    getNodeDependencies = (nodeId: string) => 
      dagData.getDependenciesForWorkflow(nodeId, octaPharmaWorkflow) || [];
  } else {
    // Default to truck/autonomous case
    const dagData = require("./utils/new-dag-data");
    initialNodes = dagData.initialNodes;
    initialEdges = dagData.initialEdges;
    getNodeDependencies = dagData.getNodeDependencies;
  }

  // Check if this DAG has been generated before
  useEffect(() => {
    const wasGenerated = hasCompletedDAG(instanceId);
    isInitialLoad.current = !wasGenerated;
    setHasGeneratedBefore(wasGenerated);
    console.log(
      `DAG ${instanceId} - Previously generated: ${wasGenerated}, setting isInitialLoad=${!wasGenerated}`
    );
  }, [instanceId]);

  // Refs
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isInitialLoad = useRef(true); // Start with true and update based on hasGeneratedBefore
  const completedNodesRef = useRef<Set<string>>(new Set());
  const processingNodesRef = useRef<Set<string>>(new Set());
  const checkReadyNodesRef = useRef<() => void>(() => {});
  const animationFrameRef = useRef<number | null>(null);
  const dagCompletionFiredRef = useRef<boolean>(false);

  // Get ReactFlow instance
  const reactFlowInstance = useReactFlow();

  // Add event handlers to prevent scroll propagation - moved inside the component
  useEffect(() => {
    // Function to handle wheel events
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.classList.contains("scrollable-content") ||
          target.closest(".scrollable-content") ||
          target.classList.contains("scrollable-area") ||
          target.closest(".scrollable-area"))
      ) {
        e.stopPropagation();
      }
    };

    // Function to handle mouse down events
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.classList.contains("scrollable-content") ||
          target.closest(".scrollable-content") ||
          target.classList.contains("scrollable-area") ||
          target.closest(".scrollable-area"))
      ) {
        e.stopPropagation();
      }
    };

    // Add event listeners
    document.addEventListener("wheel", handleWheel, { capture: true });
    document.addEventListener("mousedown", handleMouseDown, { capture: true });

    // Clean up
    return () => {
      document.removeEventListener("wheel", handleWheel, { capture: true });
      document.removeEventListener("mousedown", handleMouseDown, {
        capture: true,
      });
    };
  }, []);

  // Memoized callbacks
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // We no longer need to set selected node since nodes expand in place
    // The node component itself will handle the expansion
  }, []);

  const closeNodeInfo = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Debounced version of toggleLabels to prevent rapid state changes
  const toggleLabels = useCallback(
    debounce(() => {
      setShowLabels((prev) => !prev);
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            showLabel: !showLabels,
          },
        }))
      );
    }, 300),
    [showLabels, setNodes]
  );

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Reset the simulation
  const resetSimulation = useCallback(() => {
    clearAllTimers();
    setIsSimulating(false);
    completedNodesRef.current.clear();
    processingNodesRef.current.clear();
    dagCompletionFiredRef.current = false; // Reset completion flag

    // Reset all nodes to idle state
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          processingState: "idle",
        },
      }))
    );

    // Reset all edges to non-animated
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: false,
      }))
    );
  }, [clearAllTimers, setNodes, setEdges]);

  // Start the initial animation
  const startAnimation = useCallback(() => {
    clearAllTimers();
    setNodes([]);
    setEdges([]);
    setIsAnimating(true);
    resetSimulation();
    isInitialLoad.current = true;
  }, [clearAllTimers, setNodes, setEdges, resetSimulation]);

  // Check if a node is ready to process (all dependencies completed)
  const isNodeReadyToProcess = useCallback((nodeId: string) => {
    // Get all dependencies for this node
    const dependencies = getNodeDependencies(nodeId);

    // Debug logging for OctaPharma
    if (isOctaPharma && (nodeId === "MSAT3" || nodeId.startsWith("MSAT"))) {
      console.log(`[DEBUG] Node ${nodeId} dependencies:`, dependencies);
      console.log(`[DEBUG] Completed nodes:`, Array.from(completedNodesRef.current));
      console.log(`[DEBUG] Node ${nodeId} in nodes list:`, nodes.some(n => n.id === nodeId));
      console.log(`[DEBUG] getNodeDependencies function:`, getNodeDependencies.toString().substring(0, 100));
    }

    // If no dependencies, it's ready
    if (dependencies.length === 0) return true;

    // Check if all dependencies are completed
    const allCompleted = dependencies.every((depId) => completedNodesRef.current.has(depId));
    
    // Debug logging
    if (isOctaPharma && (nodeId === "MSAT3" || nodeId.startsWith("MSAT"))) {
      console.log(`[DEBUG] Node ${nodeId} all dependencies completed:`, allCompleted);
      dependencies.forEach(depId => {
        const isCompleted = completedNodesRef.current.has(depId);
        console.log(`[DEBUG]   - Dependency ${depId}: ${isCompleted ? 'completed' : 'NOT completed'}`);
      });
    }
    
    return allCompleted;
  }, [nodes, isOctaPharma, getNodeDependencies]);

  // Find all nodes that are ready to process
  const findReadyNodes = useCallback(() => {
    return nodes
      .filter(
        (node) =>
          // Node is idle and not already processing
          node.data.processingState === "idle" &&
          !processingNodesRef.current.has(node.id) &&
          // All dependencies are completed
          isNodeReadyToProcess(node.id)
      )
      .map((node) => node.id);
  }, [nodes, isNodeReadyToProcess]);

  // Process a specific node
  const processNode = useCallback(
    (nodeId: string) => {
      console.log(`Processing node: ${nodeId}`);

      // Mark node as processing
      processingNodesRef.current.add(nodeId);

      // Update node state
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            processingState:
              node.id === nodeId ? "processing" : node.data.processingState,
          },
        }))
      );

      // Animate incoming edges
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          animated: edge.target === nodeId || edge.animated,
        }))
      );

      // Get processing time for this node
      const node = nodes.find((n) => n.id === nodeId);
      const processingTime = node?.data.processingTime || 3;

      // Schedule completion
      const completeTimer = setTimeout(() => {
        console.log(`Completing node: ${nodeId}`);

        // Mark as completed
        completedNodesRef.current.add(nodeId);
        processingNodesRef.current.delete(nodeId);

        // Update node state to show green (completed)
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            data: {
              ...node.data,
              processingState:
                node.id === nodeId ? "completed" : node.data.processingState,
            },
          }))
        );

        // Animate outgoing edges
        setEdges((eds) =>
          eds.map((edge) => ({
            ...edge,
            animated:
              edge.source === nodeId ||
              (edge.animated && edge.target !== nodeId),
          }))
        );

        // After a node completes, check if entire DAG is now complete
        setTimeout(() => {
          // Inline completion check to avoid dependency issues
          const totalNodes = nodes.length;
          const completedNodes = completedNodesRef.current.size;
          const processingNodes = processingNodesRef.current.size;

          console.log(`Post-completion check: ${completedNodes}/${totalNodes} nodes completed, ${processingNodes} processing`);

          const isFullyComplete = 
            completedNodes === totalNodes && 
            processingNodes === 0 && 
            totalNodes > 0 &&
            !dagCompletionFiredRef.current;

          if (isFullyComplete) {
            console.log("🎉 DAG FULLY COMPLETED - All nodes are green!");
            dagCompletionFiredRef.current = true;
            markDAGCompleted(instanceId);
            setIsSimulating(false);
            
            if (onDAGComplete) {
              setTimeout(() => {
                console.log("Calling onDAGComplete callback - dashboard generation can now begin");
                onDAGComplete();
              }, 800);
            }
          }
        }, 100);

        // Legacy completion check for specific COMPLETE node (keeping for backward compatibility)
        if (
          nodeId === "COMPLETE" &&
          onDAGComplete &&
          !dagCompletionFiredRef.current
        ) {
          console.log("Legacy DAG Completion Hook processed");
          dagCompletionFiredRef.current = true;
          markDAGCompleted(instanceId);
          setTimeout(() => {
            onDAGComplete();
          }, 500);
        }

        // Check for new nodes that can now start
        setTimeout(() => {
          if (checkReadyNodesRef.current) {
            checkReadyNodesRef.current();
          }
        }, 0);
      }, processingTime * 1000); // Convert to milliseconds

      timersRef.current.push(completeTimer);
    },
    [nodes, setNodes, setEdges, onDAGComplete, instanceId]
  );

  // Check and start any nodes that are ready to process
  const checkAndStartReadyNodes = useCallback(() => {
    const readyNodeIds = findReadyNodes();
    console.log("Ready nodes:", readyNodeIds);

    // Process all ready nodes
    readyNodeIds.forEach((nodeId) => {
      processNode(nodeId);
    });

    // Check for completion after starting nodes (with delay to allow processing to begin)
    setTimeout(() => {
      const totalNodes = nodes.length;
      const completedNodes = completedNodesRef.current.size;
      const processingNodes = processingNodesRef.current.size;

      console.log(`Ready-nodes completion check: ${completedNodes}/${totalNodes} completed, ${processingNodes} processing`);

      const isFullyComplete = 
        completedNodes === totalNodes && 
        processingNodes === 0 && 
        totalNodes > 0 &&
        !dagCompletionFiredRef.current;

      if (isFullyComplete) {
        console.log("🎉 DAG FULLY COMPLETED via ready-nodes check - All nodes are green!");
        dagCompletionFiredRef.current = true;
        markDAGCompleted(instanceId);
        setIsSimulating(false);
        
        if (onDAGComplete) {
          setTimeout(() => {
            console.log("Calling onDAGComplete callback from ready-nodes check");
            onDAGComplete();
          }, 800);
        }
      }
    }, 200);
  }, [findReadyNodes, processNode, nodes.length, onDAGComplete, instanceId]);

  // Update the ref to the current checkAndStartReadyNodes function
  useEffect(() => {
    checkReadyNodesRef.current = checkAndStartReadyNodes;
  }, [checkAndStartReadyNodes]);

  // Update the ref to the current checkAndStartReadyNodes function
  useEffect(() => {
    checkReadyNodesRef.current = checkAndStartReadyNodes;
  }, [checkAndStartReadyNodes]);

  // Start the asynchronous simulation
  const startSimulation = useCallback(() => {
    if (isSimulating) {
      resetSimulation();
      return;
    }

    setIsSimulating(true);
    completedNodesRef.current.clear();
    processingNodesRef.current.clear();

    // Clear any existing timers
    clearAllTimers();

    // Reset all nodes to idle state first
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          processingState: "idle",
        },
      }))
    );

    // Reset all edges to non-animated
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: false,
      }))
    );

    // Start with a small delay
    setTimeout(() => {
      // Start the simulation by checking for ready nodes
      checkAndStartReadyNodes();
    }, 500);
  }, [
    isSimulating,
    resetSimulation,
    clearAllTimers,
    checkAndStartReadyNodes,
    setNodes,
    setEdges,
  ]);

  // Optimized function to add nodes and edges in batches
  const addNodesAndEdgesInBatches = useCallback(() => {
    if (!isAnimating) return;

    // Changed from BATCH_SIZE = 3 to 1 to make nodes appear one by one
    const BATCH_SIZE = 1;
    let nodeIndex = 0;
    let edgeIndex = 0;
    let isAddingNodes = true;

    const processNextBatch = () => {
      if (!isAnimating) return;

      if (isAddingNodes) {
        // Add a single node at a time
        const nodesToAdd: typeof initialNodes = [];
        const batchEnd = Math.min(nodeIndex + BATCH_SIZE, initialNodes.length);

        for (let i = nodeIndex; i < batchEnd; i++) {
          nodesToAdd.push(initialNodes[i]);
        }

        if (nodesToAdd.length > 0) {
          setNodes((currentNodes) => [...currentNodes, ...nodesToAdd]);
          nodeIndex = batchEnd;

          // Generate random delay between 1000-2000ms (1-2 seconds)
          const randomDelay = Math.floor(Math.random() * 1000) + 1000;

          // Schedule next node with random delay
          setTimeout(processNextBatch, randomDelay);
        } else {
          // All nodes added, switch to edges
          isAddingNodes = false;
          setTimeout(processNextBatch, 500); // Keep edge batching faster
        }
      } else {
        // Add a batch of edges
        const edgesToAdd: typeof initialEdges = [];
        const batchEnd = Math.min(edgeIndex + BATCH_SIZE, initialEdges.length);

        for (let i = edgeIndex; i < batchEnd; i++) {
          edgesToAdd.push(initialEdges[i]);
        }

        if (edgesToAdd.length > 0) {
          setEdges((currentEdges) => [...currentEdges, ...edgesToAdd]);
          edgeIndex = batchEnd;

          // Schedule next batch - keep edges moving quicker
          setTimeout(processNextBatch, 250);
        } else {
          // All edges added, animation complete
          setIsAnimating(false);
        }
      }
    };

    // Start the batched processing
    setTimeout(processNextBatch, 0);
  }, [isAnimating, setNodes, setEdges]);

  // Animate nodes appearing in batches
  useEffect(() => {
    if (isAnimating) {
      addNodesAndEdgesInBatches();
    }

    return () => {
      // Cleanup any pending operations
      clearAllTimers();
    };
  }, [isAnimating, addNodesAndEdgesInBatches, clearAllTimers]);

  // Initialize with labels
  useEffect(() => {
    if (nodes.length > 0) {
      // Use a timeout to batch this update
      const timer = setTimeout(() => {
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            data: {
              ...node.data,
              showLabel: showLabels,
            },
          }))
        );
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [setNodes, showLabels, nodes.length]);

  // Start simulation when nodes are loaded
  useEffect(() => {
    // Skip for previously generated DAGs
    if (hasCompletedDAG(instanceId)) return;

    if (!isAnimating && nodes.length > 0 && isInitialLoad.current) {
      isInitialLoad.current = false;
      const timer = setTimeout(() => {
        startSimulation();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, nodes.length, startSimulation, instanceId]);

  // Center view on load with fixed zoom - but only once at the beginning
  useEffect(() => {
    // Only set the viewport once when nodes first appear and it's not a completed DAG
    if (
      nodes.length > 0 &&
      !completedNodesRef.current.has("viewport_set") &&
      !hasCompletedDAG(instanceId)
    ) {
      const timer = setTimeout(() => {
        try {
          // Set a fixed zoom level and center position
          reactFlowInstance.setViewport(
            {
              // Center position based on DAG layout
              x: 250,
              y: 250,
              // Balanced zoom level
              zoom: 0.15,
            },
            { duration: 400 }
          );

          // Mark that we've set the viewport so we don't reset it during node generation
          completedNodesRef.current.add("viewport_set");
          console.log("Initial viewport set for DAG animation");
        } catch (error) {
          console.warn("Error setting view:", error);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [nodes.length, reactFlowInstance, instanceId]);

  // Auto-start animation on first load, but only after component is fully mounted
  useEffect(() => {
    // Skip for previously generated DAGs - they're handled by the completed DAGs effect
    if (hasCompletedDAG(instanceId) || nodes.length > 0) return;

    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    const timer = setTimeout(() => {
      console.log(`Starting fresh animation for DAG ${instanceId}`);
      startAnimation();

      // Only set the viewport if it hasn't been set already
      if (!completedNodesRef.current.has("viewport_set")) {
        try {
          reactFlowInstance.setViewport(
            {
              x: 250,
              y: 250,
              zoom: 0.15,
            },
            { duration: 0 }
          );
          // Mark that we've set the viewport
          completedNodesRef.current.add("viewport_set");
        } catch (error) {
          console.warn("Error setting initial view:", error);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    isInitialRender,
    startAnimation,
    instanceId,
    reactFlowInstance,
    nodes.length,
  ]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Zoom functions with debouncing
  const zoomIn = useCallback(
    debounce(() => {
      reactFlowInstance.zoomIn({ duration: 300 });
    }, 200),
    [reactFlowInstance]
  );

  const zoomOut = useCallback(
    debounce(() => {
      reactFlowInstance.zoomOut({ duration: 300 });
    }, 200),
    [reactFlowInstance]
  );

  // Modify the M2M popup open handler to also show the video popup
  const handleOpen3DView = () => {
    setIsM2MPopupOpen(true);
    // setShowVideoPopup(true); // DISABLED: Video popup deactivated
    // Reset loading state when opening
    setIsM2MLoading(true);
  };

  const handleClose3DView = () => {
    setIsM2MPopupOpen(false);
  };

  // Update loading state with timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isM2MPopupOpen && isM2MLoading) {
      timeoutId = setTimeout(() => {
        setIsM2MLoading(false);
      }, 1500); // 1.5 second loading simulation
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isM2MPopupOpen, isM2MLoading]);

  // Enhanced DAG completion monitoring with comprehensive logging
  useEffect(() => {
    // This effect runs whenever completion state might change
    // The actual completion logic is handled in checkDAGCompletion()
    // This is just for monitoring and debugging
    
    if (nodes.length > 0) {
      const totalNodes = nodes.length;
      const completedNodes = completedNodesRef.current.size;
      const processingNodes = processingNodesRef.current.size;
      
      console.log(`DAG State Monitor: ${completedNodes}/${totalNodes} completed, ${processingNodes} processing`);
      
      // Debug: List all completed node IDs
      if (completedNodes > 0) {
        const completedIds = Array.from(completedNodesRef.current);
        console.log(`Completed nodes: [${completedIds.join(', ')}]`);
      }
    }
  }, [nodes.length]);

  // Add a function to reset DAG memory and reload
  const resetDAGMemory = useCallback(() => {
    console.log(`Resetting DAG memory for ${instanceId}...`);
    clearDAGMemory(instanceId);

    // Reload the page to restart with fresh state
    if (isBrowser()) {
      window.location.reload();
    }
  }, [instanceId]);

  // Handle completed DAGs by loading all nodes with completed state
  useEffect(() => {
    if (hasCompletedDAG(instanceId) && nodes.length === 0) {
      console.log(
        `DAG ${instanceId} was previously generated - loading completed state`
      );

      // Add all nodes and edges at once
      setNodes(
        initialNodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            processingState: "completed",
            showLabel: showLabels,
          },
        }))
      );

      setEdges(initialEdges);

      // Add all nodes to completed set for internal tracking
      initialNodes.forEach((node) => {
        completedNodesRef.current.add(node.id);
      });

      // Set animation flags
      setIsAnimating(false);
      setIsSimulating(false);
      isInitialLoad.current = false;

      // Apply a fixed viewport with a short delay to ensure nodes are rendered
      const timer = setTimeout(() => {
        try {
          if (!completedNodesRef.current.has("viewport_set")) {
            reactFlowInstance.setViewport(
              {
                x: 250,
                y: 250,
                zoom: 0.15,
              },
              { duration: 400 }
            );

            // Mark that we've set the viewport
            completedNodesRef.current.add("viewport_set");
          }
        } catch (error) {
          console.warn("Error setting view for completed DAG:", error);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    instanceId,
    reactFlowInstance,
    nodes.length,
    setNodes,
    setEdges,
    showLabels,
  ]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView={false}
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 250, y: 250, zoom: 0.15 }}
        proOptions={{
          hideAttribution: true,
        }}
        className="rounded-lg react-flow-wrapper"
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={false}
        panOnDrag={true}
        elementsSelectable={true}
        nodesConnectable={false}
        nodesDraggable={false}
      >
        <Background color="rgba(0, 0, 0, 0.01)" gap={20} size={1} />

        <Panel position="top-right" className="flex gap-2">
          <Button
            variant="black"
            size="sm"
            className="flex items-center gap-1 shadow-sm"
            onClick={startAnimation}
            disabled={isAnimating}
          >
            {isAnimating ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Loading...
              </>
            ) : (
              <>
                <RefreshCw size={14} /> Reset View
              </>
            )}
          </Button>

        </Panel>
        {legend && legend.length > 0 ? (
          <Panel position="bottom-left" className="dag-legend bg-white/90 backdrop-blur-sm rounded-md shadow border p-2 max-w-[240px]">
            <div className="text-xs font-semibold mb-1 text-gray-700">Key</div>
            <div className="flex flex-col gap-1">
              {legend.map((item, idx) => (
                <div key={`${item.color}-${idx}`} className="flex items-center gap-2">
                  <span
                    className="inline-block rounded-sm border shrink-0"
                    style={{ backgroundColor: item.color, width: 12, height: 12, borderColor: "rgba(0,0,0,0.1)" }}
                    aria-label={item.label}
                  />
                  <span className="text-xs text-gray-700 truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </Panel>
        ) : null}
      </ReactFlow>



      {/* Video Popup */}
      <VideoPopup
        isOpen={showVideoPopup}
        onClose={() => setShowVideoPopup(false)}
        videoSrc="/videos/55 Entities.mp4"
        autoClose={true}
      />
    </>
  );
}
