"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

interface DataQualityComparisonChartProps {
  className?: string;
}

// Data from ESC_Data_Quality.md - Data source percentages only
const DATA_QUALITY_COMPARISON_DATA = [
  {
    metric: "Primary Data",
    "New Investments": 60,
    "L&G Portfolio": 75,
    unit: "%",
    "New Investments Label": "60%",
    "L&G Portfolio Label": "75%"
  },
  {
    metric: "Secondary Data",
    "New Investments": 25,
    "L&G Portfolio": 20,
    unit: "%",
    "New Investments Label": "25%",
    "L&G Portfolio Label": "20%"
  },
  {
    metric: "Estimated Data",
    "New Investments": 15,
    "L&G Portfolio": 5,
    unit: "%",
    "New Investments Label": "15%",
    "L&G Portfolio Label": "5%"
  }
];

export default function DataQualityComparisonChart({ className }: DataQualityComparisonChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={DATA_QUALITY_COMPARISON_DATA}
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
            label={{ value: 'Values', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name, props) => [
              `${value}${props.payload.unit}`, 
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
