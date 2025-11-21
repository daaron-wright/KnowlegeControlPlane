"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InvestmentData {
  name: string;
  org: string;
  amount: number;
  emissions: number;
  sector: string;
}

interface ExistingInvesteesEmissionsChartProps {
  data: InvestmentData[];
}

const ExistingInvesteesEmissionsChart: React.FC<ExistingInvesteesEmissionsChartProps> = ({ data }) => {
  // Prepare data for the chart - group by organization and sum values
  const chartData = data.reduce((acc, investment) => {
    const existing = acc.find(item => item.org === investment.org);
    if (existing) {
      existing.totalAmount += investment.amount;
      existing.totalEmissions += investment.emissions;
    } else {
      acc.push({
        org: investment.org,
        totalAmount: investment.amount / 1000000, // Convert to millions
        totalEmissions: investment.emissions,
        sector: investment.sector
      });
    }
    return acc;
  }, [] as Array<{org: string; totalAmount: number; totalEmissions: number; sector: string}>);

  // Sort by total amount for better visualization
  chartData.sort((a, b) => b.totalAmount - a.totalAmount);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-blue-600">
            {`Investment: $${payload[0].value.toFixed(1)}M`}
          </p>
          <p className="text-green-600">
            {`Emissions: ${payload[1].value.toFixed(0)} tCO₂e`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="org" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="totalAmount" 
            fill="#3B82F6" 
            name="Investment ($M)"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            yAxisId="right"
            dataKey="totalEmissions" 
            fill="#10B981" 
            name="Emissions (tCO₂e)"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExistingInvesteesEmissionsChart;
