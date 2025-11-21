"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

interface AssetTypeCarbonIntensityChartProps {
  className?: string;
}

// Data from ESC_Scope3_Demo_CSV_Raw.md
const ASSET_TYPE_DATA = [
  {
    assetType: "Bond",
    "New Investments": 52,
    "L&G Portfolio": 55,
    "External Benchmark": 57,
    "New Investments Label": "52",
    "L&G Portfolio Label": "55",
    "External Benchmark Label": "57"
  },
  {
    assetType: "Real Estate", 
    "New Investments": 7,
    "L&G Portfolio": 9,
    "External Benchmark": 6,
    "New Investments Label": "7",
    "L&G Portfolio Label": "9",
    "External Benchmark Label": "6"
  },
  {
    assetType: "Infrastructure",
    "New Investments": 1,
    "L&G Portfolio": 1,
    "External Benchmark": 2,
    "New Investments Label": "1",
    "L&G Portfolio Label": "1",
    "External Benchmark Label": "2"
  }
];

export default function AssetTypeCarbonIntensityChart({ className }: AssetTypeCarbonIntensityChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={ASSET_TYPE_DATA}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="assetType" />
          <YAxis 
            domain={[0, 70]}
            tickCount={8}
            label={{ value: 'Carbon Intensity (tCO2e/£m)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [`${value} tCO2e/£m`, name]}
            labelFormatter={(label) => `${label} Asset Type`}
          />
          <Legend />
          <Bar dataKey="L&G Portfolio" fill="#87ceeb" name="Existing L&G Portfolio">
            <LabelList 
              dataKey="L&G Portfolio Label"
              position="top"
              style={{ fontSize: '12px', fontWeight: 'bold', fill: '#4682b4' }}
            />
          </Bar>
          <Bar dataKey="External Benchmark" fill="#b0c4de" name="External Benchmark">
            <LabelList 
              dataKey="External Benchmark Label"
              position="top"
              style={{ fontSize: '12px', fontWeight: 'bold', fill: '#5a90b8' }}
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
