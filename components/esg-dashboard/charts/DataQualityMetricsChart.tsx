"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DataQualityMetricsChartProps {
  className?: string;
}

// PCAF Data Quality Scores by Asset Class
const DATA_QUALITY_METRICS = [
  {
    category: "Bonds",
    "Score 1": 35,
    "Score 2": 40,
    "Score 3": 20,
    "Score 4": 5,
    "Score 5": 0
  },
  {
    category: "Real Estate",
    "Score 1": 20,
    "Score 2": 25,
    "Score 3": 35,
    "Score 4": 15,
    "Score 5": 5
  },
  {
    category: "Infrastructure",
    "Score 1": 25,
    "Score 2": 35,
    "Score 3": 30,
    "Score 4": 8,
    "Score 5": 2
  }
];

export default function DataQualityMetricsChart({ className }: DataQualityMetricsChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={DATA_QUALITY_METRICS}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis 
            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label) => `${label} Data Quality Distribution`}
          />
          <Legend />
          <Bar dataKey="Score 1" stackId="a" fill="#00AA00" name="Score 1 (Highest Quality)" />
          <Bar dataKey="Score 2" stackId="a" fill="#66BB00" name="Score 2" />
          <Bar dataKey="Score 3" stackId="a" fill="#FFBB00" name="Score 3" />
          <Bar dataKey="Score 4" stackId="a" fill="#FF6600" name="Score 4" />
          <Bar dataKey="Score 5" stackId="a" fill="#FF0000" name="Score 5 (Lowest Quality)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
