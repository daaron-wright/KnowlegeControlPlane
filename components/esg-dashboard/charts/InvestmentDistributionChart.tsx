"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface InvestmentDistributionChartProps {
  className?: string;
}

// Data showing investment distribution by sector
const INVESTMENT_DISTRIBUTION_DATA = [
  { name: "Financials", value: 3200, color: "#0088FE" },
  { name: "Real Estate", value: 2800, color: "#00C49F" },
  { name: "Energy", value: 2100, color: "#FFBB28" },
  { name: "Utilities", value: 1900, color: "#FF8042" },
  { name: "Industrials", value: 1600, color: "#8884D8" },
  { name: "Technology", value: 1400, color: "#82CA9D" },
  { name: "Healthcare", value: 1200, color: "#FFC658" },
  { name: "Consumer Goods", value: 1000, color: "#FF7C7C" },
  { name: "Materials", value: 800, color: "#8DD1E1" },
  { name: "Transportation", value: 600, color: "#D084D0" },
  { name: "Other", value: 500, color: "#FFAA80" }
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function InvestmentDistributionChart({ className }: InvestmentDistributionChartProps) {
  return (
    <div className={`w-full h-[450px] overflow-hidden ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={INVESTMENT_DISTRIBUTION_DATA}
            cx="50%"
            cy="35%"
            labelLine={false}
            label={({ percent }) => 
              (percent && percent > 5) ? `${(percent * 100).toFixed(0)}%` : ''
            }
            outerRadius={75}
            fill="#8884d8"
            dataKey="value"
          >
            {INVESTMENT_DISTRIBUTION_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`£${value}M`, "Investment"]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={140}
            wrapperStyle={{
              fontSize: '9px',
              lineHeight: '1.1',
              paddingTop: '10px'
            }}
            formatter={(value, entry) => {
              const shortValue = value.length > 12 ? value.substring(0, 9) + '...' : value;
              return `${shortValue} (£${entry?.payload?.value || 0}M)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
