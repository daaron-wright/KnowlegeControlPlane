"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList, Cell } from "recharts";

interface PortfolioPerformanceComparisonChartProps {
  className?: string;
}

// Data from ESC_Scope3_Demo_CSV_Raw.md
const PORTFOLIO_PERFORMANCE_DATA = [
  {
    metric: "Carbon Intensity",
    "New Investments": 42,
    "L&G Portfolio": 49,
    unit: "tCO2e/£m",
    "New Investments Label": "42 tCO2e/£m",
    "L&G Portfolio Label": "49 tCO2e/£m"
  },
  {
    metric: "WACI",
    "New Investments": 105,
    "L&G Portfolio": 117,
    unit: "",
    "New Investments Label": "105 WACI Ratio",
    "L&G Portfolio Label": "117 WACI Ratio"
  },
  {
    metric: "Temperature",
    "New Investments": 2.5,
    "L&G Portfolio": 2.8,
    unit: "°C",
    "New Investments Label": "2.5 °C",
    "L&G Portfolio Label": "2.8 °C"
  }
];

export default function PortfolioPerformanceComparisonChart({ className }: PortfolioPerformanceComparisonChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={PORTFOLIO_PERFORMANCE_DATA}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis 
            domain={[0, 130]}
            label={{ value: 'Values', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name, props) => [
              props.payload.unit ? `${value} ${props.payload.unit}` : `${value}`, 
              name
            ]}
            labelFormatter={(label) => `${label} Comparison`}
          />
          <Legend />
          <Bar dataKey="New Investments" fill="#1f4e79" name="18 Investments Under Consideration">
            <LabelList 
              dataKey="New Investments Label"
              position="top"
              style={{ fontSize: '12px', fontWeight: 'bold', fill: '#1f4e79' }}
            />
          </Bar>
          <Bar dataKey="L&G Portfolio" fill="#87ceeb" name="Existing L&G Portfolio">
            <LabelList 
              dataKey="L&G Portfolio Label"
              position="top"
              style={{ fontSize: '12px', fontWeight: 'bold', fill: '#4682b4' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
