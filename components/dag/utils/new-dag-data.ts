// DAG for: "Show today's autonomous truck performance with insights from Gatik, NVIDIA, and Applied Intuition."

import type { Edge, Node } from "reactflow";

const colors = {
  intent: "#2c5282",
  data: "#285e61",
  processing: "#2b6cb0",
  visualization: "#7b341e",
  analysis: "#805ad5",
  output: "#744210",
  completion: "#1a202c",
  gatik: "#4a5568",
  nvidia: "#38b2ac",
  applied: "#718096",
};

const createNodePosition = (x: number, y: number) => {
  const jitterX = Math.random() * 10 - 5;
  const jitterY = Math.random() * 10 - 5;
  return { x: x + jitterX, y: y + jitterY };
};

export const initialNodes: Node[] = [
  {
    id: "Q0",
    type: "custom",
    position: createNodePosition(100, 500),
    data: {
      label: "Parse User Prompt",
      color: colors.intent,
      description: "Extract source systems, timeframe, KPIs from query.",
      details: [
        "Tool: nlu.parse",
        "Async: false",
        "Outputs: intent_schema, key_phrases",
      ],
      metrics: {
        Priority: "high",
        Retries: "3",
      },
      processingTime: 2,
      processingState: "idle",
    },
  },
  {
    id: "D1",
    type: "custom",
    position: createNodePosition(600, 100),
    data: {
      label: "Extract Gatik Logs",
      color: colors.gatik,
      description: "Pull latest telemetry, event logs, and driving data.",
      details: [
        "Tool: gatik.fetch_telemetry",
        "Sources: Gatik Cloud API",
        "Window: P1D",
        "Async: true",
      ],
      metrics: {
        DataSource: "Gatik API",
        Output: "driving_metrics",
      },
      processingTime: 4,
      processingState: "idle",
    },
  },
  {
    id: "D2",
    type: "custom",
    position: createNodePosition(600, 500),
    data: {
      label: "Extract NVIDIA Metrics",
      color: colors.nvidia,
      description: "Retrieve compute, thermal, and uptime logs.",
      details: [
        "Tool: nvidia.fetch_metrics",
        "Sources: NVIDIA Drive Platform",
        "Window: P1D",
        "Async: true",
      ],
      metrics: {
        DataSource: "NVIDIA Drive",
        Output: "compute_stats",
      },
      processingTime: 3,
      processingState: "idle",
    },
  },
  {
    id: "D3",
    type: "custom",
    position: createNodePosition(600, 900),
    data: {
      label: "Extract Simulation Results",
      color: colors.applied,
      description: "Fetch Applied Intuition scenario outcomes and build status.",
      details: [
        "Tool: applied.fetch_simulations",
        "Sources: Applied Intuition Platform",
        "Window: P1D",
        "Async: true",
      ],
      metrics: {
        DataSource: "Applied Intuition",
        Output: "scenario_results",
      },
      processingTime: 5,
      processingState: "idle",
    },
  },
  {
    id: "P1",
    type: "custom",
    position: createNodePosition(1000, 100),
    data: {
      label: "Analyze Gatik Driving KPIs",
      color: colors.processing,
      description: "Compute miles/disengagement, override rate, detection scores.",
      details: [
        "Tool: analytics.process_driving_data",
        "Depends on: D1",
        "Outputs: kpi_summary, performance_trends",
      ],
      metrics: {
        Priority: "medium",
        ProcessingType: "Real-time",
      },
      processingTime: 6,
      processingState: "idle",
    },
  },
  {
    id: "P2",
    type: "custom",
    position: createNodePosition(1000, 500),
    data: {
      label: "Analyze NVIDIA Platform Health",
      color: colors.processing,
      description: "Evaluate compute load, overheating, and failure signals.",
      details: [
        "Tool: analytics.process_hardware_data",
        "Depends on: D2",
        "Outputs: health_score, anomaly_alerts",
      ],
      metrics: {
        Priority: "medium",
        ProcessingType: "Batch",
      },
      processingTime: 4,
      processingState: "idle",
    },
  },
  {
    id: "P3",
    type: "custom",
    position: createNodePosition(1000, 900),
    data: {
      label: "Analyze Simulation Safety Coverage",
      color: colors.processing,
      description: "Pass/fail by scenario class, detect regressions.",
      details: [
        "Tool: analytics.process_simulation_data",
        "Depends on: D3",
        "Outputs: safety_metrics, regression_flags",
      ],
      metrics: {
        Priority: "medium",
        ProcessingType: "Batch",
      },
      processingTime: 7,
      processingState: "idle",
    },
  },
  {
    id: "A1",
    type: "custom",
    position: createNodePosition(1300, 200),
    data: {
      label: "Generate Anomaly Map",
      color: colors.analysis,
      description: "Plot disengagements and system faults on interactive map.",
      details: [
        "Tool: geo.plot_anomalies",
        "Depends on: P1, P2",
        "Outputs: anomaly_map_url, hotspot_coords",
      ],
      metrics: {
        Priority: "high",
        OutputFormat: "Interactive Map",
      },
      processingTime: 5,
      processingState: "idle",
    },
  },
  {
    id: "A2",
    type: "custom",
    position: createNodePosition(1300, 800),
    data: {
      label: "Generate Simulation Timeline",
      color: colors.analysis,
      description: "Compare scenario replays and flag inconsistent outputs.",
      details: [
        "Tool: simulation.timeline_analysis",
        "Depends on: P3",
        "Outputs: timeline_viz, consistency_report",
      ],
      metrics: {
        Priority: "medium",
        OutputFormat: "Timeline",
      },
      processingTime: 6,
      processingState: "idle",
    },
  },
  {
    id: "V1",
    type: "custom",
    position: createNodePosition(1600, 500),
    data: {
      label: "Generate Unified Dashboard",
      color: colors.visualization,
      description: "Merge all partner insights into an interactive dashboard.",
      details: [
        "Tool: dashboard.generate",
        "Depends on: A1, A2",
        "Outputs: dashboard_url, summary_report",
      ],
      metrics: {
        Priority: "high",
        OutputFormat: "Interactive",
      },
      processingTime: 8,
      processingState: "idle",
    },
  },
  {
    id: "O1",
    type: "custom",
    position: createNodePosition(1900, 500),
    data: {
      label: "Send Summary to Execs",
      color: colors.output,
      description: "Email PDF + Slack digest to stakeholders.",
      details: [
        "Tool: notification.send_executive_summary",
        "Depends on: V1",
        "Outputs: email_confirmation, slack_thread_id",
      ],
      metrics: {
        Priority: "high",
        Recipients: "Executive Team",
      },
      processingTime: 3,
      processingState: "idle",
    },
  },
  {
    id: "COMPLETE",
    type: "custom",
    position: createNodePosition(2300, 500),
    data: {
      label: "DAG Complete",
      color: colors.completion,
      description: "Log delivery and archive artifacts.",
      details: [
        "Tool: system.complete_workflow",
        "Depends on: O1",
        "Outputs: completion_log, archived_artifacts",
        "Notify: Fleet_Operations_Team, Executive_Team",
      ],
      metrics: {
        Type: "on_complete",
        Priority: "high",
      },
      processingTime: 2,
      processingState: "idle",
    },
  },
];

export const initialEdges: Edge[] = [
  { 
    id: "e-q0-d1", 
    source: "Q0", 
    target: "D1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-q0-d2", 
    source: "Q0", 
    target: "D2",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-q0-d3", 
    source: "Q0", 
    target: "D3",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },

  { 
    id: "e-d1-p1", 
    source: "D1", 
    target: "P1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d2-p2", 
    source: "D2", 
    target: "P2",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d3-p3", 
    source: "D3", 
    target: "P3",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },

  { 
    id: "e-p1-a1", 
    source: "P1", 
    target: "A1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-p2-a1", 
    source: "P2", 
    target: "A1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-p3-a2", 
    source: "P3", 
    target: "A2",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },

  { 
    id: "e-a1-v1", 
    source: "A1", 
    target: "V1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a2-v1", 
    source: "A2", 
    target: "V1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },

  { 
    id: "e-v1-o1", 
    source: "V1", 
    target: "O1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-o1-complete", 
    source: "O1", 
    target: "COMPLETE",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
];

// Function to get node dependencies
export const getNodeDependencies = (nodeId: string): string[] => {
  return initialEdges
    .filter((edge) => edge.target === nodeId)
    .map((edge) => edge.source);
};

// Function to get dependent nodes
export const getDependentNodes = (nodeId: string): string[] => {
  return initialEdges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => edge.target);
};
