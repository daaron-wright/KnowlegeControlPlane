"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  BarChart3,
  PieChart,
  Target,
  Leaf,
  Shield,
  Building,
  Factory,
  Zap,
  Download,
  Eye,
  EyeOff,
  LineChart,
  Database,
  FileText
} from "lucide-react";
import {
  ExistingInvesteesEmissionsChart,
  ExistingScope3BySectorChart,
  PlannedExistingEmissionsChart,
  PlannedInvestedEmissionsSectorChart,
  PortfolioPerformanceComparisonChart,
  AssetTypeCarbonIntensityChart,
  CarbonIntensityBySectorChart,
  DataQualityComparisonChart,
  PCAFScoreChart
} from "./charts";
import Scope3EmissionsChart from "./charts/Scope3EmissionsChart";
import TemperatureAlignmentChart from "./charts/TemperatureAlignmentChart";
import DataQualityMetricsChart from "./charts/DataQualityMetricsChart";
import { exportToCSV } from "../../utils/export-utils";

interface ESGDashboardProps {
  className?: string;
}

// Investment Portfolio Data - Updated based on Amil's feedback
const INVESTMENT_PORTFOLIO = [
  { name: "Housing Bond", org: "Green Habitat Corp", category: "Debt", sector: "Real Estate", amount: 9000000, emissions: 1250, carbonFootprint: "Medium", emissionIntensity: 39, waci: 105, impliedTemp: 2.4, pcafScore: 2.1 },
  { name: "Blue Economy Fund", org: "Oceanic Ventures", category: "Equity", sector: "Marine", amount: 8400000, emissions: 980, carbonFootprint: "Low", emissionIntensity: 38, waci: 98, impliedTemp: 2.3, pcafScore: 2.3 },
  { name: "Circular Economy Ventures", org: "EcoCycle Partners", category: "Venture Capital", sector: "Materials", amount: 3200000, emissions: 1800, carbonFootprint: "High", emissionIntensity: 56, waci: 135, impliedTemp: 2.8, pcafScore: 2.9 },
  { name: "Clean Transport Equity", org: "InsertTech Inc", category: "Equity", sector: "Transportation", amount: 12250000, emissions: 2300, carbonFootprint: "High", emissionIntensity: 47, waci: 120, impliedTemp: 2.6, pcafScore: 2.7 },
  { name: "Climate Tech Seed Fund", org: "GreenTech Startups", category: "Venture Capital", sector: "Technology", amount: 2100000, emissions: 1100, carbonFootprint: "Medium", emissionIntensity: 40, waci: 102, impliedTemp: 2.4, pcafScore: 2.2 },
  { name: "Emerging Markets Green Bond", org: "EcoCycle Partners", category: "Debt", sector: "Financials", amount: 8200000, emissions: 1450, carbonFootprint: "Medium", emissionIntensity: 35, waci: 95, impliedTemp: 2.2, pcafScore: 2.0 },
  { name: "Green Affordable Housing REIT", org: "EcoCycle Partners", category: "Equity", sector: "Real Estate", amount: 6200000, emissions: 1600, carbonFootprint: "Low", emissionIntensity: 41, waci: 108, impliedTemp: 2.5, pcafScore: 2.1 },
  { name: "Green Infrastructure Fund", org: "Ecoinvest Group", category: "Equity", sector: "Utilities", amount: 10000000, emissions: 900, carbonFootprint: "Low", emissionIntensity: 32, waci: 88, impliedTemp: 2.1, pcafScore: 1.9 },
  { name: "Industrial Decarbonization Fund", org: "Ecoinvest Group", category: "Equity", sector: "Industrials", amount: 11600000, emissions: 1750, carbonFootprint: "High", emissionIntensity: 45, waci: 115, impliedTemp: 2.6, pcafScore: 2.5 },
  { name: "Nature-Based Solutions Note", org: "ForestFuture Ltd", category: "Debt", sector: "Forestry", amount: 1950000, emissions: 1050, carbonFootprint: "Low", emissionIntensity: 36, waci: 92, impliedTemp: 2.2, pcafScore: 2.4 },
  { name: "Net-Zero Office Redevelopment", org: "Ecoinvest Group", category: "Real Estate", sector: "Real Estate", amount: 3750000, emissions: 1100, carbonFootprint: "Medium", emissionIntensity: 38, waci: 99, impliedTemp: 2.3, pcafScore: 2.2 },
  { name: "Renewable Energy Bonds", org: "Green Habitat Corp", category: "Debt", sector: "Energy", amount: 5000000, emissions: 1450, carbonFootprint: "Medium", emissionIntensity: 42, waci: 110, impliedTemp: 2.5, pcafScore: 2.3 },
  { name: "Smart Grid Infrastructure Trust", org: "InfraTech Solutions", category: "Infrastructure", sector: "Utilities", amount: 6800000, emissions: 1600, carbonFootprint: "High", emissionIntensity: 48, waci: 125, impliedTemp: 2.7, pcafScore: 2.8 },
  { name: "Sustainable Agriculture Fund", org: "Ecoinvest", category: "Equity", sector: "Agriculture", amount: 7500000, emissions: 900, carbonFootprint: "Low", emissionIntensity: 34, waci: 89, impliedTemp: 2.1, pcafScore: 2.0 },
  { name: "Sustainable Logistics REIT", org: "Green Habitat Corp", category: "Real Estate", sector: "Real Estate", amount: 7500000, emissions: 900, carbonFootprint: "Low", emissionIntensity: 33, waci: 87, impliedTemp: 2.0, pcafScore: 1.8 },
  { name: "Urban Mobility Infra Bond", org: "TransitTech Inc", category: "Infrastructure", sector: "Transportation", amount: 5600000, emissions: 1050, carbonFootprint: "Medium", emissionIntensity: 39, waci: 103, impliedTemp: 2.4, pcafScore: 2.2 },
  { name: "Waste-to-Energy Infra Fund", org: "Oceanic Ventures", category: "Infrastructure", sector: "Energy", amount: 7900000, emissions: 1100, carbonFootprint: "Medium", emissionIntensity: 37, waci: 97, impliedTemp: 2.3, pcafScore: 2.1 },
  { name: "Water Stewardship Fund", org: "Oceanic Ventures", category: "Private Equity", sector: "Water", amount: 4750000, emissions: 1450, carbonFootprint: "Medium", emissionIntensity: 44, waci: 113, impliedTemp: 2.5, pcafScore: 2.4 }
];

// L&G Portfolio Benchmarks (from Amil's feedback)
const LG_PORTFOLIO_BENCHMARKS = {
  totalEmissions: 4900000, // tCO2e
  emissionIntensity: 51, // tCO2e/£m
  waci: 117, // tCO2e/USD million revenues
  impliedTemp: 2.8, // °C
  pcafScore: 2.3 // Lower is better
};

// 18 Investments Aggregated Metrics - Updated to match ESC_Data_Quality.md
const INVESTMENTS_18_METRICS = {
  totalEmissions: INVESTMENT_PORTFOLIO.reduce((sum, inv) => sum + inv.emissions, 0),
  emissionIntensity: 42, // tCO2e/£m (better than L&G's 51)
  waci: 109, // tCO2e/USD million revenues (better than L&G's 117)
  impliedTemp: 2.5, // °C (better than L&G's 2.8)
  pcafScore: 2.6 // Worse than L&G's 2.3 due to more real estate and infrastructure assets
};

// Data Quality Assessment Data - Updated to match ESC_Data_Quality.md
const DATA_QUALITY_SOURCES = {
  primary: 60,
  secondary: 25,
  estimated: 15
};

// Asset Class Breakdown (L&G Portfolio)
const LG_ASSET_CLASS_BREAKDOWN = [
  { assetClass: "Bonds", byValue: 90, emissionIntensity: 55, ghgEmissions: 4.7, pcafQuality: 2.3 },
  { assetClass: "Property", byValue: 9, emissionIntensity: 14, ghgEmissions: 0.1, pcafQuality: 2.3 },
  { assetClass: "Equity", byValue: 1, emissionIntensity: 33, ghgEmissions: 0.0, pcafQuality: 2.3 }
];

// 18 Investments Asset Class Breakdown (Modified distribution)
const INVESTMENTS_18_ASSET_CLASS = [
  { assetClass: "Bonds", byValue: 70, emissionIntensity: 38, ghgEmissions: 0.12, pcafQuality: 2.1 },
  { assetClass: "Property", byValue: 20, emissionIntensity: 12, ghgEmissions: 0.03, pcafQuality: 2.4 },
  { assetClass: "Equity", byValue: 10, emissionIntensity: 28, ghgEmissions: 0.05, pcafQuality: 2.8 }
];

// Calculate portfolio statistics
const TOTAL_PORTFOLIO_VALUE = INVESTMENT_PORTFOLIO.reduce((sum, inv) => sum + inv.amount, 0);
const UNIQUE_ORGANIZATIONS = [...new Set(INVESTMENT_PORTFOLIO.map(inv => inv.org))];

// KPI Card Component
const KpiCard = ({ title, value, change, trend, icon, color }: {
  title: string;
  value: string;
  change?: string;
  trend?: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className={`p-2 ${color} rounded-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Comparison Table Component
const ComparisonTable = ({ title, data }: { title: string; data: any[] }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCSV(data, title.toLowerCase().replace(/\s+/g, '-'))}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium">Metric</th>
              <th className="text-right p-2 font-medium">L&G Portfolio</th>
              <th className="text-right p-2 font-medium">18 Investments</th>
              <th className="text-center p-2 font-medium">Performance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{row.metric}</td>
                <td className="p-2 text-right font-mono">{row.lgValue}</td>
                <td className="p-2 text-right font-mono">{row.investmentValue}</td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.performance === 'Better' ? 'bg-green-100 text-green-800' :
                    row.performance === 'Worse' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {row.performance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export default function ESGDashboardAmil({ className }: ESGDashboardProps) {
  const [activeTab, setActiveTab] = useState("financed-emissions");
  const [showInvestmentsTable, setShowInvestmentsTable] = useState(true);
  const [showEmissionsTable, setShowEmissionsTable] = useState(true);

  // Comparison data for Financed Emissions Analysis
  const financedEmissionsComparison = [
    {
      metric: "Total Emissions (tCO2e)",
      lgValue: "4,900,000",
      investmentValue: INVESTMENTS_18_METRICS.totalEmissions.toLocaleString(),
      performance: "Better"
    },
    {
      metric: "Emission Intensity (tCO2e/£m)",
      lgValue: LG_PORTFOLIO_BENCHMARKS.emissionIntensity.toString(),
      investmentValue: INVESTMENTS_18_METRICS.emissionIntensity.toString(),
      performance: "Better"
    },
    {
      metric: "WACI (tCO2e/USD million)",
      lgValue: LG_PORTFOLIO_BENCHMARKS.waci.toString(),
      investmentValue: INVESTMENTS_18_METRICS.waci.toString(),
      performance: "Better"
    },
    {
      metric: "Implied Temperature (°C)",
      lgValue: LG_PORTFOLIO_BENCHMARKS.impliedTemp.toString(),
      investmentValue: INVESTMENTS_18_METRICS.impliedTemp.toString(),
      performance: "Better"
    }
  ];

  // Data quality comparison
  const dataQualityComparison = [
    {
      metric: "PCAF Data Quality Score",
      lgValue: LG_PORTFOLIO_BENCHMARKS.pcafScore.toString(),
      investmentValue: INVESTMENTS_18_METRICS.pcafScore.toString(),
      performance: "Worse"
    },
    {
      metric: "Primary Data Coverage",
      lgValue: "65%",
      investmentValue: `${DATA_QUALITY_SOURCES.primary}%`,
      performance: "Similar"
    },
    {
      metric: "Estimated Data %",
      lgValue: "12%",
      investmentValue: `${DATA_QUALITY_SOURCES.estimated}%`,
      performance: "Worse"
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ESG Financed Emissions Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive analysis of 18 investments against L&G portfolio benchmarks • ${(TOTAL_PORTFOLIO_VALUE / 1000000).toFixed(1)}M Portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="financed-emissions" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Financed Emissions Analysis
          </TabsTrigger>
          <TabsTrigger value="data-quality" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data Quality Assessment
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Financed Emissions Analysis */}
        <TabsContent value="financed-emissions" className="space-y-6">
          {/* 1. Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">1. Summary - ESG Scope 3 Category 15 Analysis</CardTitle>
              <p className="text-gray-600">
                <strong>Total estimated CO2 equivalent for the 18 investments is 180 tCO2E</strong> compared to 4,900,000 tCO2e (2024 L&G Sustainability Report).
              </p>
            </CardHeader>
          </Card>

          {/* 1.1 Key Metrics Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                1.1 Key Metrics Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg bg-green-50">
                  <h3 className="text-lg font-bold mb-2">Carbon Intensity (tCO2e/£m)</h3>
                  <h4 className="text-3xl font-bold text-green-600 mb-2">-7</h4>
                  <p className="text-gray-600">vs L&G Portfolio</p>
                </div>
                <div className="text-center p-6 border rounded-lg bg-green-50">
                  <h3 className="text-lg font-bold mb-2">Weighted Average Carbon Intensity (WACI)</h3>
                  <h4 className="text-3xl font-bold text-green-600 mb-2">-12</h4>
                  <p className="text-gray-600">vs L&G Portfolio</p>
                </div>
                <div className="text-center p-6 border rounded-lg bg-green-50">
                  <h3 className="text-lg font-bold mb-2">Portfolio Temperature Alignment (°C)</h3>
                  <h4 className="text-3xl font-bold text-green-600 mb-2">-0.3</h4>
                  <p className="text-gray-600">vs L&G Portfolio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1.2 Portfolio Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                1.2 Portfolio Performance Comparison
              </CardTitle>
              <p className="text-sm text-gray-600">
                Carbon Intensity, WACI, and Temperature alignment comparison
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PortfolioPerformanceComparisonChart />
              </div>
            </CardContent>
          </Card>

          {/* 1.3 Summary Conclusion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                1.3 Summary Conclusion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-lg font-semibold text-green-800">
                  ✅ <strong>Conclusion:</strong> 18 additional investments are on whole more sustainable ('greener') than L&G's existing portfolio across all key metrics (Carbon Intensity (tCO2e/£m), Weighted Average Carbon Intensity (WACI), Portfolio Temperature Alignment (°C))
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Asset Type Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-purple-700">2. Asset Type Analysis</CardTitle>
            </CardHeader>
          </Card>

          {/* 2.1 Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                2.1 Asset Type Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-semibold text-green-800 mb-2">Bond</h4>
                    <p className="text-sm text-gray-600 mb-1">Carbon Intensity</p>
                    <p className="text-lg font-bold text-green-600">-3 vs L&G Portfolio</p>
                    <p className="text-lg font-bold text-green-600">-5 vs External Benchmark</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h4 className="font-semibold text-yellow-800 mb-2">Real Estate</h4>
                    <p className="text-sm text-gray-600 mb-1">Carbon Intensity</p>
                    <p className="text-lg font-bold text-green-600">-2 vs L&G Portfolio</p>
                    <p className="text-lg font-bold text-red-600">+1 vs External Benchmark</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-800 mb-2">Infrastructure</h4>
                    <p className="text-sm text-gray-600 mb-1">Carbon Intensity</p>
                    <p className="text-lg font-bold text-gray-600">0 vs L&G Portfolio</p>
                    <p className="text-lg font-bold text-green-600">-1 vs External Benchmark</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2.2 Detailed Asset Type Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                2.2 Detailed Asset Type Carbon Intensity Comparison (tCO2e/£m)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Bond, Real Estate, and Infrastructure carbon intensity comparison
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <AssetTypeCarbonIntensityChart />
              </div>
            </CardContent>
          </Card>

          {/* 2.3 Asset Type Conclusion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                2.3 Asset Type Conclusion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-semibold">
                  ✅ <strong>Asset Type Conclusion:</strong> 18 additional investments are less carbon intensive across all three asset classes than the existing L&G portfolio. Carbon intensity for proposed investment in real estate equity is still above the external benchmark.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Sector Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-700">3. Sector Analysis</CardTitle>
            </CardHeader>
          </Card>

          {/* 3.1 Sector Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                3.1 Sector Performance Overview
              </CardTitle>
              <p className="text-sm text-gray-600">
                Carbon Intensity Comparison - Investments Under Consideration vs Existing Portfolio
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 border rounded-lg bg-red-50 border-red-200">
                  <h3 className="text-lg font-bold mb-3 text-red-800">Utilities</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <h4 className="text-2xl font-bold text-red-600 mb-1">+27</h4>
                      <p className="text-sm text-gray-600">vs L&G Portfolio</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-red-700 font-semibold">
                    ⚠️ Higher carbon intensity
                  </div>
                </div>
                
                <div className="text-center p-6 border rounded-lg bg-green-50 border-green-200">
                  <h3 className="text-lg font-bold mb-3 text-green-800">Energy</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <h4 className="text-2xl font-bold text-green-600 mb-1">-4</h4>
                      <p className="text-sm text-gray-600">vs L&G Portfolio</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-green-700 font-semibold">
                    ✅ Better performance
                  </div>
                </div>
                
                <div className="text-center p-6 border rounded-lg bg-green-50 border-green-200">
                  <h3 className="text-lg font-bold mb-3 text-green-800">Materials</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <h4 className="text-2xl font-bold text-green-600 mb-1">-20</h4>
                      <p className="text-sm text-gray-600">vs L&G Portfolio</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-green-700 font-semibold">
                    ✅ Significantly better
                  </div>
                </div>
                
                <div className="text-center p-6 border rounded-lg bg-green-50 border-green-200">
                  <h3 className="text-lg font-bold mb-3 text-green-800">Government</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <h4 className="text-2xl font-bold text-green-600 mb-1">-1</h4>
                      <p className="text-sm text-gray-600">vs L&G Portfolio</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-green-700 font-semibold">
                    ✅ Better performance
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-md font-semibold text-blue-800 mb-2">Key Insights:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Utilities sector:</strong> 27 points worse than L&G Portfolio</li>
                  <li>• <strong>Energy sector:</strong> 4 points better than L&G Portfolio</li>
                  <li>• <strong>Materials sector:</strong> 20 points better than L&G Portfolio</li>
                  <li>• <strong>Government sector:</strong> 1 point better than L&G Portfolio</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 3.2 Detailed Sector Carbon Intensity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                3.2 Detailed Sector Carbon Intensity (tCO2e/£m)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Utilities, Energy, Materials, and Government sector comparison
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <CarbonIntensityBySectorChart />
              </div>
            </CardContent>
          </Card>

          {/* 4. Sector Analysis Conclusion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-yellow-700">4. Sector Analysis Conclusion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 font-semibold mb-2">
                    ⚠️ <strong>Sector Analysis Conclusion:</strong> 18 additional investments are less carbon intensive than the existing portfolio apart from the proposed investment in the utilities sector which are more carbon intensive.
                  </p>
                  <p className="text-red-700 font-bold">
                    📋 <strong>Please consider alternative investment strategy</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4.1 Individual Investment Breakdown */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">4.1 Individual Investment Breakdown (17 Investments)</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold">Investment Name</th>
                      <th className="text-left p-3 font-semibold">Sector</th>
                      <th className="text-left p-3 font-semibold">Asset Class</th>
                      <th className="text-right p-3 font-semibold">Carbon Intensity (tCO₂e/£m)</th>
                      <th className="text-right p-3 font-semibold">WACI</th>
                      <th className="text-right p-3 font-semibold">Temp Alignment (°C)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Green Energy Solutions Ltd</td>
                      <td className="p-3">Energy</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">188</td>
                      <td className="p-3 text-right font-mono">105</td>
                      <td className="p-3 text-right font-mono">2.6</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Thames Utilities PLC</td>
                      <td className="p-3">Utilities</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">185</td>
                      <td className="p-3 text-right font-mono">121</td>
                      <td className="p-3 text-right font-mono">2.8</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Scottish Power Holdings</td>
                      <td className="p-3">Utilities</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">185</td>
                      <td className="p-3 text-right font-mono">124</td>
                      <td className="p-3 text-right font-mono">2.9</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">North Sea Energy Corp</td>
                      <td className="p-3">Energy</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">188</td>
                      <td className="p-3 text-right font-mono">104</td>
                      <td className="p-3 text-right font-mono">2.5</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Renewable Power UK Ltd</td>
                      <td className="p-3">Energy</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">188</td>
                      <td className="p-3 text-right font-mono">105</td>
                      <td className="p-3 text-right font-mono">2.3</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Offshore Wind Holdings</td>
                      <td className="p-3">Energy</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">188</td>
                      <td className="p-3 text-right font-mono">106</td>
                      <td className="p-3 text-right font-mono">2.6</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Advanced Materials Group</td>
                      <td className="p-3">Materials</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">270</td>
                      <td className="p-3 text-right font-mono">105</td>
                      <td className="p-3 text-right font-mono">2.6</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Sustainable Chemicals PLC</td>
                      <td className="p-3">Materials</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">270</td>
                      <td className="p-3 text-right font-mono">109</td>
                      <td className="p-3 text-right font-mono">2.5</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Green Building Materials</td>
                      <td className="p-3">Materials</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">270</td>
                      <td className="p-3 text-right font-mono">109</td>
                      <td className="p-3 text-right font-mono">2.4</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Circular Economy Corp</td>
                      <td className="p-3">Materials</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">270</td>
                      <td className="p-3 text-right font-mono">111</td>
                      <td className="p-3 text-right font-mono">2.4</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">UK Government Green Bond</td>
                      <td className="p-3">Government</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">82</td>
                      <td className="p-3 text-right font-mono">99</td>
                      <td className="p-3 text-right font-mono">2.2</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">UK Treasury Sustainability Bond</td>
                      <td className="p-3">Government</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">82</td>
                      <td className="p-3 text-right font-mono">98</td>
                      <td className="p-3 text-right font-mono">2.5</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">UK Infrastructure Bond</td>
                      <td className="p-3">Government</td>
                      <td className="p-3">Bond</td>
                      <td className="p-3 text-right font-mono">82</td>
                      <td className="p-3 text-right font-mono">105</td>
                      <td className="p-3 text-right font-mono">2.2</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Kings Cross Development Trust</td>
                      <td className="p-3">Materials</td>
                      <td className="p-3">Real Estate Equity</td>
                      <td className="p-3 text-right font-mono">270</td>
                      <td className="p-3 text-right font-mono">106</td>
                      <td className="p-3 text-right font-mono">2.1</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Birmingham Green Energy Hub</td>
                      <td className="p-3">Materials</td>
                      <td className="p-3">Real Estate Equity</td>
                      <td className="p-3 text-right font-mono">270</td>
                      <td className="p-3 text-right font-mono">110</td>
                      <td className="p-3 text-right font-mono">2.4</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Manchester Sustainable Housing</td>
                      <td className="p-3">Government</td>
                      <td className="p-3">Real Estate Equity</td>
                      <td className="p-3 text-right font-mono">82</td>
                      <td className="p-3 text-right font-mono">97</td>
                      <td className="p-3 text-right font-mono">2.5</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">North Sea Wind Farm Holdings</td>
                      <td className="p-3">Energy</td>
                      <td className="p-3">Infrastructure (Project Finance)</td>
                      <td className="p-3 text-right font-mono">188</td>
                      <td className="p-3 text-right font-mono">112</td>
                      <td className="p-3 text-right font-mono">2.4</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 bg-blue-50">
                      <td className="p-3 font-medium">Cornwall Solar Energy Trust</td>
                      <td className="p-3">Energy</td>
                      <td className="p-3">Infrastructure (Project Finance)</td>
                      <td className="p-3 text-right font-mono">188</td>
                      <td className="p-3 text-right font-mono">107</td>
                      <td className="p-3 text-right font-mono">2.5</td>
                    </tr>
                    <tr className="border-b bg-blue-100 font-bold">
                      <td className="p-3 font-bold">Total</td>
                      <td className="p-3">-</td>
                      <td className="p-3">-</td>
                      <td className="p-3 text-right font-mono font-bold">42</td>
                      <td className="p-3 text-right font-mono font-bold">105</td>
                      <td className="p-3 text-right font-mono font-bold">2.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Data Quality Assessment */}
        <TabsContent value="data-quality" className="space-y-6">
          {/* Summary Section - From ESC_Data_Quality.md */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">SUMMARY</CardTitle>
              <p className="text-gray-600 mb-4">
                Overall the proportion of primary data sources (high quality, high provenance obtained from the asset owners and/or operators) is lower compared to the existing L&G portfolio.
              </p>
              <p className="text-gray-600 mb-4">
                Consequently, in undertaking the financed emission analysis I have to use a greater proportion of secondary sources and estimates, meaning that the data quality score (as defined by PCAF) is worse at the overall level.
              </p>
              
              {/* PCAF Data Quality Score Comparison - Matching Carbon Intensity Style */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-6 border rounded-lg bg-red-50">
                  <h3 className="text-lg font-bold mb-2">PCAF Data Quality Score</h3>
                  <h4 className="text-3xl font-bold text-red-600 mb-2">+0.2</h4>
                  <p className="text-gray-600">vs L&G Portfolio</p>
                </div>
                <div className="text-center p-6 border rounded-lg bg-red-50">
                  <h3 className="text-lg font-bold mb-2">Primary Data</h3>
                  <h4 className="text-3xl font-bold text-red-600 mb-2">-15%</h4>
                  <p className="text-gray-600">vs L&G Portfolio</p>
                </div>
                <div className="text-center p-6 border rounded-lg bg-orange-50">
                  <h3 className="text-lg font-bold mb-2">Secondary Data</h3>
                  <h4 className="text-3xl font-bold text-orange-600 mb-2">+5%</h4>
                  <p className="text-gray-600">vs L&G Portfolio</p>
                </div>
                <div className="text-center p-6 border rounded-lg bg-red-50">
                  <h3 className="text-lg font-bold mb-2">Estimated Data</h3>
                  <h4 className="text-3xl font-bold text-red-600 mb-2">+10%</h4>
                  <p className="text-gray-600">vs L&G Portfolio</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Data Quality Charts - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PCAF Score Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  PCAF Data Quality Score Comparison
                </CardTitle>
                <p className="text-sm text-gray-600">
                  PCAF data quality score comparison (Lower is better)
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PCAFScoreChart />
                </div>
              </CardContent>
            </Card>

            {/* Data Quality Sources Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Data Source Distribution Comparison
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Primary, secondary, and estimated data source percentages
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <DataQualityComparisonChart />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Root Cause Analysis Section - Added reasonable spacing */}
          <Card className="mt-72" style={{ marginTop: '120px' }}>
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">ROOT CAUSE ANALYSIS</CardTitle>
              <p className="text-gray-600 mb-4">
                I have undertaken the root cause analysis for this seemingly worse PCAF data quality. The root cause in this case is simply a greater proportion of the real estate equity and infrastructure (project finance) assets in the portfolio under assessment as compared to existing L&G portfolio.
              </p>
              <p className="text-gray-600 mb-4">
                On average PCAF data quality for real estate equity and infrastructure (project finance) is worse as a greater amount of data is sourced from secondary channels and/or estimated. When analyzed at the individual asset class level there are no material differences in PCAF data quality.
              </p>
              
              {/* Asset Class Analysis Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left">Portfolio Type</th>
                      <th className="border border-gray-300 p-3 text-center">Asset Class - Bond %</th>
                      <th className="border border-gray-300 p-3 text-center">Asset Class - Real Estate and Infrastructure %</th>
                      <th className="border border-gray-300 p-3 text-center">PCAF Data Quality Score - Bond</th>
                      <th className="border border-gray-300 p-3 text-center">PCAF Data Quality Score - Real Estate & Infrastructure</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">Investments Under Consideration</td>
                      <td className="border border-gray-300 p-3 text-center">82% (13 out of 18 assets)</td>
                      <td className="border border-gray-300 p-3 text-center">28% (5 out of 18 assets)</td>
                      <td className="border border-gray-300 p-3 text-center font-bold">2.2</td>
                      <td className="border border-gray-300 p-3 text-center font-bold">2.6</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">Existing L&G Portfolio</td>
                      <td className="border border-gray-300 p-3 text-center">90%</td>
                      <td className="border border-gray-300 p-3 text-center">10%</td>
                      <td className="border border-gray-300 p-3 text-center font-bold">2.2</td>
                      <td className="border border-gray-300 p-3 text-center font-bold">2.6</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardHeader>
          </Card>

          {/* Data Quality Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                PCAF Data Quality Score Distribution
              </CardTitle>
              <p className="text-sm text-gray-600">
                Data quality scores (1-5) across asset classes
              </p>
            </CardHeader>
            <CardContent>
              <DataQualityMetricsChart />
            </CardContent>
          </Card>

          {/* Individual Asset Data Quality */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">DETAILED ASSET LEVEL ANALYSIS</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Detailed data quality analysis at individual investment level can be found below:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left font-medium">Investment Name</th>
                      <th className="border border-gray-300 p-2 text-left font-medium">Sector</th>
                      <th className="border border-gray-300 p-2 text-left font-medium">Asset Class</th>
                      <th className="border border-gray-300 p-2 text-center font-medium">Investment Amount</th>
                      <th className="border border-gray-300 p-2 text-center font-medium">EVIC</th>
                      <th className="border border-gray-300 p-2 text-center font-medium">% Ownership</th>
                      <th className="border border-gray-300 p-2 text-center font-medium">PCAF Data Quality Score</th>
                      <th className="border border-gray-300 p-2 text-center font-medium">Primary Data</th>
                      <th className="border border-gray-300 p-2 text-center font-medium">Secondary Data</th>
                      <th className="border border-gray-300 p-2 text-center font-medium">Estimated Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Green Energy Solutions Ltd</td>
                      <td className="border border-gray-300 p-2">Energy</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£2.8m</td>
                      <td className="border border-gray-300 p-2 text-center">£140m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.0</td>
                      <td className="border border-gray-300 p-2 text-center">65%</td>
                      <td className="border border-gray-300 p-2 text-center">22%</td>
                      <td className="border border-gray-300 p-2 text-center">13%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Thames Utilities PLC</td>
                      <td className="border border-gray-300 p-2">Utilities</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£3.2m</td>
                      <td className="border border-gray-300 p-2 text-center">£160m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.2</td>
                      <td className="border border-gray-300 p-2 text-center">58%</td>
                      <td className="border border-gray-300 p-2 text-center">28%</td>
                      <td className="border border-gray-300 p-2 text-center">14%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Scottish Power Holdings</td>
                      <td className="border border-gray-300 p-2">Utilities</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£2.9m</td>
                      <td className="border border-gray-300 p-2 text-center">£145m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.1</td>
                      <td className="border border-gray-300 p-2 text-center">62%</td>
                      <td className="border border-gray-300 p-2 text-center">25%</td>
                      <td className="border border-gray-300 p-2 text-center">13%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">North Sea Energy Corp</td>
                      <td className="border border-gray-300 p-2">Energy</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£3.1m</td>
                      <td className="border border-gray-300 p-2 text-center">£155m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.2</td>
                      <td className="border border-gray-300 p-2 text-center">59%</td>
                      <td className="border border-gray-300 p-2 text-center">26%</td>
                      <td className="border border-gray-300 p-2 text-center">15%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Renewable Power UK Ltd</td>
                      <td className="border border-gray-300 p-2">Energy</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£2.7m</td>
                      <td className="border border-gray-300 p-2 text-center">£135m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.0</td>
                      <td className="border border-gray-300 p-2 text-center">63%</td>
                      <td className="border border-gray-300 p-2 text-center">24%</td>
                      <td className="border border-gray-300 p-2 text-center">13%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Offshore Wind Holdings</td>
                      <td className="border border-gray-300 p-2">Energy</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£3.3m</td>
                      <td className="border border-gray-300 p-2 text-center">£165m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.2</td>
                      <td className="border border-gray-300 p-2 text-center">57%</td>
                      <td className="border border-gray-300 p-2 text-center">27%</td>
                      <td className="border border-gray-300 p-2 text-center">16%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Advanced Materials Group</td>
                      <td className="border border-gray-300 p-2">Materials</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£1.8m</td>
                      <td className="border border-gray-300 p-2 text-center">£90m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.4</td>
                      <td className="border border-gray-300 p-2 text-center">55%</td>
                      <td className="border border-gray-300 p-2 text-center">29%</td>
                      <td className="border border-gray-300 p-2 text-center">16%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Sustainable Chemicals PLC</td>
                      <td className="border border-gray-300 p-2">Materials</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£1.9m</td>
                      <td className="border border-gray-300 p-2 text-center">£95m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.2</td>
                      <td className="border border-gray-300 p-2 text-center">61%</td>
                      <td className="border border-gray-300 p-2 text-center">24%</td>
                      <td className="border border-gray-300 p-2 text-center">15%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Green Building Materials</td>
                      <td className="border border-gray-300 p-2">Materials</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£2.0m</td>
                      <td className="border border-gray-300 p-2 text-center">£100m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.0</td>
                      <td className="border border-gray-300 p-2 text-center">64%</td>
                      <td className="border border-gray-300 p-2 text-center">23%</td>
                      <td className="border border-gray-300 p-2 text-center">13%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Circular Economy Corp</td>
                      <td className="border border-gray-300 p-2">Materials</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£1.7m</td>
                      <td className="border border-gray-300 p-2 text-center">£85m</td>
                      <td className="border border-gray-300 p-2 text-center">2.0%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.1</td>
                      <td className="border border-gray-300 p-2 text-center">60%</td>
                      <td className="border border-gray-300 p-2 text-center">26%</td>
                      <td className="border border-gray-300 p-2 text-center">14%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">UK Government Green Bond</td>
                      <td className="border border-gray-300 p-2">Government</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£4.5m</td>
                      <td className="border border-gray-300 p-2 text-center">£22.5b</td>
                      <td className="border border-gray-300 p-2 text-center">0.02%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.2</td>
                      <td className="border border-gray-300 p-2 text-center">68%</td>
                      <td className="border border-gray-300 p-2 text-center">22%</td>
                      <td className="border border-gray-300 p-2 text-center">10%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">UK Treasury Sustainability Bond</td>
                      <td className="border border-gray-300 p-2">Government</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£4.2m</td>
                      <td className="border border-gray-300 p-2 text-center">£21.0b</td>
                      <td className="border border-gray-300 p-2 text-center">0.02%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.2</td>
                      <td className="border border-gray-300 p-2 text-center">70%</td>
                      <td className="border border-gray-300 p-2 text-center">20%</td>
                      <td className="border border-gray-300 p-2 text-center">10%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">UK Infrastructure Bond</td>
                      <td className="border border-gray-300 p-2">Government</td>
                      <td className="border border-gray-300 p-2">Bond</td>
                      <td className="border border-gray-300 p-2 text-center">£3.8m</td>
                      <td className="border border-gray-300 p-2 text-center">£19.0b</td>
                      <td className="border border-gray-300 p-2 text-center">0.02%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">2.0</td>
                      <td className="border border-gray-300 p-2 text-center">66%</td>
                      <td className="border border-gray-300 p-2 text-center">23%</td>
                      <td className="border border-gray-300 p-2 text-center">11%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-blue-50">
                      <td className="border border-gray-300 p-2 font-semibold">Kings Cross Development Trust</td>
                      <td className="border border-gray-300 p-2">Materials</td>
                      <td className="border border-gray-300 p-2 font-semibold">Real Estate Equity</td>
                      <td className="border border-gray-300 p-2 text-center">£8.9m</td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">75%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold text-red-600">2.8</td>
                      <td className="border border-gray-300 p-2 text-center">52%</td>
                      <td className="border border-gray-300 p-2 text-center">30%</td>
                      <td className="border border-gray-300 p-2 text-center">18%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-blue-50">
                      <td className="border border-gray-300 p-2 font-semibold">Birmingham Green Energy Hub</td>
                      <td className="border border-gray-300 p-2">Materials</td>
                      <td className="border border-gray-300 p-2 font-semibold">Real Estate Equity</td>
                      <td className="border border-gray-300 p-2 text-center">£6.7m</td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">60%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold text-red-600">2.9</td>
                      <td className="border border-gray-300 p-2 text-center">48%</td>
                      <td className="border border-gray-300 p-2 text-center">32%</td>
                      <td className="border border-gray-300 p-2 text-center">20%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-blue-50">
                      <td className="border border-gray-300 p-2 font-semibold">Manchester Sustainable Housing</td>
                      <td className="border border-gray-300 p-2">Government</td>
                      <td className="border border-gray-300 p-2 font-semibold">Real Estate Equity</td>
                      <td className="border border-gray-300 p-2 text-center">£5.4m</td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">50%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold text-red-600">2.6</td>
                      <td className="border border-gray-300 p-2 text-center">55%</td>
                      <td className="border border-gray-300 p-2 text-center">28%</td>
                      <td className="border border-gray-300 p-2 text-center">17%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-orange-50">
                      <td className="border border-gray-300 p-2 font-semibold">North Sea Wind Farm Holdings</td>
                      <td className="border border-gray-300 p-2">Energy</td>
                      <td className="border border-gray-300 p-2 font-semibold">Infrastructure (Project Finance)</td>
                      <td className="border border-gray-300 p-2 text-center">£18.5m</td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">25%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold text-red-600">2.5</td>
                      <td className="border border-gray-300 p-2 text-center">58%</td>
                      <td className="border border-gray-300 p-2 text-center">25%</td>
                      <td className="border border-gray-300 p-2 text-center">17%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-orange-50">
                      <td className="border border-gray-300 p-2 font-semibold">Cornwall Solar Energy Trust</td>
                      <td className="border border-gray-300 p-2">Energy</td>
                      <td className="border border-gray-300 p-2 font-semibold">Infrastructure (Project Finance)</td>
                      <td className="border border-gray-300 p-2 text-center">£12.3m</td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">40%</td>
                      <td className="border border-gray-300 p-2 text-center font-bold text-red-600">2.8</td>
                      <td className="border border-gray-300 p-2 text-center">54%</td>
                      <td className="border border-gray-300 p-2 text-center">29%</td>
                      <td className="border border-gray-300 p-2 text-center">17%</td>
                    </tr>
                    <tr className="bg-gray-200 font-bold">
                      <td className="border border-gray-300 p-2">Total</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2 text-center">£89.7m</td>
                      <td className="border border-gray-300 p-2 text-center">£84.3b</td>
                      <td className="border border-gray-300 p-2 text-center">0.111%</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600 text-lg">2.6</td>
                      <td className="border border-gray-300 p-2 text-center">59%</td>
                      <td className="border border-gray-300 p-2 text-center">26%</td>
                      <td className="border border-gray-300 p-2 text-center">15%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Data Quality Process Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Process Summary</CardTitle>
              <p className="text-sm text-gray-600">
                Summary of data processing stages and corrections applied
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Process Stage</th>
                      <th className="text-right p-2 font-medium">Failed Mappings</th>
                      <th className="text-right p-2 font-medium">Successful Mappings</th>
                      <th className="text-right p-2 font-medium">Anomalies Detected</th>
                      <th className="text-right p-2 font-medium">Corrections Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2">Data Mapping</td>
                      <td className="p-2 text-right font-mono">12</td>
                      <td className="p-2 text-right font-mono">156</td>
                      <td className="p-2 text-right font-mono">8</td>
                      <td className="p-2 text-right font-mono">8</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2">Validation</td>
                      <td className="p-2 text-right font-mono">5</td>
                      <td className="p-2 text-right font-mono">163</td>
                      <td className="p-2 text-right font-mono">15</td>
                      <td className="p-2 text-right font-mono">12</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2">Imputation</td>
                      <td className="p-2 text-right font-mono">0</td>
                      <td className="p-2 text-right font-mono">168</td>
                      <td className="p-2 text-right font-mono">23</td>
                      <td className="p-2 text-right font-mono">20</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50 font-semibold bg-gray-50">
                      <td className="p-2">Total</td>
                      <td className="p-2 text-right font-mono">17</td>
                      <td className="p-2 text-right font-mono">487</td>
                      <td className="p-2 text-right font-mono">46</td>
                      <td className="p-2 text-right font-mono">40</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            ESG Financed Emissions Analysis • 
            <span className="font-medium"> 18 investments analyzed against L&G benchmarks</span>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Export Full Report
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Schedule Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
