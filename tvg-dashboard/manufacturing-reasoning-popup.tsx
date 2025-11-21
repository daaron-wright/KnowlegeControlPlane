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

interface ManufacturingReasoningPopupProps {
  className?: string;
}

export function ManufacturingReasoningPopup({ className }: ManufacturingReasoningPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`text-gray-400 hover:text-gray-600 transition-colors ${className}`}
        title="View Omnis reasoning process"
        type="button"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {/* Popup Dialog */}
      <Dialog 
        open={isOpen} 
        onOpenChange={setIsOpen}
        modal={true}
      >
        <DialogContent 
          className="max-w-4xl max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-700"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">Omnis Manufacturing Reasoning Process</DialogTitle>
          
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div>
                <h2 className="text-lg font-mono text-slate-100 tracking-wide">OMNIS REASONING ENGINE</h2>
                <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">Digital Twin Component Intelligence DAG</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                type="button"
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
                      <p className="text-slate-300 text-sm font-mono">"Show how to improve production and sustainability by component."</p>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Primary Entities: pickup truck, production, sustainability, component-level</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Triggered agents: digital_twin_loader, vision_locator, production_analyst, sustainability_agent, UX_overlay_generator</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Discovery */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest">02 // FILE_DISCOVERY & SELECTION</h4>
                      <button
                        onClick={() => toggleSection('discovery')}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {expandedSections.discovery ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Located 4 candidate GLB files</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Used Vision Agent (CLIP-based) to visually parse and match the file containing the full Isuzu pickup layout.</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-emerald-400 mr-3 font-mono">✅</span>
                        <span className="text-slate-300">Selected: /assets/digital_twin/isuzu_dmax_2025.glb</span>
                      </div>
                      
                      {/* Expandable Code */}
                      {expandedSections.discovery && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs text-slate-400 font-mono uppercase tracking-wide border-t border-slate-600 pt-3">
                            Discovery Code:
                          </div>
                          <div className="bg-slate-900 border border-slate-600 rounded p-3">
                            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
{`from os import listdir
model_files = [f for f in listdir("/assets/digital_twin/") if f.endswith(".glb")]`}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Digital Twin Loaded */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest mb-2">03 // DIGITAL TWIN LOADED</h4>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">3D mesh loaded into scene renderer</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">A2A engagement: vision_locator + manufacturing_overlay</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Used embedded CAD tags + bounding boxes to isolate components: wheels, chassis, battery, cabin frame, etc.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Component Anchor Mapping */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest">04 // COMPONENT ANCHOR MAPPING (A2A)</h4>
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
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">component_mapper_agent detects 17 interactive tags</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Assigned each tag an ID and maps to internal component registry (via MCP auth token to PLM system)</span>
                      </div>
                      <div className="mt-3 bg-slate-900 border border-slate-600 rounded p-3">
                        <div className="text-xs text-slate-400 font-mono mb-2">Example:</div>
                        <div className="text-xs text-slate-300 font-mono space-y-1">
                          <div>ID#005 → Wheel Assembly – Front Left</div>
                          <div>Linked ERP Tag: ERP#WHEEL.210A.K2</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Retrieval */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest">05 // DATA RETRIEVAL & AGGREGATION</h4>
                      <button
                        onClick={() => toggleSection('data')}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {expandedSections.data ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-3">
                      <div>
                        <div className="flex items-start text-sm mb-2">
                          <span className="text-slate-500 mr-3 font-mono">→</span>
                          <span className="text-slate-300">production_analyst_agent fetches:</span>
                        </div>
                        <div className="ml-6 space-y-1 text-sm text-slate-400">
                          <div>• MES logs from Plant K2 for wheel stations</div>
                          <div>• Assembly time stamps (start/end)</div>
                          <div>• Downtime reasons & technician notes</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-start text-sm mb-2">
                          <span className="text-slate-500 mr-3 font-mono">→</span>
                          <span className="text-slate-300">sustainability_agent retrieves:</span>
                        </div>
                        <div className="ml-6 space-y-1 text-sm text-slate-400">
                          <div>• Material sourcing files (CSV, supplier XML)</div>
                          <div>• Emissions factors from certified LCA provider (via API)</div>
                          <div>• Previous audit reports from sustainability folder</div>
                        </div>
                      </div>
                      
                      {/* Expandable Data Queries */}
                      {expandedSections.data && (
                        <div className="mt-3 space-y-3">
                          <div className="text-xs text-slate-400 font-mono uppercase tracking-wide border-t border-slate-600 pt-3">
                            Sample Data Queries:
                          </div>
                          <div className="bg-slate-900 border border-slate-600 rounded p-3">
                            <div className="text-xs text-slate-400 font-mono mb-2">MES Production Query:</div>
                            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
{`SELECT 
  component_id,
  assembly_time_minutes,
  defect_rate_percent,
  station_efficiency
FROM mes_production_logs 
WHERE plant_id = 'K2' 
  AND date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY component_id, date DESC;`}
                            </pre>
                          </div>
                          <div className="bg-slate-900 border border-slate-600 rounded p-3">
                            <div className="text-xs text-slate-400 font-mono mb-2">Sustainability API Call:</div>
                            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
{`GET /api/v1/lca/emissions
{
  "component_types": ["wheel", "engine", "chassis"],
  "material_grades": ["steel_recycled", "aluminum_virgin"],
  "scope": "cradle_to_gate"
}`}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modeling & Insight Engine */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest mb-2">06 // MODELING & INSIGHT ENGINE</h4>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Modeled improvements using:</span>
                      </div>
                      <div className="ml-6 space-y-1 text-sm text-slate-400">
                        <div>• ProdBoost v1.4 for productivity forecasting</div>
                        <div>• EmissionPathFinder to simulate eco-material swaps</div>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Detected cost/time gains from automation setting updates</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Estimated CO₂ impact of changing to low-carbon aluminum (5.2kg saved per unit)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UX & Interaction Design */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest mb-2">07 // UX & INTERACTION DESIGN</h4>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Generated tag overlays and right-panel binding</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Interactive visual includes:</span>
                      </div>
                      <div className="ml-6 space-y-1 text-sm text-slate-400">
                        <div>• Time-series line graphs</div>
                        <div>• Material breakdown donut</div>
                        <div>• Cards with KPIs and toggle actions</div>
                      </div>
                      <div className="flex items-start text-sm">
                        <span className="text-slate-500 mr-3 font-mono">→</span>
                        <span className="text-slate-300">Logged all results to Omnis Activity Ledger</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final result */}
                <div className="relative flex items-start">
                  <div className="absolute left-3 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                  <div className="ml-10">
                    <h4 className="font-mono text-slate-200 text-xs uppercase tracking-widest mb-2">08 // RESULT_GENERATED</h4>
                    <div className="bg-slate-800 border border-slate-700 rounded p-3">
                      <p className="text-slate-300 text-sm font-mono">3D Interactive Component Analysis successfully generated with real-time manufacturing intelligence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                OMNIS.AI.ENGINE.v2.4.1 • DIGITAL_TWIN_INTEL_PIPELINE
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 