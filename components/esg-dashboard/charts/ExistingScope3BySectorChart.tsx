"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface InvestmentData {
  name: string;
  org: string;
  amount: number;
  emissions: number;
  sector: string;
}

interface ExistingScope3BySectorChartProps {
  data: InvestmentData[];
}

const ExistingScope3BySectorChart: React.FC<ExistingScope3BySectorChartProps> = ({ data }) => {
  // Prepare data for the chart - group by sector and sum emissions
  const sectorData = data.reduce((acc, investment) => {
    const existing = acc.find(item => item.sector === investment.sector);
    if (existing) {
      existing.emissions += investment.emissions;
      existing.amount += investment.amount;
    } else {
      acc.push({
        sector: investment.sector,
        emissions: investment.emissions,
        amount: investment.amount / 1000000, // Convert to millions
      });
    }
    return acc;
  }, [] as Array<{sector: string; emissions: number; amount: number}>);

  // Sort by emissions for better visualization
  sectorData.sort((a, b) => b.emissions - a.emissions);

  // Color palette for sectors
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0',
    '#87D068', '#FFA07A', '#20B2AA', '#FF6347', '#9370DB'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${data.sector}`}</p>
          <p className="text-green-600">
            {`Emissions: ${data.emissions.toFixed(0)} tCO₂e`}
          </p>
          <p className="text-blue-600">
            {`Investment: $${data.amount.toFixed(1)}M`}
          </p>
          <p className="text-gray-600">
            {`${((data.emissions / sectorData.reduce((sum, item) => sum + item.emissions, 0)) * 100).toFixed(1)}% of total`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
    const RADIAN = Math.PI / 180;
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

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sectorData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="emissions"
          >
            {sectorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => `${entry.payload.sector}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExistingScope3BySectorChart;
