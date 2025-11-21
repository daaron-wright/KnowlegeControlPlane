"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PortfolioTemperatureMeasuresChartProps {
  className?: string;
}

// Data from Amil's feedback - separated by measurement type
const PORTFOLIO_TEMPERATURE_DATA = [
  {
    year: "2021",
    "Scopes 1&2": 2.6,
    "L&G Portfolio": 2.4,
    "Scopes 1,2&3": 2.9
  },
  {
    year: "2023", 
    "Scopes 1&2": 2.5,
    "L&G Portfolio": 2.4,
    "Scopes 1,2&3": 2.7
  },
  {
    year: "2024",
    "Scopes 1&2": 2.5, 
    "L&G Portfolio": 2.5,
    "Scopes 1,2&3": 2.8
  }
];

export default function PortfolioTemperatureMeasuresChart({ className }: PortfolioTemperatureMeasuresChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={PORTFOLIO_TEMPERATURE_DATA}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis 
            domain={[2.3, 3.0]} 
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`${value}°C`, ""]}
            labelFormatter={(label) => `${label} Temperature Measures`}
          />
          <Legend />
          <Bar dataKey="Scopes 1&2" fill="#FF0000" name="Scopes 1&2" />
          <Bar dataKey="L&G Portfolio" fill="#0000FF" name="L&G Portfolio" />
          <Bar dataKey="Scopes 1,2&3" fill="#00AA00" name="Scopes 1,2&3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
