// DAG for: "What's the best way to increase attach rate for Back-to-School customers like Emily, while reducing WISMO contact volume over the next 4 weeks?"

import type { Edge, Node } from "reactflow";

const colors = {
  intent: "#2c5282",
  customer: "#285e61",
  data_cloud: "#2b6cb0",
  data_onprem: "#4a5568",
  analysis: "#805ad5",
  ml_model: "#7b341e",
  optimization: "#744210",
  creative: "#38b2ac",
  visualization: "#7b341e",
  notification: "#1a202c",
  completion: "#1a202c",
  salesforce: "#00a1e0",
  adobe: "#ff0000",
  zendesk: "#03363d",
};

const createNodePosition = (x: number, y: number) => {
  const jitterX = Math.random() * 10 - 5;
  const jitterY = Math.random() * 10 - 5;
  return { x: x + jitterX, y: y + jitterY };
};

export const initialNodes: Node[] = [
  {
    id: "P1",
    type: "custom",
    position: createNodePosition(100, 600),
    data: {
      label: "Parse User Prompt",
      color: colors.intent,
      description: "Extract intent, customer segment, KPI targets, and timeframe.",
      details: [
        "Tool: omnis.intent_parser",
        "Priority: high",
        "Outputs: intent, entities, kpi_targets",
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
    id: "C1",
    type: "custom",
    position: createNodePosition(500, 400),
    data: {
      label: "Identify Customer Segment",
      color: colors.customer,
      description: "Classify Emily Johnson persona and segment characteristics.",
      details: [
        "Tool: tvg_ml.segment_classifier",
        "Input: Emily Johnson",
        "Output: persona_segment",
      ],
      metrics: {
        DataSource: "Customer ML Model",
        Output: "persona_segment",
      },
      processingTime: 3,
      processingState: "idle",
    },
  },
  {
    id: "D1",
    type: "custom",
    position: createNodePosition(900, 100),
    data: {
      label: "Fetch Salesforce CRM Data",
      color: colors.salesforce,
      description: "Pull customer profiles, purchase history, and preferences.",
      details: [
        "Tool: salesforce.fetch_customers",
        "Source: Salesforce Cloud",
        "Output: crm_profiles",
        "Async: true",
      ],
      metrics: {
        DataSource: "Salesforce Cloud",
        Output: "crm_profiles",
      },
      processingTime: 4,
      processingState: "idle",
    },
  },
  {
    id: "D2",
    type: "custom",
    position: createNodePosition(900, 400),
    data: {
      label: "Query Purchase History",
      color: colors.data_onprem,
      description: "Extract transaction data from on-premises data warehouse.",
      details: [
        "Tool: tvg_sql.query_transactions",
        "Source: TVG On-Prem Data Warehouse",
        "Output: transaction_data",
        "Window: P90D",
      ],
      metrics: {
        DataSource: "On-Prem DB",
        Output: "transaction_data",
      },
      processingTime: 5,
      processingState: "idle",
    },
  },
  {
    id: "D3",
    type: "custom",
    position: createNodePosition(900, 700),
    data: {
      label: "Extract Clickstream Data",
      color: colors.adobe,
      description: "Pull session logs, page views, and behavioral data.",
      details: [
        "Tool: adobe_analytics.fetch_events",
        "Source: Adobe Analytics Cloud",
        "Output: web_sessions",
        "Async: true",
      ],
      metrics: {
        DataSource: "Adobe Analytics",
        Output: "web_sessions",
      },
      processingTime: 4,
      processingState: "idle",
    },
  },
  {
    id: "D4",
    type: "custom",
    position: createNodePosition(900, 1000),
    data: {
      label: "Pull Service Contact Logs",
      color: colors.zendesk,
      description: "Extract customer service interactions and WISMO queries.",
      details: [
        "Tool: zendesk.fetch_contacts",
        "Source: Zendesk Cloud",
        "Output: service_contacts",
        "Window: P30D",
      ],
      metrics: {
        DataSource: "Zendesk Cloud",
        Output: "service_contacts",
      },
      processingTime: 3,
      processingState: "idle",
    },
  },
  {
    id: "A1",
    type: "custom",
    position: createNodePosition(1400, 200),
    data: {
      label: "Causal Inference on WISMO Drivers",
      color: colors.analysis,
      description: "Identify root causes of customer contact volume.",
      details: [
        "Tool: causalnex.estimate_effects",
        "Depends on: D2, D4",
        "Output: wismo_drivers",
      ],
      metrics: {
        Priority: "high",
        ProcessingType: "Causal Analysis",
      },
      processingTime: 8,
      processingState: "idle",
    },
  },
  {
    id: "A2",
    type: "custom",
    position: createNodePosition(1400, 500),
    data: {
      label: "Time Series Sales Forecast",
      color: colors.analysis,
      description: "Predict Back-to-School sales trends and peak periods.",
      details: [
        "Tool: prophet.sales_forecast",
        "Depends on: D2",
        "Output: sales_forecast",
      ],
      metrics: {
        Priority: "medium",
        ProcessingType: "Time Series",
      },
      processingTime: 6,
      processingState: "idle",
    },
  },
  {
    id: "A3",
    type: "custom",
    position: createNodePosition(1400, 800),
    data: {
      label: "A/B Test Bundle Simulations",
      color: colors.analysis,
      description: "Simulate cross-sell bundle performance and uplift.",
      details: [
        "Tool: optimizely.simulate",
        "Depends on: D2, D3",
        "Output: bundle_uplift_predictions",
      ],
      metrics: {
        Priority: "high",
        ProcessingType: "A/B Simulation",
      },
      processingTime: 7,
      processingState: "idle",
    },
  },
  {
    id: "A4",
    type: "custom",
    position: createNodePosition(1400, 1100),
    data: {
      label: "Real-Time Basket Gap Analysis",
      color: colors.ml_model,
      description: "Identify missing items in customer baskets in real-time.",
      details: [
        "Tool: tvg_ml.basket_gap_model",
        "Depends on: D3",
        "Output: gap_insights",
      ],
      metrics: {
        Priority: "high",
        ProcessingType: "Real-time ML",
      },
      processingTime: 5,
      processingState: "idle",
    },
  },
  {
    id: "A5",
    type: "custom",
    position: createNodePosition(1900, 300),
    data: {
      label: "Contact Deflection Impact",
      color: colors.ml_model,
      description: "Predict reduction in WISMO contacts from proactive updates.",
      details: [
        "Tool: omnis.simulate_deflection",
        "Depends on: A1, D4",
        "Output: contact_deflection_scenarios",
      ],
      metrics: {
        Priority: "high",
        ProcessingType: "Simulation",
      },
      processingTime: 6,
      processingState: "idle",
    },
  },
  {
    id: "A6",
    type: "custom",
    position: createNodePosition(1900, 600),
    data: {
      label: "Optimize Nudge Timing & Channel",
      color: colors.optimization,
      description: "Determine optimal timing and channels for cross-sell nudges.",
      details: [
        "Tool: tvg_ml.channel_optimizer",
        "Depends on: D1, D3",
        "Output: nudge_strategy",
      ],
      metrics: {
        Priority: "high",
        ProcessingType: "Optimization",
      },
      processingTime: 7,
      processingState: "idle",
    },
  },
  {
    id: "A7",
    type: "custom",
    position: createNodePosition(1900, 900),
    data: {
      label: "Generate Marketing Insights",
      color: colors.optimization,
      description: "Create targeting plan and campaign recommendations.",
      details: [
        "Tool: omnis.marketing_insights",
        "Depends on: A2, A3, A6",
        "Output: targeting_plan",
      ],
      metrics: {
        Priority: "medium",
        ProcessingType: "Insight Generation",
      },
      processingTime: 5,
      processingState: "idle",
    },
  },
  {
    id: "A8",
    type: "custom",
    position: createNodePosition(2400, 450),
    data: {
      label: "Create Brand Kit Variants",
      color: colors.creative,
      description: "Generate creative assets for A/B testing campaigns.",
      details: [
        "Tool: adcreative.generate_variants",
        "Depends on: A6",
        "Output: creative_assets",
      ],
      metrics: {
        Priority: "medium",
        ProcessingType: "Creative Generation",
      },
      processingTime: 4,
      processingState: "idle",
    },
  },
  {
    id: "V1",
    type: "custom",
    position: createNodePosition(2900, 600),
    data: {
      label: "Generate Unified Dashboard",
      color: colors.visualization,
      description: "Compile all insights into interactive dashboard.",
      details: [
        "Tool: omnis.dashboard.generate",
        "Depends on: A1, A2, A3, A4, A5, A6, A7, A8",
        "Output: dashboard_url, summary_pdf",
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
    id: "V2",
    type: "custom",
    position: createNodePosition(3400, 600),
    data: {
      label: "Send Summary to Stakeholders",
      color: colors.notification,
      description: "Distribute insights to CX, Marketing, and Product teams.",
      details: [
        "Tool: notification.send_summary",
        "Depends on: V1",
        "Recipients: Head of CX, Marketing, Digital Product",
      ],
      metrics: {
        Priority: "high",
        Recipients: "3 Teams",
      },
      processingTime: 3,
      processingState: "idle",
    },
  },
  {
    id: "COMPLETE",
    type: "custom",
    position: createNodePosition(3900, 600),
    data: {
      label: "DAG Complete",
      color: colors.completion,
      description: "Log completion and archive workflow artifacts.",
      details: [
        "Tool: system.complete_workflow",
        "Depends on: V2",
        "Output: completion_log",
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
  // Parse prompt connections
  { 
    id: "e-p1-c1", 
    source: "P1", 
    target: "C1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-p1-d1", 
    source: "P1", 
    target: "D1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-p1-d2", 
    source: "P1", 
    target: "D2",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-p1-d3", 
    source: "P1", 
    target: "D3",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-p1-d4", 
    source: "P1", 
    target: "D4",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },

  // Data to analysis connections
  { 
    id: "e-d2-a1", 
    source: "D2", 
    target: "A1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d4-a1", 
    source: "D4", 
    target: "A1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d2-a2", 
    source: "D2", 
    target: "A2",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d2-a3", 
    source: "D2", 
    target: "A3",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d3-a3", 
    source: "D3", 
    target: "A3",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d3-a4", 
    source: "D3", 
    target: "A4",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },

  // Analysis to advanced analysis connections
  { 
    id: "e-a1-a5", 
    source: "A1", 
    target: "A5",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d4-a5", 
    source: "D4", 
    target: "A5",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d1-a6", 
    source: "D1", 
    target: "A6",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-d3-a6", 
    source: "D3", 
    target: "A6",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a2-a7", 
    source: "A2", 
    target: "A7",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a3-a7", 
    source: "A3", 
    target: "A7",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a6-a7", 
    source: "A6", 
    target: "A7",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a6-a8", 
    source: "A6", 
    target: "A8",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },

  // All analysis to visualization
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
    id: "e-a3-v1", 
    source: "A3", 
    target: "V1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a4-v1", 
    source: "A4", 
    target: "V1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a5-v1", 
    source: "A5", 
    target: "V1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a6-v1", 
    source: "A6", 
    target: "V1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a7-v1", 
    source: "A7", 
    target: "V1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },
  { 
    id: "e-a8-v1", 
    source: "A8", 
    target: "V1",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },

  // Visualization to notification
  { 
    id: "e-v1-v2", 
    source: "V1", 
    target: "V2",
    animated: false,
    style: { stroke: "#718096", strokeWidth: 1.5, opacity: 0.7 },
  },

  // Notification to completion
  { 
    id: "e-v2-complete", 
    source: "V2", 
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