"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

interface CarbonIntensityBySectorChartProps {
  className?: string;
}

// Data from ESC_Scope3_Demo_CSV_Raw.md
const SECTOR_CARBON_INTENSITY_DATA = [
  {
    sector: "Utilities",
    "New Investments": 185,
    "L&G Portfolio": 158,
    "New Investments Label": "185",
    "L&G Portfolio Label": "158"
  },
  {
    sector: "Energy",
    "New Investments": 188,
    "L&G Portfolio": 192,
    "New Investments Label": "188",
    "L&G Portfolio Label": "192"
  },
  {
    sector: "Materials",
    "New Investments": 270,
    "L&G Portfolio": 290,
    "New Investments Label": "270",
    "L&G Portfolio Label": "290"
  },
  {
    sector: "Government",
    "New Investments": 82,
    "L&G Portfolio": 83,
    "New Investments Label": "82",
    "L&G Portfolio Label": "83"
  }
];

export default function CarbonIntensityBySectorChart({ className }: CarbonIntensityBySectorChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={SECTOR_CARBON_INTENSITY_DATA}
          margin={{
            top: 60,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          key="sector-chart-v2"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sector" />
          <YAxis 
            domain={[0, 320]}
            label={{ value: 'Carbon Intensity (tCO2e/£m)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [`${value} tCO2e/£m`, name]}
            labelFormatter={(label) => `${label} Sector`}
          />
          <Legend />
          <Bar dataKey="L&G Portfolio" fill="#87ceeb" name="Existing L&G Portfolio">
            <LabelList 
              dataKey="L&G Portfolio Label"
              position="top"
              style={{ fontSize: '12px', fontWeight: 'bold', fill: '#5a90b8' }}
              offset={8}
            />
          </Bar>
          <Bar dataKey="New Investments" fill="#1f4e79" name="Investments Under Consideration">
            <LabelList 
              dataKey="New Investments Label"
              position="top"
              style={{ fontSize: '12px', fontWeight: 'bold', fill: '#1f4e79' }}
              offset={8}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
