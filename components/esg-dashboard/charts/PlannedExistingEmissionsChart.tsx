"use client";

import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InvestmentData {
  name: string;
  org: string;
  amount: number;
  emissions: number;
  sector: string;
}

interface PlannedExistingEmissionsChartProps {
  existingData: InvestmentData[];
}

const PlannedExistingEmissionsChart: React.FC<PlannedExistingEmissionsChartProps> = ({ existingData }) => {
  // Group existing data by sector
  const existingSectorData = existingData.reduce((acc, investment) => {
    const existing = acc.find(item => item.sector === investment.sector);
    if (existing) {
      existing.existingEmissions += investment.emissions;
      existing.existingAmount += investment.amount;
    } else {
      acc.push({
        sector: investment.sector,
        existingEmissions: investment.emissions,
        existingAmount: investment.amount / 1000000,
        plannedEmissions: 0,
        plannedAmount: 0,
      });
    }
    return acc;
  }, [] as Array<{
    sector: string; 
    existingEmissions: number; 
    existingAmount: number;
    plannedEmissions: number;
    plannedAmount: number;
  }>);

  // Simulate planned investments (30-50% increase in each sector)
  const chartData = existingSectorData.map(sector => ({
    ...sector,
    plannedEmissions: Math.round(sector.existingEmissions * (1.3 + Math.random() * 0.2)),
    plannedAmount: parseFloat((sector.existingAmount * (1.2 + Math.random() * 0.3)).toFixed(1)),
  }));

  // Sort by total (existing + planned) emissions
  chartData.sort((a, b) => (b.existingEmissions + b.plannedEmissions) - (a.existingEmissions + a.plannedEmissions));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const existing = payload.find((p: any) => p.dataKey === 'existingEmissions')?.value || 0;
      const planned = payload.find((p: any) => p.dataKey === 'plannedEmissions')?.value || 0;
      const total = existing + planned;
      
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-blue-600">
            {`Existing: ${existing.toFixed(0)} tCO₂e`}
          </p>
          <p className="text-orange-600">
            {`Planned: ${planned.toFixed(0)} tCO₂e`}
          </p>
          <p className="text-gray-800 font-semibold">
            {`Total: ${total.toFixed(0)} tCO₂e`}
          </p>
          <p className="text-green-600">
            {`Growth: ${(((planned - existing) / existing) * 100).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
            dataKey="sector" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="existingEmissions" 
            fill="#3B82F6" 
            name="Existing Emissions (tCO₂e)"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="plannedEmissions" 
            fill="#F59E0B" 
            name="Planned Emissions (tCO₂e)"
            radius={[2, 2, 0, 0]}
          />
          <Line 
            type="monotone" 
            dataKey="existingAmount" 
            stroke="#10B981" 
            strokeWidth={3}
            name="Investment Amount ($M)"
            dot={{ r: 6, fill: '#10B981' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlannedExistingEmissionsChart;
