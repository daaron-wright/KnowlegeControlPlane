// Node Analyzer - Extract comprehensive information about DAG nodes
import type { Node } from "reactflow";

// Import all DAG data files
import { initialNodes as measlesNodes } from "@/components/dag/utils/dag-data";
import { initialNodes as esgNodes } from "@/components/dag/utils/esg-dag-data";
import { initialNodes as isuzuNodes } from "@/components/dag/utils/isuzu-dag-data";
import { initialNodes as backToSchoolNodes } from "@/components/dag/utils/back-to-school-dag-data";

export interface NodeAnalysis {
  id: string;
  label: string;
  type: string;
  description: string;
  tools: string[];
  inputSchema?: any;
  outputSchema?: any;
  asyncStatus: boolean;
  processingTime: number;
  dependencies: string[];
  outputs: string[];
  metrics: Record<string, any>;
  details: string[];
  agentType?: string;
  color: string;
}

export interface WorkflowAnalysis {
  name: string;
  totalNodes: number;
  nodeTypes: Record<string, number>;
  asyncNodes: number;
  syncNodes: number;
  avgProcessingTime: number;
  nodes: NodeAnalysis[];
}

// Extract tool information from details array
function extractTools(details: string[]): string[] {
  return details
    .filter(detail => detail.startsWith("Tool:"))
    .map(detail => detail.replace("Tool: ", "").trim());
}

// Extract async status from details array
function extractAsyncStatus(details: string[]): boolean {
  const asyncDetail = details.find(detail => detail.includes("Async:"));
  if (asyncDetail) {
    return asyncDetail.toLowerCase().includes("true");
  }
  return false;
}

// Extract outputs from details array
function extractOutputs(details: string[]): string[] {
  return details
    .filter(detail => detail.startsWith("Output:") || detail.startsWith("Outputs:"))
    .map(detail => detail.replace(/^Outputs?:\s*/, "").trim())
    .flatMap(output => output.split(",").map(o => o.trim()));
}

// Extract dependencies from details array
function extractDependencies(details: string[]): string[] {
  return details
    .filter(detail => detail.startsWith("Depends on:"))
    .map(detail => detail.replace("Depends on: ", "").trim())
    .flatMap(deps => deps.split(",").map(d => d.trim()));
}

// Analyze a single node
function analyzeNode(node: Node): NodeAnalysis {
  const data = node.data;
  const details = data.details || [];
  
  return {
    id: node.id,
    label: data.label || "Unknown",
    type: node.type || "custom",
    description: data.description || "",
    tools: extractTools(details),
    inputSchema: data.inputSchema,
    outputSchema: data.outputSchema,
    asyncStatus: extractAsyncStatus(details),
    processingTime: data.processingTime || 0,
    dependencies: extractDependencies(details),
    outputs: extractOutputs(details),
    metrics: data.metrics || {},
    details: details,
    agentType: data.agentType,
    color: data.color || "#000000"
  };
}

// Analyze all workflows
export function analyzeAllWorkflows(): Record<string, WorkflowAnalysis> {
  const workflows = {
    "Measles Outbreak": measlesNodes,
    "ESG Portfolio": esgNodes,
    "Isuzu Production": isuzuNodes,
    "Back-to-School": backToSchoolNodes
  };

  const analyses: Record<string, WorkflowAnalysis> = {};

  Object.entries(workflows).forEach(([name, nodes]) => {
    const nodeAnalyses = nodes.map(analyzeNode);
    
    // Calculate statistics
    const nodeTypes: Record<string, number> = {};
    let asyncNodes = 0;
    let syncNodes = 0;
    let totalProcessingTime = 0;

    nodeAnalyses.forEach(node => {
      // Count node types
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
      
      // Count async/sync
      if (node.asyncStatus) {
        asyncNodes++;
      } else {
        syncNodes++;
      }
      
      // Sum processing time
      totalProcessingTime += node.processingTime;
    });

    analyses[name] = {
      name,
      totalNodes: nodeAnalyses.length,
      nodeTypes,
      asyncNodes,
      syncNodes,
      avgProcessingTime: totalProcessingTime / nodeAnalyses.length,
      nodes: nodeAnalyses
    };
  });

  return analyses;
}

// Get nodes for a specific workflow
export function getWorkflowNodes(workflowName: string): NodeAnalysis[] {
  const analyses = analyzeAllWorkflows();
  return analyses[workflowName]?.nodes || [];
}

// Search nodes by criteria
export function searchNodes(criteria: {
  workflow?: string;
  hasInputSchema?: boolean;
  hasOutputSchema?: boolean;
  isAsync?: boolean;
  tool?: string;
  nodeType?: string;
}): NodeAnalysis[] {
  const allAnalyses = analyzeAllWorkflows();
  let allNodes: NodeAnalysis[] = [];

  // Collect all nodes or filter by workflow
  if (criteria.workflow) {
    allNodes = allAnalyses[criteria.workflow]?.nodes || [];
  } else {
    allNodes = Object.values(allAnalyses).flatMap(analysis => analysis.nodes);
  }

  // Apply filters
  return allNodes.filter(node => {
    if (criteria.hasInputSchema !== undefined) {
      const hasSchema = !!node.inputSchema;
      if (hasSchema !== criteria.hasInputSchema) return false;
    }

    if (criteria.hasOutputSchema !== undefined) {
      const hasSchema = !!node.outputSchema;
      if (hasSchema !== criteria.hasOutputSchema) return false;
    }

    if (criteria.isAsync !== undefined) {
      if (node.asyncStatus !== criteria.isAsync) return false;
    }

    if (criteria.tool) {
      if (!node.tools.some(tool => tool.toLowerCase().includes(criteria.tool!.toLowerCase()))) {
        return false;
      }
    }

    if (criteria.nodeType) {
      if (node.type !== criteria.nodeType) return false;
    }

    return true;
  });
}

// Generate summary report
export function generateSummaryReport(): string {
  const analyses = analyzeAllWorkflows();
  
  let report = "# DAG Node Analysis Report\n\n";
  
  Object.entries(analyses).forEach(([workflowName, analysis]) => {
    report += `## ${workflowName} Workflow\n\n`;
    report += `- **Total Nodes**: ${analysis.totalNodes}\n`;
    report += `- **Async Nodes**: ${analysis.asyncNodes} (${((analysis.asyncNodes/analysis.totalNodes)*100).toFixed(1)}%)\n`;
    report += `- **Sync Nodes**: ${analysis.syncNodes} (${((analysis.syncNodes/analysis.totalNodes)*100).toFixed(1)}%)\n`;
    report += `- **Average Processing Time**: ${analysis.avgProcessingTime.toFixed(1)}s\n\n`;
    
    report += `### Node Types:\n`;
    Object.entries(analysis.nodeTypes).forEach(([type, count]) => {
      report += `- ${type}: ${count}\n`;
    });
    report += "\n";
    
    report += `### Nodes with Input Schema: ${analysis.nodes.filter(n => n.inputSchema).length}\n`;
    report += `### Nodes with Output Schema: ${analysis.nodes.filter(n => n.outputSchema).length}\n\n`;
    
    report += "### Tools Used:\n";
    const allTools = new Set(analysis.nodes.flatMap(n => n.tools));
    Array.from(allTools).sort().forEach(tool => {
      report += `- ${tool}\n`;
    });
    report += "\n---\n\n";
  });

  return report;
}

// Export node data as JSON
export function exportNodesAsJSON(workflowName?: string): string {
  if (workflowName) {
    const nodes = getWorkflowNodes(workflowName);
    return JSON.stringify(nodes, null, 2);
  } else {
    const analyses = analyzeAllWorkflows();
    return JSON.stringify(analyses, null, 2);
  }
}

// Generate detailed node table
export function generateNodeTable(workflowName?: string): NodeAnalysis[] {
  if (workflowName) {
    return getWorkflowNodes(workflowName);
  } else {
    const analyses = analyzeAllWorkflows();
    return Object.values(analyses).flatMap(analysis => 
      analysis.nodes.map(node => ({ ...node, workflow: analysis.name }))
    );
  }
}
