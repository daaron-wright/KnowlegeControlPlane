"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TemperatureAlignmentChartProps {
  className?: string;
}

// Data from Amil's feedback
const TEMPERATURE_ALIGNMENT_DATA = [
  {
    category: "Bonds",
    "L&G": 2.5,
    "Benchmark": 2.4
  },
  {
    category: "Equity", 
    "L&G": 2.6,
    "Benchmark": 2.3
  }
];

export default function TemperatureAlignmentChart({ className }: TemperatureAlignmentChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={TEMPERATURE_ALIGNMENT_DATA}
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
            domain={[2.2, 2.7]} 
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`${value}°C`, ""]}
            labelFormatter={(label) => `${label} Temperature Alignment`}
          />
          <Legend />
          <Bar dataKey="L&G" fill="#FF0000" name="L&G Portfolio" />
          <Bar dataKey="Benchmark" fill="#0000FF" name="Benchmark" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
