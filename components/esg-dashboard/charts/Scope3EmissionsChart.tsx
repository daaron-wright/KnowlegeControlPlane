"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Scope3EmissionsChartProps {
  className?: string;
}

// Data from Amil's feedback
const SCOPE3_EMISSIONS_DATA = [
  { name: "Investments (Category 15)", value: 4900000, color: "#FF6B6B" },
  { name: "Downstream leased assets (Category 13)", value: 259000, color: "#4ECDC4" },
  { name: "Business travel (Category 6)", value: 7799, color: "#45B7D1" },
  { name: "Fuel and energy-related activities (Category 3)", value: 7474, color: "#FFA07A" },
  { name: "Homeworking (Category 7)", value: 3323, color: "#98D8C8" },
  { name: "Waste (Category 5)", value: 308, color: "#F06292" },
  { name: "Upstream leased assets (Category 8)", value: 239, color: "#AED581" }
];

const formatValue = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M tCO2e`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K tCO2e`;
  }
  return `${value} tCO2e`;
};

export default function Scope3EmissionsChart({ className }: Scope3EmissionsChartProps) {
  return (
    <div className={`w-full h-[450px] overflow-hidden ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={SCOPE3_EMISSIONS_DATA}
            cx="50%"
            cy="35%"
            labelLine={false}
            label={({ percent }) => 
              (percent && percent > 8) ? `${(percent).toFixed(0)}%` : ''
            }
            outerRadius={75}
            fill="#8884d8"
            dataKey="value"
          >
            {SCOPE3_EMISSIONS_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [formatValue(Number(value)), "Emissions"]}
            labelFormatter={(label) => label}
          />
          <Legend 
            verticalAlign="bottom" 
            height={140}
            wrapperStyle={{
              fontSize: '9px',
              lineHeight: '1.1',
              paddingTop: '10px'
            }}
            formatter={(value) => {
              // Truncate long labels for better fit
              return value.length > 25 ? value.substring(0, 22) + '...' : value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
