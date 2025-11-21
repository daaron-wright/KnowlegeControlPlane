/**
 * Mock Letta Client - Provides mock responses without requiring a real Letta server
 */

/**
 * Custom error class for Mock Letta API errors
 */
export class MockLettaError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "MockLettaError";
  }
}

// Mock agent data
const MOCK_AGENTS = [
  {
    id: "mock-agent-id",
    name: "Demo Assistant",
    description: "A mock agent for demonstration purposes",
    created_at: new Date().toISOString(),
  }
];

/**
 * Mock Letta client implementation
 */
export const mockLettaClient = {
  agents: {
    create: async (config: any) => {
      console.log("Creating mock agent with config:", config);
      return { id: "mock-agent-id", ...config };
    },
    list: async () => {
      console.log("Listing mock agents");
      return MOCK_AGENTS;
    },
    get: async (agentId: string) => {
      console.log("Getting mock agent:", agentId);
      return MOCK_AGENTS.find(agent => agent.id === agentId) || MOCK_AGENTS[0];
    },
    messages: {
      create: async (agentId: string, message: any) => {
        console.log("Creating mock message for agent:", agentId, message);
        return { 
          messages: [
            {
              id: `msg-${Date.now()}`,
              role: "assistant",
              content: generateMockResponse(message.content || message.message || ""),
              timestamp: new Date().toISOString(),
            }
          ]
        };
      },
      list: async (agentId: string) => {
        console.log("Listing mock messages for agent:", agentId);
        return [];
      },
    },
    resetMessages: async (agentId: string) => {
      console.log("Resetting mock messages for agent:", agentId);
      return { success: true };
    },
  },
};

/**
 * Check if the mock server is available (always returns true)
 */
export const checkMockServerStatus = async (): Promise<boolean> => {
  return true;
};

/**
 * Generate mock response based on user input
 */
function generateMockResponse(userMessage: string): string {
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
}

/**
 * Send a message to the mock agent
 */
export async function sendMockMessageWithSDK(
  agentId: string,
  message: string
): Promise<any> {
  console.log("Sending mock message:", { agentId, message });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  const response = generateMockResponse(message);
  
  return {
    messages: [
      {
        id: `msg-${Date.now()}`,
        role: "assistant", 
        content: response,
        timestamp: new Date().toISOString(),
      }
    ]
  };
}

/**
 * Check if the mock agent exists (always returns true for demo)
 */
export async function checkMockAgentExists(agentId: string): Promise<boolean> {
  console.log("Checking if mock agent exists:", agentId);
  return true;
}

/**
 * Create a mock response when needed
 */
export function createMockResponse(userMessage: string) {
  return {
    messages: [
      {
        id: `mock-msg-${Date.now()}`,
        role: "assistant",
        content: generateMockResponse(userMessage),
        timestamp: new Date().toISOString(),
      }
    ]
  };
}

// Export the mock client as the default export
export default mockLettaClient;
