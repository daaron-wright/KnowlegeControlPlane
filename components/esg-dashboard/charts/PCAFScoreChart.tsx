"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

interface PCAFScoreChartProps {
  className?: string;
}

// PCAF Score data from ESC_Data_Quality.md
const PCAF_SCORE_DATA = [
  {
    metric: "PCAF Score",
    "New Investments": 2.6,
    "L&G Portfolio": 2.3,
    unit: "",
    "New Investments Label": "2.6",
    "L&G Portfolio Label": "2.3"
  }
];

export default function PCAFScoreChart({ className }: PCAFScoreChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={PCAF_SCORE_DATA}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis 
            label={{ value: 'PCAF Score', angle: -90, position: 'insideLeft' }}
            domain={[2.15, 2.65]}
            tickCount={6}
          />
          <Tooltip 
            formatter={(value, name) => [
              `${value}`, 
              name
            ]}
            labelFormatter={(label) => `${label} Comparison`}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar dataKey="L&G Portfolio" fill="#87ceeb" name="Existing L&G Portfolio">
            <LabelList 
              dataKey="L&G Portfolio Label"
              position="top"
              style={{ fontSize: '12px', fontWeight: 'bold', fill: '#4682b4' }}
            />
          </Bar>
          <Bar dataKey="New Investments" fill="#1f4e79" name="Investments Under Consideration">
            <LabelList 
              dataKey="New Investments Label"
              position="top"
              style={{ fontSize: '12px', fontWeight: 'bold', fill: '#1f4e79' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
