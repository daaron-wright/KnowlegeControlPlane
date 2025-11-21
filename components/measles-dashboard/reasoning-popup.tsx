import React, { useState } from "react";
import { HelpCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

// CSS for blinking cursor
const blinkStyles = `
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  .blink {
    animation: blink 1s infinite;
  }
`;

interface ReasoningPopupProps {
  provider: "gatik" | "nvidia" | "applied-intuition";
}

interface ReasoningLogData {
  title: string;
  color: string;
  sections: {
    intent: string;
    agentCollaboration: string[];
    apiInteractions: string[];
    mcpActions?: string[];
    dataFusion: string[];
    modelSelection?: string;
    outputLogic: string[];
    note: string;
  };
  technicalDetails: {
    apiQueries: { endpoint: string; query: string }[];
    dataFusionCode: string;
    outputCode?: string;
  };
}

const reasoningData: Record<string, ReasoningLogData> = {
  gatik: {
    title: "🚛 Gatik – Driving Intelligence",
    color: "border-l-blue-500",
    sections: {
      intent: "Show today's autonomous truck performance.",
      agentCollaboration: [
        "Activated mobility intelligence agent (A2A: driving_agent).",
        "Queried Gatik's performance logs via authenticated API (via MCP token exchange)."
      ],
      apiInteractions: [
        "/gatik/api/v2/drivemetrics/today",
        "/gatik/api/v2/eventstream for abnormal route events"
      ],
      dataFusion: [
        "Combined GPS logs, driving behavior patterns, and sensor health diagnostics."
      ],
      modelSelection: "Used real-time route deviation model + custom LLM prompt tuned on transportation analytics.",
      outputLogic: [
        "Filtered for trips with >90% autonomy engagement.",
        "Annotated with Omnis reasoning score on confidence thresholds."
      ],
      note: "Chose Gatik over other providers due to domain specialization and richer route-level data granularity."
    },
    technicalDetails: {
      apiQueries: [
        {
          endpoint: "/gatik/api/v2/drivemetrics/today",
          query: `SELECT 
  vehicle_id,
  autonomous_miles,
  disengagements,
  object_detection_accuracy,
  energy_efficiency_wh_km
FROM gatik_metrics 
WHERE date = CURRENT_DATE 
  AND autonomous_engagement > 0.9
ORDER BY autonomous_miles DESC;`
        },
        {
          endpoint: "/gatik/api/v2/eventstream",
          query: `SELECT 
  event_timestamp,
  event_type,
  latitude,
  longitude,
  severity_level
FROM route_events 
WHERE event_type IN ('disengagement', 'anomaly')
  AND event_timestamp >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY event_timestamp DESC;`
        }
      ],
      dataFusionCode: `// Data fusion pipeline
const fusedData = await Promise.all([
  gpsLogger.getTodayLogs(),
  behaviorAnalyzer.getPatterns(),
  sensorDiagnostics.getHealthStatus()
]);

return {
  routes: fusedData[0],
  patterns: fusedData[1],
  health: fusedData[2]
};`,
      outputCode: `// Filter high-autonomy trips
return trips.filter(trip => 
  trip.autonomy_engagement > 0.9 &&
  trip.confidence_score >= omnis.thresholds.gatik
);`
    }
  },
  nvidia: {
    title: "🟩 NVIDIA – System Performance",
    color: "border-l-green-500",
    sections: {
      intent: "Performance context linked to edge compute + onboard systems.",
      agentCollaboration: [
        "A2A: nvidia_perf_agent + inference metrics profiler."
      ],
      apiInteractions: [
        "/nvidia/telemetry/v1/device-telemetry",
        "/nvidia/jetson/health"
      ],
      mcpActions: [
        "Pulled daily usage stats from MCP cache.",
        "Validated against NVIDIA schema from registry v3."
      ],
      dataFusion: [
        "GPU temperature, CPU throttle events, RAM bottlenecks, and inference throughput."
      ],
      outputLogic: [
        "Anomalies detected where frame latency > 40ms on mid-latency edge stack.",
        "Generated performance fingerprint by vehicle ID."
      ],
      note: "NVIDIA selected for hardware-level telemetry; fallback agent was AWS Panorama but excluded due to lower signal resolution."
    },
    technicalDetails: {
      apiQueries: [
        {
          endpoint: "/nvidia/telemetry/v1/device-telemetry",
          query: `SELECT 
  device_id,
  gpu_temp_celsius,
  gpu_utilization_percent,
  memory_usage_mb,
  thermal_alerts
FROM nvidia_telemetry 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
  AND device_status = 'active'
ORDER BY timestamp DESC;`
        }
      ],
      dataFusionCode: `// NVIDIA performance fusion
const metrics = await Promise.all([
  gpuMonitor.getTemperature(),
  cpuThrottle.getEvents(),
  memoryAnalyzer.getBottlenecks(),
  inferenceProfiler.getThroughput()
]);

return {
  thermal: metrics[0],
  throttling: metrics[1], 
  memory: metrics[2],
  inference: metrics[3]
};`
    }
  },
  "applied-intuition": {
    title: "🟦 Applied Intuition – Simulation & Validation",
    color: "border-l-purple-500",
    sections: {
      intent: "Simulation & validation inferred as pre-deployment scenario testing.",
      agentCollaboration: [
        "A2A: sim_validation_agent triggered scenario coverage agent."
      ],
      apiInteractions: [
        "/applied/scenario_coverage/v4",
        "/applied/validation_matrix/last_run"
      ],
      mcpActions: [
        "Retrieved vehicle configuration from MCP (autonomy level: L4).",
        "Compared real-world data from Gatik to simulation runs (matching vehicle ID and timestamp)."
      ],
      dataFusion: [
        "Simulation results vs real-world event stream.",
        "Metrics: pass/fail rate, edge case detection, re-simulation confidence levels."
      ],
      outputLogic: [
        "Filtered down to scenarios with 3+ re-runs in past 24h.",
        "Added confidence heatmap and cross-validation notes."
      ],
      note: "Applied Intuition preferred for breadth of scenario templates and robust API compatibility with Omnis DAG ingestion layer."
    },
    technicalDetails: {
      apiQueries: [
        {
          endpoint: "/applied/scenario_coverage/v4",
          query: `SELECT 
  scenario_type,
  build_version,
  pass_rate,
  execution_count,
  last_run_timestamp
FROM simulation_results 
WHERE execution_count >= 3
  AND last_run_timestamp >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY pass_rate ASC;`
        }
      ],
      dataFusionCode: `// Simulation vs Reality fusion
const comparison = await Promise.all([
  simulationEngine.getResults(),
  realWorldStream.getEvents(),
  vehicleConfig.getSpecs()
]);

return {
  simResults: comparison[0],
  realEvents: comparison[1],
  config: comparison[2],
  crossValidation: correlateEvents(comparison[0], comparison[1])
};`,
      outputCode: `// Filter recent re-runs
return scenarios.filter(scenario => 
  scenario.rerun_count >= 3 &&
  scenario.last_24h === true
).map(s => addConfidenceHeatmap(s));`
    }
  }
};

export function ReasoningPopup({ provider }: ReasoningPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const data = reasoningData[provider];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <>
      {/* Inject CSS */}
      <style dangerouslySetInnerHTML={{ __html: blinkStyles }} />
      
      {/* Help Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="View Omnis reasoning process"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {/* Popup Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogTitle className="sr-only">Omnis Reasoning Process</DialogTitle>
          
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div>
                <h2 className="text-lg font-mono text-slate-100 tracking-wide">OMNIS REASONING ENGINE</h2>
                <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">Query Processing Pipeline</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-600"></div>
              
              <div className="space-y-6">
                {/* Intent */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest mb-2">01 // INTENT_PARSED</h4>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3">
                      <p className="text-slate-300 text-sm font-mono">"{data.sections.intent}"</p>
                    </div>
                  </div>
                </div>

                {/* Agent Collaboration */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest">02 // AGENT_COLLABORATION</h4>
                      <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded text-xs">
                        <div className="flex gap-0.5">
                          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                        </div>
                        <span className="font-mono text-slate-300 text-xs">A2A</span>
                      </div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
                      {data.sections.agentCollaboration.map((item, index) => (
                        <div key={index} className="flex items-start text-sm">
                          <span className="text-slate-500 mr-3 font-mono">[{String(index + 1).padStart(2, '0')}]</span>
                          <span className="text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* API Interactions */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest">03 // API_INTERACTIONS</h4>
                      <button
                        onClick={() => toggleSection('api')}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {expandedSections.api ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
                      {data.sections.apiInteractions.map((api, index) => (
                        <div key={index} className="font-mono text-xs bg-slate-900 border border-slate-600 px-3 py-2 rounded">
                          <span className="text-emerald-400">GET</span>{' '}
                          <span className="text-slate-300">{api}</span>{' '}
                          <span className="text-emerald-400 ml-2">[200]</span>
                        </div>
                      ))}
                      
                      {/* Expandable SQL Queries */}
                      {expandedSections.api && (
                        <div className="mt-3 space-y-3">
                          <div className="text-xs text-slate-400 font-mono uppercase tracking-wide border-t border-slate-600 pt-3">
                            Generated Queries:
                          </div>
                          {data.technicalDetails.apiQueries.map((query, index) => (
                            <div key={index} className="space-y-2">
                              <div className="text-xs text-slate-400 font-mono">{query.endpoint}</div>
                              <div className="bg-slate-900 border border-slate-600 rounded p-3">
                                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
                                  {query.query}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* MCP Actions */}
                {data.sections.mcpActions && (
                  <div className="relative flex items-start">
                    <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                    <div className="ml-10">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest">04 // MCP_OPERATIONS</h4>
                        <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded text-xs">
                          <div className="flex items-center gap-0.5">
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                            <div className="w-2 h-px bg-slate-300"></div>
                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                            <div className="w-2 h-px bg-slate-300"></div>
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                          </div>
                          <span className="font-mono text-slate-300 text-xs">MCP</span>
                        </div>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
                        {data.sections.mcpActions.map((action, index) => (
                          <div key={index} className="flex items-start text-sm">
                            <span className="text-slate-500 mr-3 font-mono">[{String(index + 1).padStart(2, '0')}]</span>
                            <span className="text-slate-300">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Fusion */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest">{data.sections.mcpActions ? '05' : '04'} // DATA_FUSION</h4>
                      <button
                        onClick={() => toggleSection('fusion')}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {expandedSections.fusion ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
                      {data.sections.dataFusion.map((item, index) => (
                        <div key={index} className="flex items-start text-sm">
                          <span className="text-slate-500 mr-3 font-mono">[{String(index + 1).padStart(2, '0')}]</span>
                          <span className="text-slate-300">{item}</span>
                        </div>
                      ))}
                      
                      {/* Expandable Fusion Code */}
                      {expandedSections.fusion && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs text-slate-400 font-mono uppercase tracking-wide border-t border-slate-600 pt-3">
                            Fusion Pipeline Code:
                          </div>
                          <div className="bg-slate-900 border border-slate-600 rounded p-3">
                            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
                              {data.technicalDetails.dataFusionCode}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Model Selection */}
                {data.sections.modelSelection && (
                  <div className="relative flex items-start">
                    <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                    <div className="ml-10">
                      <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest mb-2">{data.sections.mcpActions ? '06' : '05'} // MODEL_SELECTION</h4>
                      <div className="bg-slate-800 border border-slate-700 rounded p-3">
                        <p className="text-slate-300 text-sm">{data.sections.modelSelection}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Output Logic */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest">{data.sections.modelSelection ? (data.sections.mcpActions ? '07' : '06') : (data.sections.mcpActions ? '06' : '05')} // OUTPUT_LOGIC</h4>
                      {data.technicalDetails.outputCode && (
                        <button
                          onClick={() => toggleSection('output')}
                          className="text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {expandedSections.output ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
                      {data.sections.outputLogic.map((logic, index) => (
                        <div key={index} className="flex items-start text-sm">
                          <span className="text-slate-500 mr-3 font-mono">[{String(index + 1).padStart(2, '0')}]</span>
                          <span className="text-slate-300">{logic}</span>
                        </div>
                      ))}
                      
                      {/* Expandable Output Code */}
                      {expandedSections.output && data.technicalDetails.outputCode && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs text-slate-400 font-mono uppercase tracking-wide border-t border-slate-600 pt-3">
                            Output Processing Code:
                          </div>
                          <div className="bg-slate-900 border border-slate-600 rounded p-3">
                            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
                              {data.technicalDetails.outputCode}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Final result */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest mb-2">{data.sections.modelSelection ? (data.sections.mcpActions ? '08' : '07') : (data.sections.mcpActions ? '07' : '06')} // RESULT_GENERATED</h4>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3">
                      <p className="text-slate-300 text-sm font-mono">Dashboard data successfully processed and displayed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-slate-800 border border-slate-700 rounded p-4">
              <div className="flex items-start">
                <div className="w-3 h-3 bg-slate-400 rounded-full mr-3 mt-1"></div>
                <div>
                  <h5 className="font-mono text-slate-200 text-xs uppercase tracking-widest mb-2">SYSTEM_ANALYSIS</h5>
                  <p className="text-slate-300 text-sm font-mono">{data.sections.note}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                OMNIS.AI.ENGINE.v2.4.1 • REAL_TIME_INTEL_PIPELINE
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 