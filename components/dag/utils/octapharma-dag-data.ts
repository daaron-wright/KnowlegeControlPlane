import type { Edge, Node } from "reactflow";
import dagJson from "./octapharma_full_dag.json";

type RawDagNode = {
  id: string;
  type?: string;
  position?: { x: number; y: number };
  data: Record<string, unknown>;
};

type RawDagEdge = {
  id?: string;
  source: string;
  target: string;
  type?: Edge["type"];
};

export type WorkflowType = "msat" | "rd" | "all";

const rawNodes = dagJson as unknown as RawDagNode[];

// Helper to determine if a node belongs to a specific workflow
function nodeBelongsToWorkflow(nodeId: string, workflow: WorkflowType): boolean {
  if (workflow === "all") return true;
  
  // Common nodes (N0-N14, Q0) are included in both workflows
  if (nodeId.startsWith("N") || nodeId === "Q0") return true;
  
  if (workflow === "msat") {
    return nodeId.startsWith("MSAT");
  } else if (workflow === "rd") {
    return nodeId.startsWith("RD");
  }
  
  return false;
}

// Helpers for layout
function gridPosition(index: number, spacing = 300): { x: number; y: number } {
  const cols = Math.ceil(Math.sqrt(Math.max(1, rawNodes.length)));
  const row = Math.floor(index / cols);
  const col = index % cols;
  return { x: col * spacing, y: row * spacing };
}

// Try to load optional edges JSON if present; otherwise create a simple linear chain
let loadedEdges: RawDagEdge[] | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const edgesJson = require("./octapharma_edges.json") as RawDagEdge[];
  if (Array.isArray(edgesJson)) {
    loadedEdges = edgesJson;
  }
} catch {
  loadedEdges = null;
}

const fallbackEdges: RawDagEdge[] =
  loadedEdges ??
  rawNodes.slice(0, -1).map((node, idx) => {
    const next = rawNodes[idx + 1];
    return {
      id: `e-${node.id}-${next.id}`,
      source: node.id,
      target: next.id,
      type: "default",
    };
  });

// De-duplicate edges by (source,target)
const seenPairs = new Set<string>();
const dedupedRawEdges: RawDagEdge[] = [];
for (const e of fallbackEdges) {
  const key = `${e.source}→${e.target}`;
  if (seenPairs.has(key)) continue;
  seenPairs.add(key);
  dedupedRawEdges.push(e);
}

export const initialEdges: Edge[] = dedupedRawEdges.map((e) => {
  const edge: Edge = {
    id: e.id ?? `e-${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    type: e.type ?? "default",
  };
  // Preserve sourceHandle and targetHandle if they exist in the raw edge
  if ("sourceHandle" in e && e.sourceHandle) {
    edge.sourceHandle = e.sourceHandle as string;
  }
  if ("targetHandle" in e && e.targetHandle) {
    edge.targetHandle = e.targetHandle as string;
  }
  // Preserve other edge properties like style, markerEnd, animated, etc.
  if ("style" in e && e.style) {
    // Ensure style properties are properly formatted
    const styleObj = e.style as Record<string, unknown>;
    edge.style = {
      ...styleObj,
      // Ensure strokeDasharray is a string if present
      strokeDasharray: styleObj.strokeDasharray ? String(styleObj.strokeDasharray) : undefined,
    } as Edge["style"];
  }
  if ("markerEnd" in e && e.markerEnd) {
    edge.markerEnd = e.markerEnd as Edge["markerEnd"];
  }
  if ("animated" in e && typeof e.animated === "boolean") {
    edge.animated = e.animated;
  }
  return edge;
});

// Build dependency map from edges
const dependencyMap: Record<string, Set<string>> = {};
initialEdges.forEach((e) => {
  if (!dependencyMap[e.target]) dependencyMap[e.target] = new Set<string>();
  dependencyMap[e.target].add(e.source);
});

// Helper function to check if there's a path from source to target (for cycle detection)
function hasPath(source: string, target: string, visited: Set<string> = new Set()): boolean {
  if (source === target) return true;
  if (visited.has(source)) return false;
  visited.add(source);
  
  const outgoing = initialEdges.filter(e => e.source === source);
  for (const edge of outgoing) {
    if (hasPath(edge.target, target, visited)) return true;
  }
  return false;
}

// Build blocking dependencies (exclude loop-back edges that create cycles)
const blockingDependencyMap: Record<string, Set<string>> = {};
initialEdges.forEach((e) => {
  // Only include as blocking dependency if target doesn't have a path back to source (no cycle)
  // This allows forward flow while ignoring feedback loops
  if (!hasPath(e.target, e.source)) {
    if (!blockingDependencyMap[e.target]) blockingDependencyMap[e.target] = new Set<string>();
    blockingDependencyMap[e.target].add(e.source);
  }
});

// Debug: Log dependency map for MSAT nodes
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("[DAG Data] MSAT3 all dependencies:", Array.from(dependencyMap["MSAT3"] ?? []));
  console.log("[DAG Data] MSAT3 blocking dependencies:", Array.from(blockingDependencyMap["MSAT3"] ?? []));
  console.log("[DAG Data] MSAT2 dependencies:", Array.from(dependencyMap["MSAT2"] ?? []));
  console.log("[DAG Data] Edge MSAT2->MSAT3 exists:", initialEdges.some(e => e.source === "MSAT2" && e.target === "MSAT3"));
}

export const getNodeDependencies = (nodeId: string): string[] => {
  // Use blocking dependencies (excludes cycle-creating loop-backs)
  return Array.from(blockingDependencyMap[nodeId] ?? []);
};

// Compute layered layout from dependencies for nodes without explicit positions
function computeLayeredLayout(nodes: Node[], edges: Edge[]) {
  // Build adjacency and indegree
  const nodeIds = new Set(nodes.map((n) => n.id));
  const indegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};
  nodeIds.forEach((id) => {
    indegree[id] = 0;
    adj[id] = [];
  });
  edges.forEach((e) => {
    if (nodeIds.has(e.source) && nodeIds.has(e.target)) {
      adj[e.source].push(e.target);
      indegree[e.target] += 1;
    }
  });

  // Kahn's algorithm to assign levels
  const queue: string[] = [];
  Object.keys(indegree).forEach((id) => {
    if (indegree[id] === 0) queue.push(id);
  });
  const level: Record<string, number> = {};
  queue.forEach((id) => (level[id] = 0));
  while (queue.length > 0) {
    const u = queue.shift() as string;
    const uLevel = level[u] ?? 0;
    for (const v of adj[u]) {
      if (level[v] === undefined || level[v] < uLevel + 1) {
        level[v] = uLevel + 1;
      }
      indegree[v] -= 1;
      if (indegree[v] === 0) queue.push(v);
    }
  }

  // Group by level
  const levelToNodes: Record<number, string[]> = {};
  Object.keys(level).forEach((id) => {
    const lv = level[id] ?? 0;
    if (!levelToNodes[lv]) levelToNodes[lv] = [];
    levelToNodes[lv].push(id);
  });
  // Handle any nodes that weren't visited (cycles or disconnected)
  nodes.forEach((n) => {
    if (level[n.id] === undefined) {
      const lv = 0;
      if (!levelToNodes[lv]) levelToNodes[lv] = [];
      levelToNodes[lv].push(n.id);
      level[n.id] = lv;
    }
  });

  // Assign positions per level for nodes without explicit positions
  const xSpacing = 500;
  const ySpacing = 250;
  const positioned: Record<string, { x: number; y: number }> = {};
  Object.keys(levelToNodes)
    .map((k) => Number(k))
    .sort((a, b) => a - b)
    .forEach((lv) => {
      const ids = levelToNodes[lv];
      ids.forEach((id, idx) => {
        positioned[id] = { x: lv * xSpacing, y: idx * ySpacing };
      });
    });

  return positioned;
}

// Build initial nodes with positions:
// - If a node has explicit position in JSON, keep it
// - Else, if we have edges, use layered layout
// - Else, fall back to grid
const explicitPositionIds = new Set(
  rawNodes.filter((n) => n.position).map((n) => n.id)
);

// Build a minimal node list for computing layered layout (ids/types only)
const nodesForLayout: Node[] = rawNodes.map((n, i) => ({
  id: n.id,
  type: (n.type as Node["type"]) || "custom",
  position: n.position ?? gridPosition(i),
  data: {},
}));

const layeredPositions =
  initialEdges.length > 0 ? computeLayeredLayout(nodesForLayout, initialEdges) : {};

// Base nodes - will be filtered by workflow type
const baseNodes: Node[] = rawNodes.map((n, i) => {
  const keptPosition = n.position;
  const layered = layeredPositions[n.id];
  const position =
    keptPosition ??
    layered ??
    gridPosition(i);
  return {
    id: n.id,
    type: (n.type as Node["type"]) || "custom",
    position,
    data: {
      ...n.data,
      showLabel: false,
      },
  };
});

// Function to get filtered nodes based on workflow type
export function getNodesForWorkflow(workflow: WorkflowType = "all"): Node[] {
  return baseNodes.filter((node) => nodeBelongsToWorkflow(node.id, workflow));
}

// Function to get filtered edges based on workflow type
export function getEdgesForWorkflow(workflow: WorkflowType = "all"): Edge[] {
  const filteredNodeIds = new Set(
    baseNodes
      .filter((node) => nodeBelongsToWorkflow(node.id, workflow))
      .map((node) => node.id)
  );
  
  return initialEdges.filter(
    (edge) =>
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );
}

// Function to get dependencies for a workflow
export function getDependenciesForWorkflow(
  nodeId: string,
  workflow: WorkflowType = "all"
): string[] {
  const deps = getNodeDependencies(nodeId);
  const filteredNodeIds = new Set(
    baseNodes
      .filter((node) => nodeBelongsToWorkflow(node.id, workflow))
      .map((node) => node.id)
  );
  
  const filteredDeps = deps.filter((dep) => filteredNodeIds.has(dep));
  
  // Debug logging
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    if (nodeId === "MSAT3" || nodeId.startsWith("MSAT")) {
      console.log(`[DAG Data] getDependenciesForWorkflow(${nodeId}, ${workflow}):`, {
        allDeps: deps,
        filteredNodeIds: Array.from(filteredNodeIds),
        filteredDeps: filteredDeps,
      });
    }
  }
  
  return filteredDeps;
}

// Default export for backward compatibility (shows all nodes)
export const initialNodes: Node[] = baseNodes;