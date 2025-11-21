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

interface PlannedInvestedEmissionsSectorChartProps {
  existingData: InvestmentData[];
}

const PlannedInvestedEmissionsSectorChart: React.FC<PlannedInvestedEmissionsSectorChartProps> = ({ existingData }) => {
  // Group existing data by sector
  const existingSectorData = existingData.reduce((acc, investment) => {
    const existing = acc.find(item => item.sector === investment.sector);
    if (existing) {
      existing.existingEmissions += investment.emissions;
      existing.existingAmount += investment.amount;
      existing.investmentCount += 1;
    } else {
      acc.push({
        sector: investment.sector,
        existingEmissions: investment.emissions,
        existingAmount: investment.amount / 1000000,
        investmentCount: 1,
        plannedEmissions: 0,
        plannedAmount: 0,
        totalEmissions: 0,
        totalAmount: 0,
      });
    }
    return acc;
  }, [] as Array<{
    sector: string; 
    existingEmissions: number; 
    existingAmount: number;
    investmentCount: number;
    plannedEmissions: number;
    plannedAmount: number;
    totalEmissions: number;
    totalAmount: number;
  }>);

  // Simulate planned investments with sector-specific growth rates
  const sectorGrowthRates: Record<string, number> = {
    'Energy': 1.6, // High growth in renewable energy
    'Technology': 1.8, // Very high growth in cleantech
    'Transportation': 1.4, // Moderate growth in electric mobility
    'Real Estate': 1.2, // Lower growth in green buildings
    'Utilities': 1.5, // High growth in smart grid
    'Industrials': 1.3, // Moderate growth in decarbonization
    'Agriculture': 1.7, // High growth in sustainable farming
    'Materials': 1.4, // Moderate growth in circular economy
    'Financials': 1.1, // Lower growth in green finance
    'Infrastructure': 1.5, // High growth in climate infrastructure
    'Forestry': 1.9, // Very high growth in nature-based solutions
    'Marine': 1.6, // High growth in blue economy
    'Water': 1.4, // Moderate growth in water stewardship
  };

  const chartData = existingSectorData.map(sector => {
    const growthRate = sectorGrowthRates[sector.sector] || 1.3;
    const plannedEmissions = Math.round(sector.existingEmissions * (growthRate - 0.7)); // Planned only
    const plannedAmount = parseFloat((sector.existingAmount * (growthRate - 0.8)).toFixed(1)); // Planned only
    
    return {
      ...sector,
      plannedEmissions,
      plannedAmount,
      totalEmissions: sector.existingEmissions + plannedEmissions,
      totalAmount: sector.existingAmount + plannedAmount,
      emissionIntensity: parseFloat(((sector.existingEmissions + plannedEmissions) / (sector.existingAmount + plannedAmount)).toFixed(1)),
    };
  });

  // Sort by total emissions (existing + planned)
  chartData.sort((a, b) => b.totalEmissions - a.totalEmissions);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <div className="space-y-1">
            <p className="text-blue-600">
              {`Existing: ${data.existingEmissions.toFixed(0)} tCO₂e ($${data.existingAmount.toFixed(1)}M)`}
            </p>
            <p className="text-orange-600">
              {`Planned: ${data.plannedEmissions.toFixed(0)} tCO₂e ($${data.plannedAmount.toFixed(1)}M)`}
            </p>
            <p className="text-gray-800 font-semibold border-t pt-1">
              {`Total: ${data.totalEmissions.toFixed(0)} tCO₂e ($${data.totalAmount.toFixed(1)}M)`}
            </p>
            <p className="text-green-600">
              {`Intensity: ${data.emissionIntensity} tCO₂e/$M`}
            </p>
            <p className="text-purple-600">
              {`Investments: ${data.investmentCount}`}
            </p>
          </div>
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
            stackId="a"
            fill="#3B82F6" 
            name="Existing Emissions (tCO₂e)"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="plannedEmissions" 
            stackId="a"
            fill="#F59E0B" 
            name="Planned Emissions (tCO₂e)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlannedInvestedEmissionsSectorChart;
