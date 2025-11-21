import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({ title, children, className }: ChartContainerProps) {
  return (
    <Card className={`bg-white border-gray-200 shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg text-black">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export function BarChart() {
  const vehicles = [
    { id: "V-001", load: 85, threshold: "high" },
    { id: "V-002", load: 45, threshold: "normal" },
    { id: "V-003", load: 72, threshold: "moderate" },
    { id: "V-004", load: 30, threshold: "normal" },
    { id: "V-005", load: 92, threshold: "high" }
  ];

  const getBarColor = (threshold: string) => {
    switch (threshold) {
      case "high": return "bg-red-400";
      case "moderate": return "bg-yellow-400"; 
      case "normal": return "bg-green-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-3">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="flex items-center gap-3">
          <span className="text-xs font-mono text-black w-12">{vehicle.id}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-4 relative">
            <div 
              className={`h-full rounded-full ${getBarColor(vehicle.threshold)}`}
              style={{ width: `${vehicle.load}%` }}
            />
          </div>
          <span className="text-xs text-black w-8">{vehicle.load}%</span>
        </div>
      ))}
    </div>
  );
}

export function Timeline() {
  const events = [
    { time: "14:30", type: "minor", description: "GPU temp spike" },
    { time: "16:45", type: "minor", description: "Cooling adjustment" }
  ];

  return (
    <div className="space-y-2">
      {events.map((event, index) => (
        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
          <span className="text-xs font-mono text-black">{event.time}</span>
          <span className="text-xs text-black">{event.description}</span>
        </div>
      ))}
    </div>
  );
}

export function PassFailMatrix() {
  const scenarios = [
    { name: "Highway merge", builds: ["✓", "✓", "✓", "✓"] },
    { name: "Urban intersection", builds: ["✓", "✓", "✓", "✓"] },
    { name: "Pedestrian crossing", builds: ["✓", "✓", "✓", "✓"] },
    { name: "Pedestrian in fog", builds: ["✓", "✓", "✗", "✓"] },
    { name: "Emergency vehicle", builds: ["✓", "✓", "✓", "✓"] }
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2 text-xs">
        <div className="text-black font-medium">Scenario</div>
        <div className="text-black text-center">v1.2</div>
        <div className="text-black text-center">v1.3</div>
        <div className="text-black text-center">v1.4</div>
        <div className="text-black text-center">v1.5</div>
      </div>
      {scenarios.map((scenario, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 text-xs py-1">
          <div className="text-black">{scenario.name}</div>
          {scenario.builds.map((result, buildIndex) => (
            <div key={buildIndex} className="text-center">
              <span className={result === "✓" ? "text-green-500" : "text-red-500"}>
                {result}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function DonutChart() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 40 * 0.967} ${2 * Math.PI * 40}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-black">96.7%</span>
        </div>
      </div>
    </div>
  );
}

export function GPUHeatmap() {
  const gpuNodes = [
    { id: "GPU-1", temp: 72, util: 85, status: "high" },
    { id: "GPU-2", temp: 65, util: 45, status: "normal" },
    { id: "GPU-3", temp: 68, util: 72, status: "moderate" },
    { id: "GPU-4", temp: 71, util: 30, status: "normal" },
    { id: "GPU-5", temp: 76, util: 92, status: "high" },
    { id: "GPU-6", temp: 63, util: 55, status: "normal" }
  ];

  const getHeatColor = (temp: number) => {
    if (temp >= 75) return "bg-red-400";
    if (temp >= 70) return "bg-yellow-400";
    return "bg-green-400";
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {gpuNodes.map((gpu, index) => (
        <div key={index} className="relative">
          <div className={`h-16 rounded ${getHeatColor(gpu.temp)} flex flex-col items-center justify-center text-white text-xs font-medium`}>
            <span>{gpu.id}</span>
            <span>{gpu.temp}°C</span>
            <span>{gpu.util}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SystemMetricsChart() {
  const metrics = [
    { time: "14:25", gpu: 82, cpu: 45, memory: 67 },
    { time: "14:30", gpu: 87, cpu: 52, memory: 71 },
    { time: "14:35", gpu: 79, cpu: 48, memory: 69 },
    { time: "14:40", gpu: 85, cpu: 55, memory: 73 },
    { time: "14:45", gpu: 83, cpu: 49, memory: 68 }
  ];

  return (
    <div className="space-y-3">
      {/* Mini chart */}
      <div className="h-20 relative">
        <svg className="w-full h-full" viewBox="0 0 300 80">
          {/* Grid */}
          <defs>
            <pattern id="metrics-grid" width="60" height="20" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#metrics-grid)" />
          
          {/* GPU line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            points="30,24 90,12 150,28 210,16 270,20"
          />
          
          {/* CPU line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points="30,44 90,36 150,40 210,32 270,42"
          />
          
          {/* Memory line */}
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            points="30,36 90,32 150,34 210,28 270,38"
          />
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded"></div>
          <span className="text-black">GPU</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded"></div>
          <span className="text-black">CPU</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded"></div>
          <span className="text-black">Memory</span>
        </div>
      </div>
      
      {/* Current values */}
      <div className="bg-gray-50 rounded p-2 grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-green-600 font-medium">83%</div>
          <div className="text-black">GPU Load</div>
        </div>
        <div className="text-center">
          <div className="text-blue-600 font-medium">49%</div>
          <div className="text-black">CPU Load</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-600 font-medium">68%</div>
          <div className="text-black">Memory</div>
        </div>
      </div>
    </div>
  );
} 