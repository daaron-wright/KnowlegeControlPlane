// DAG for: "Show me productivity and sustainability insights for the Isuzu pickup."

import type { Edge, Node } from "reactflow";

const colors = {
  intent: "#2c5282",
  data: "#285e61",
  processing: "#2b6cb0",
  visualization: "#7b341e",
  analysis: "#805ad5",
  output: "#744210",
  completion: "#1a202c",
  isuzu: "#d97706", // Orange for Isuzu branding
  production: "#059669", // Green for sustainability
  sustainability: "#16a34a", // Different green shade
  cloud: "#38b2ac", // Teal for cloud systems
  onprem: "#4a5568", // Gray for on-prem systems
  ml: "#9333ea", // Purple for ML/AI nodes
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
    position: createNodePosition(100, 800),
    data: {
      label: "Parse User Query",
      color: colors.intent,
      description: "Extract vehicle model, metrics, and analysis requirements.",
      details: [
        "Tool: nlu.parse_vehicle_query",
        "Async: false",
        "Outputs: vehicle_model, metrics_requested, analysis_scope",
      ],
      metrics: {
        Priority: "high",
        Retries: "3",
      },
      processingTime: 2,
      processingState: "idle",
    },
  },

  // Data Extraction Layer
  {
    id: "D1",
    type: "onprem",
    position: createNodePosition(800, 100),
    data: {
      label: "Extract MES Production Data",
      color: colors.onprem,
      description: "Pull real-time assembly line metrics from Manufacturing Execution System.",
      details: [
        "Tool: mes.fetch_production_metrics",
        "Sources: Isuzu MES (On-Prem)",
        "Window: Last 30 days",
        "Async: true",
      ],
      metrics: {
        DataSource: "MES On-Prem",
        Output: "production_metrics",
        RecordCount: "~2.3M records",
      },
      processingTime: 5,
      processingState: "idle",
    },
  },
  {
    id: "D2",
    type: "cloud",
    position: createNodePosition(800, 600),
    data: {
      label: "Extract ERP Financial Data",
      color: colors.cloud,
      description: "Retrieve cost, labor, and resource allocation data from cloud ERP.",
      details: [
        "Tool: erp.fetch_financial_metrics",
        "Sources: SAP Cloud ERP",
        "Window: Current quarter",
        "Async: true",
      ],
      metrics: {
        DataSource: "SAP Cloud",
        Output: "financial_metrics",
        RecordCount: "~850K records",
      },
      processingTime: 4,
      processingState: "idle",
    },
  },
  {
    id: "D3",
    type: "cloud",
    position: createNodePosition(800, 1100),
    data: {
      label: "Extract Car 3D Digital Twin",
      color: colors.cloud,
      description: "Access 3D vehicle model and simulation data from digital twin platform.",
      details: [
        "Tool: digitaltwin.fetch_3d_model_data",
        "Sources: Isuzu Digital Twin Platform (AWS)",
        "Window: Latest model iteration",
        "Async: true",
      ],
      metrics: {
        DataSource: "3D Twin Platform",
        Output: "digital_twin_data",
        ModelSize: "~1.2GB",
      },
      processingTime: 8,
      processingState: "idle",
    },
  },
  {
    id: "D5",
    type: "onprem",
    position: createNodePosition(800, 1600),
    data: {
      label: "Extract Environmental Data",
      color: colors.onprem,
      description: "Retrieve emissions, energy usage, and waste metrics from sensors.",
      details: [
        "Tool: ems.fetch_environmental_metrics",
        "Sources: Environmental Management System",
        "Window: Current quarter",
        "Async: true",
      ],
      metrics: {
        DataSource: "EMS On-Prem",
        Output: "environmental_metrics",
        CO2Reduction: "15%",
      },
      processingTime: 4,
      processingState: "idle",
    },
  },
  {
    id: "D6",
    type: "cloud",
    position: createNodePosition(800, 2100),
    data: {
      label: "Extract Supply Chain Data",
      color: colors.cloud,
      description: "Fetch supplier performance, logistics, and material costs.",
      details: [
        "Tool: scm.fetch_logistics_data",
        "Sources: Supply Chain Management (Cloud)",
        "Window: Last quarter",
        "Async: true",
      ],
      metrics: {
        DataSource: "SCM Cloud",
        Output: "supply_metrics",
        SupplierCount: "450+",
      },
      processingTime: 6,
      processingState: "idle",
    },
  },

  // Processing Layer
  {
    id: "P1",
    type: "custom",
    position: createNodePosition(1600, 350),
    data: {
      label: "Analyze Production Efficiency",
      color: colors.processing,
      description: "Calculate productivity KPIs, bottlenecks, and optimization opportunities.",
      details: [
        "Tool: analytics.process_production_data",
        "Depends on: D1",
        "Outputs: efficiency_score, bottleneck_analysis",
      ],
      metrics: {
        Priority: "high",
        ProcessingType: "Real-time",
        EfficiencyGain: "+12%",
      },
      processingTime: 8,
      processingState: "idle",
    },
  },
  {
    id: "P2",
    type: "custom",
    position: createNodePosition(1600, 850),
    data: {
      label: "Analyze Financial Performance",
      color: colors.processing,
      description: "Process cost efficiency, ROI, and budget allocation optimization.",
      details: [
        "Tool: analytics.process_financial_data",
        "Depends on: D2, D6",
        "Outputs: cost_analysis, roi_metrics, budget_optimization",
      ],
      metrics: {
        Priority: "high",
        ProcessingType: "Batch",
        CostReduction: "8%",
      },
      processingTime: 6,
      processingState: "idle",
    },
  },
  {
    id: "P3",
    type: "custom",
    position: createNodePosition(1600, 1350),
    data: {
      label: "Process Digital Twin Analysis",
      color: colors.ml,
      description: "Run ML simulations on 3D model for design optimization insights.",
      details: [
        "Tool: ml.process_digital_twin",
        "Depends on: D3",
        "Outputs: design_optimization, performance_predictions",
      ],
      metrics: {
        Priority: "medium",
        ProcessingType: "ML Pipeline",
        ModelAccuracy: "94.2%",
      },
      processingTime: 12,
      processingState: "idle",
    },
  },
  {
    id: "P4",
    type: "custom",
    position: createNodePosition(1600, 1850),
    data: {
      label: "Analyze Environmental Impact",
      color: colors.processing,
      description: "Evaluate carbon footprint, waste reduction, and sustainable materials.",
      details: [
        "Tool: analytics.process_sustainability_data",
        "Depends on: D5",
        "Outputs: carbon_metrics, waste_analysis, sustainability_score",
      ],
      metrics: {
        Priority: "high",
        ProcessingType: "Real-time",
        EmissionReduction: "18%",
      },
      processingTime: 5,
      processingState: "idle",
    },
  },

  // Analysis Layer
  {
    id: "A1",
    type: "custom",
    position: createNodePosition(2400, 600),
    data: {
      label: "Generate Production Insights",
      color: colors.analysis,
      description: "Combine production and financial data for comprehensive productivity analysis.",
      details: [
        "Tool: insights.generate_production_analysis",
        "Depends on: P1, P2",
        "Outputs: productivity_report, optimization_roadmap",
      ],
      metrics: {
        Priority: "high",
        OutputFormat: "Executive Report",
        ImprovementOpportunities: "23",
      },
      processingTime: 9,
      processingState: "idle",
    },
  },
  {
    id: "A2",
    type: "custom",
    position: createNodePosition(2400, 1600),
    data: {
      label: "Generate Sustainability Insights",
      color: colors.analysis,
      description: "Create environmental impact assessment and design optimization strategies.",
      details: [
        "Tool: insights.generate_sustainability_analysis",
        "Depends on: P3, P4",
        "Outputs: sustainability_report, green_initiatives",
      ],
      metrics: {
        Priority: "high",
        OutputFormat: "Sustainability Dashboard",
        CarbonReduction: "22%",
      },
      processingTime: 8,
      processingState: "idle",
    },
  },

  // Visualization Layer
  {
    id: "V1",
    type: "custom",
    position: createNodePosition(3200, 1100),
    data: {
      label: "Generate Integrated Dashboard",
      color: colors.visualization,
      description: "Combine all insights into unified executive dashboard with 3D visualization.",
      details: [
        "Tool: dashboard.generate_isuzu_insights",
        "Depends on: A1, A2",
        "Outputs: integrated_dashboard, executive_summary, 3d_models",
      ],
      metrics: {
        Priority: "high",
        OutputFormat: "Executive Dashboard",
        KPIs: "32 metrics",
      },
      processingTime: 10,
      processingState: "idle",
    },
  },

  // Output Layer
  {
    id: "O1",
    type: "custom",
    position: createNodePosition(4000, 1100),
    data: {
      label: "Deliver Insights Report",
      color: colors.output,
      description: "Send comprehensive report to manufacturing and sustainability teams.",
      details: [
        "Tool: reporting.send_insights_report",
        "Depends on: V1",
        "Outputs: email_confirmation, report_archive",
      ],
      metrics: {
        Priority: "high",
        Recipients: "Manufacturing & Sustainability Teams",
        ReportSize: "35 pages",
      },
      processingTime: 3,
      processingState: "idle",
    },
  },

  // Completion
  {
    id: "COMPLETE",
    type: "custom",
    position: createNodePosition(4800, 1100),
    data: {
      label: "DAG Complete",
      color: colors.completion,
      description: "Archive results and notify stakeholders of completion.",
      details: [
        "Tool: system.complete_isuzu_workflow",
        "Depends on: O1",
        "Outputs: completion_log, archived_insights",
        "Notify: Manufacturing_Team, Sustainability_Team, Executive_Team",
      ],
      metrics: {
        Type: "on_complete",
        Priority: "high",
        TotalProcessingTime: "3 minutes",
      },
      processingTime: 2,
      processingState: "idle",
    },
  },
];

export const initialEdges: Edge[] = [
  // Query to all data sources
  { id: "e-q0-d1", source: "Q0", target: "D1", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-q0-d2", source: "Q0", target: "D2", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-q0-d3", source: "Q0", target: "D3", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-q0-d5", source: "Q0", target: "D5", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-q0-d6", source: "Q0", target: "D6", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },

  // Data to Processing
  { id: "e-d1-p1", source: "D1", target: "P1", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-d2-p2", source: "D2", target: "P2", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-d6-p2", source: "D6", target: "P2", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-d3-p3", source: "D3", target: "P3", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-d5-p4", source: "D5", target: "P4", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },

  // Processing to Analysis
  { id: "e-p1-a1", source: "P1", target: "A1", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-p2-a1", source: "P2", target: "A1", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-p3-a2", source: "P3", target: "A2", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-p4-a2", source: "P4", target: "A2", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },

  // Analysis to Visualization
  { id: "e-a1-v1", source: "A1", target: "V1", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
  { id: "e-a2-v1", source: "A2", target: "V1", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },

  // Visualization to Output
  { id: "e-v1-o1", source: "V1", target: "O1", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },

  // Output to Completion
  { id: "e-o1-complete", source: "O1", target: "COMPLETE", animated: false, style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 } },
];

// Helper function to get node dependencies from edges
export const getNodeDependencies = (nodeId: string): string[] => {
  return initialEdges
    .filter(edge => edge.target === nodeId)
    .map(edge => edge.source);
}; 