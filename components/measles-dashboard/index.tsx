"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { 
  TrendingDown, 
  Thermometer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Car,
  Zap,
  Eye,
  Battery,
  Server,
  Play
} from "lucide-react";
import { KpiCard } from "../measles-dashboard/action-panel";
import { ChartContainer, BarChart, Timeline, PassFailMatrix, DonutChart, GPUHeatmap, SystemMetricsChart } from "../measles-dashboard/info-panel";
import { ProviderHeader } from "./provider-header";

interface AutonomousDashboardProps {
  className?: string;
}

export default function AutonomousDashboard({ className }: AutonomousDashboardProps) {

  return (
    <div className={`bg-white text-gray-900 ${className}`}>
      {/* Three Column Layout with Separators */}
      <div className="grid grid-cols-3 gap-6 p-6" style={{ minHeight: '800px' }}>
        
        {/* Column 1: Gatik */}
        <div className="space-y-6 flex flex-col h-full pr-6 border-r border-gray-200">
          <ProviderHeader 
            provider="gatik" 
            title="Gatik – Driving Intelligence" 
          />

          {/* KPI Row */}
          <div className="grid grid-cols-2 gap-4">
            <KpiCard 
              title="Autonomous Miles"
              value="1,342"
              icon={<Car className="w-4 h-4" />}
            />
            <KpiCard 
              title="Disengagements"
              value="3"
              change="from 6"
              changeDirection="down"
              icon={<Zap className="w-4 h-4" />}
            />
            <KpiCard 
              title="Object Detection"
              value="98.4%"
              icon={<Eye className="w-4 h-4" />}
            />
            <KpiCard 
              title="Energy Use"
              value="19.3 Wh/km"
              icon={<Battery className="w-4 h-4" />}
            />
          </div>

          {/* Test Loop Route Map */}
          <ChartContainer title="Test Loop - Active Routes">
            <div className="h-40 bg-gray-50 rounded p-4 relative overflow-hidden">
              {/* Route path */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160">
                {/* Main route loop */}
                <path 
                  d="M50 80 Q150 40 250 80 Q150 120 50 80" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                {/* Current vehicle positions */}
                <circle cx="80" cy="70" r="4" fill="#10b981" />
                <circle cx="180" cy="90" r="4" fill="#10b981" />
                <circle cx="220" cy="85" r="4" fill="#10b981" />
                
                {/* Disengagement locations */}
                <circle cx="120" cy="60" r="3" fill="#ef4444" />
                <circle cx="200" cy="95" r="3" fill="#ef4444" />
                <circle cx="160" cy="75" r="3" fill="#ef4444" />
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-2 left-2 flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-black">Active Vehicles (3)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-black">Disengagements (3)</span>
                </div>
              </div>
            </div>
          </ChartContainer>

          {/* Disengagement Trends with Context */}
          <ChartContainer title="Weekly Disengagement Analysis">
            <div className="space-y-3">
              {/* Trend line chart */}
              <div className="h-24 relative">
                <svg className="w-full h-full" viewBox="0 0 350 96">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="50" height="16" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 16" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Data line */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    points="25,64 75,48 125,32 175,56 225,40 275,24 325,24"
                  />
                  
                  {/* Data points */}
                  {[
                    {x: 25, y: 64, value: 8},
                    {x: 75, y: 48, value: 6}, 
                    {x: 125, y: 32, value: 4},
                    {x: 175, y: 56, value: 7},
                    {x: 225, y: 40, value: 5},
                    {x: 275, y: 24, value: 3},
                    {x: 325, y: 24, value: 3}
                  ].map((point, i) => (
                    <g key={i}>
                      <circle cx={point.x} cy={point.y} r="3" fill="#3b82f6" />
                      <text x={point.x} y={point.y - 8} textAnchor="middle" fontSize="10" fill="#000000">
                        {point.value}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              
              {/* Days labels */}
              <div className="flex justify-between text-xs text-black px-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              
              {/* Key insights */}
              <div className="bg-blue-50 rounded p-2 mt-2">
                <div className="text-xs text-black">
                  <span className="font-medium">Trend:</span> 50% reduction since Monday. 
                  <span className="text-green-600 font-medium"> Target achieved</span> (≤3/day)
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>

        {/* Column 2: NVIDIA */}
        <div className="space-y-6 flex flex-col h-full pr-6 border-r border-gray-200">
          <ProviderHeader 
            provider="nvidia" 
            title="NVIDIA – System Performance" 
            logoSrc="/images/nvidia-logo.png"
          />

          {/* KPI Row */}
          <div className="grid grid-cols-3 gap-4">
            <KpiCard 
              title="System Uptime"
              value="99.93%"
              icon={<Server className="w-4 h-4" />}
            />
            <KpiCard 
              title="Peak GPU Load"
              value="87%"
              icon={<Zap className="w-4 h-4" />}
            />
            <KpiCard 
              title="Thermal Alerts"
              value="2 minor"
              icon={<Thermometer className="w-4 h-4" />}
            />
          </div>

          {/* GPU Temperature Heatmap */}
          <ChartContainer title="GPU Temperature & Utilization">
            <GPUHeatmap />
          </ChartContainer>

          {/* Real-time System Metrics */}
          <ChartContainer title="Real-time System Metrics">
            <SystemMetricsChart />
          </ChartContainer>

          {/* Compute Load by Vehicle */}
          <ChartContainer title="Compute Load by Vehicle">
            <BarChart />
          </ChartContainer>

          {/* Timeline Strip */}
          <ChartContainer title="Thermal Events Timeline">
            <Timeline />
          </ChartContainer>
        </div>

        {/* Column 3: Applied Intuition */}
        <div className="space-y-6 flex flex-col h-full">
          <ProviderHeader 
            provider="applied-intuition" 
            title="Applied Intuition – Simulation & Validation" 
          />

          {/* Pass/Fail Matrix */}
          <ChartContainer title="Scenario Pass/Fail Matrix">
            <PassFailMatrix />
          </ChartContainer>

          {/* Donut Chart */}
          <ChartContainer title="Scenario Coverage">
            <DonutChart />
          </ChartContainer>

          {/* Simulation Timeline */}
          <ChartContainer title="Simulation Timeline Playback">
            <div className="bg-gray-50 rounded p-4 border-2 border-dashed border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-black">Pedestrian in fog scenario</span>
              </div>
              <div className="text-xs text-black">
                Real vs Simulated Behavior Analysis
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="mt-6 bg-gray-100 border-t border-gray-200 p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-black">Fleet Summary</h3>
          <div className="flex justify-center gap-8 mt-2">
            <div className="text-center">
              <div className="text-xl font-bold text-black">12</div>
              <div className="text-sm text-black">Active Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-black">2,847</div>
              <div className="text-sm text-black">Total Miles Today</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-black">98.7%</div>
              <div className="text-sm text-black">Overall Efficiency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
