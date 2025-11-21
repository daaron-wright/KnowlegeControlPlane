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

interface ESGDashboardProps {
  className?: string;
}

// Investment Portfolio Data - Enhanced with ESC Scope 3 Demo data
const INVESTMENT_PORTFOLIO = [
  { name: "Green Energy Solutions Ltd", sector: "Energy", assetClass: "Bond", carbonIntensity: 188, waci: 105, temp: 2.6 },
  { name: "Thames Utilities PLC", sector: "Utilities", assetClass: "Bond", carbonIntensity: 185, waci: 121, temp: 2.8 },
  { name: "Scottish Power Holdings", sector: "Utilities", assetClass: "Bond", carbonIntensity: 185, waci: 124, temp: 2.9 },
  { name: "North Sea Energy Corp", sector: "Energy", assetClass: "Bond", carbonIntensity: 188, waci: 104, temp: 2.5 },
  { name: "Renewable Power UK Ltd", sector: "Energy", assetClass: "Bond", carbonIntensity: 188, waci: 105, temp: 2.3 },
  { name: "Offshore Wind Holdings", sector: "Energy", assetClass: "Bond", carbonIntensity: 188, waci: 106, temp: 2.6 },
  { name: "Advanced Materials Group", sector: "Materials", assetClass: "Bond", carbonIntensity: 270, waci: 105, temp: 2.6 },
  { name: "Sustainable Chemicals PLC", sector: "Materials", assetClass: "Bond", carbonIntensity: 270, waci: 109, temp: 2.5 },
  { name: "Green Building Materials", sector: "Materials", assetClass: "Bond", carbonIntensity: 270, waci: 109, temp: 2.4 },
  { name: "Circular Economy Corp", sector: "Materials", assetClass: "Bond", carbonIntensity: 270, waci: 111, temp: 2.4 },
  { name: "UK Government Green Bond", sector: "Government", assetClass: "Bond", carbonIntensity: 82, waci: 99, temp: 2.2 },
  { name: "UK Treasury Sustainability Bond", sector: "Government", assetClass: "Bond", carbonIntensity: 82, waci: 98, temp: 2.5 },
  { name: "UK Infrastructure Bond", sector: "Government", assetClass: "Bond", carbonIntensity: 82, waci: 105, temp: 2.2 },
  { name: "UK Climate Transition Bond", sector: "Government", assetClass: "Bond", carbonIntensity: 82, waci: 104, temp: 2.5 },
  { name: "Kings Cross Development Trust", sector: "Materials", assetClass: "Real Estate Equity", carbonIntensity: 270, waci: 106, temp: 2.1 },
  { name: "Birmingham Green Energy Hub", sector: "Materials", assetClass: "Real Estate Equity", carbonIntensity: 270, waci: 110, temp: 2.4 },
  { name: "Manchester Sustainable Housing", sector: "Government", assetClass: "Real Estate Equity", carbonIntensity: 82, waci: 97, temp: 2.5 },
  { name: "North Sea Wind Farm Holdings", sector: "Energy", assetClass: "Infrastructure (Project Finance)", carbonIntensity: 188, waci: 112, temp: 2.4 },
  { name: "Cornwall Solar Energy Trust", sector: "Energy", assetClass: "Infrastructure (Project Finance)", carbonIntensity: 188, waci: 107, temp: 2.5 },
];

// Data Quality Sources
const DATA_QUALITY_SOURCES = {
  primary: 65,
  secondary: 25,
  estimated: 10
};

export default function ESGDashboard({ className }: ESGDashboardProps) {
  const [activeTab, setActiveTab] = useState("financed-emissions");
  const [showInvestmentsTable, setShowInvestmentsTable] = useState(true);

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ESG Portfolio Analysis Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive financed emissions analysis with interactive Excel-like interface. 
            Switch between tabs for detailed analysis and data quality assessment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            18 Investments
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Enhanced Analysis
          </Badge>
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
          {/* Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">SUMMARY</CardTitle>
              <p className="text-lg text-gray-700">
                <strong>Total estimated CO2 equivalent for the 18 investments is 180 tCO2E (compared to 4,900,000 tCO2e (2024 L&G Sustainability Report).</strong>
              </p>
            </CardHeader>
          </Card>

          {/* Key Metrics Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Key Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-center p-4 border border-gray-200">
                        <h3 className="text-lg font-bold">Carbon Intensity (tCO2e/£m)</h3>
                        <h4 className="text-xl font-bold text-green-600 mt-2">-7</h4>
                        <p className="text-sm mt-1">vs L&G Portfolio</p>
                      </th>
                      <th className="text-center p-4 border border-gray-200">
                        <h3 className="text-lg font-bold">Weighted Average Carbon Intensity (WACI)</h3>
                        <h4 className="text-xl font-bold text-green-600 mt-2">-12</h4>
                        <p className="text-sm mt-1">vs L&G Portfolio</p>
                      </th>
                      <th className="text-center p-4 border border-gray-200">
                        <h3 className="text-lg font-bold">Portfolio Temperature Alignment (C)</h3>
                        <h4 className="text-xl font-bold text-green-600 mt-2">-0.3</h4>
                        <p className="text-sm mt-1">vs L&G Portfolio</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border border-gray-200"></td>
                      <td className="p-4 border border-gray-200"></td>
                      <td className="p-4 border border-gray-200"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Portfolio Performance Comparison Chart</p>
                  <p className="text-sm text-gray-500">Carbon-New: 42, Carbon-L&G: 49, WACI-New: 105, WACI-L&G: 117, Temp-New: 2.5, Temp-L&G: 2.8</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-900 rounded"></div>
                  <span>Investments Under Consideration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span>Existing L&G Portfolio</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Conclusion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Overall Conclusion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-green-700">
                <strong>Conclusion: 18 additional investments are on whole more sustainable ('greener') than L&G's existing portfolio across all key metrics (Carbon Intensity (tCO2e/£m), Weighted Average Carbon Intensity (WACI), Portfolio Temperature Alignment ©)</strong>
              </p>
            </CardContent>
          </Card>

          {/* Asset Type Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">ASSET TYPE ANALYSIS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Performance Comparison */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Performance Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-center p-4 border border-gray-200">
                          <h3 className="text-lg font-bold">Carbon Intensity - Bond</h3>
                          <h4 className="text-xl font-bold text-green-600 mt-2">-3</h4>
                          <p className="text-sm mt-1">vs L&G Portfolio</p>
                          <h4 className="text-xl font-bold text-green-600 mt-2">-5</h4>
                          <p className="text-sm mt-1">vs External Benchmark</p>
                        </th>
                        <th className="text-center p-4 border border-gray-200">
                          <h3 className="text-lg font-bold">Carbon Intensity - Real Estate</h3>
                          <h4 className="text-xl font-bold text-green-600 mt-2">-2</h4>
                          <p className="text-sm mt-1">vs L&G Portfolio</p>
                          <h4 className="text-xl font-bold text-red-600 mt-2">+1</h4>
                          <p className="text-sm mt-1">vs External Benchmark</p>
                        </th>
                        <th className="text-center p-4 border border-gray-200">
                          <h3 className="text-lg font-bold">Carbon Intensity - Infrastructure</h3>
                          <h4 className="text-xl font-bold mt-2">0</h4>
                          <p className="text-sm mt-1">vs L&G Portfolio</p>
                          <h4 className="text-xl font-bold text-green-600 mt-2">-1</h4>
                          <p className="text-sm mt-1">vs External Benchmark</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 border border-gray-200"></td>
                        <td className="p-4 border border-gray-200"></td>
                        <td className="p-4 border border-gray-200"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Asset Type Comparison Chart */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Detailed Asset Type Comparison</h3>
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Asset Type Carbon Intensity Comparison (tCO2e/£m)</p>
                    <p className="text-sm text-gray-500">Bond: 52,55,57 | Real Estate: 7,9,6 | Infrastructure: 1,1,2</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-900 rounded"></div>
                    <span>Investments Under Consideration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span>Existing L&G Portfolio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-400 rounded"></div>
                    <span>External Benchmark</span>
                  </div>
                </div>
              </div>

              {/* Asset Type Conclusion */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Asset Type Conclusion</h3>
                <p className="text-lg font-semibold text-green-700">
                  <strong>Conclusion: 18 additional investments are less carbon intensive across all three asset classes than the existing L&G portfolio. Carbon intensity for proposed investment in real estate equity is still above the external benchmark.</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sector Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">SECTOR ANALYSIS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Carbon Intensity Comparison Header */}
              <div>
                <h3 className="text-xl font-semibold">Carbon Intensity Comparison - Investments Under Consideration vs Existing Portfolio</h3>
              </div>

              {/* Sector Performance Overview */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Sector Performance Overview</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-center p-4 border border-gray-200">
                          <h3 className="text-lg font-bold">Utilities</h3>
                          <h4 className="text-xl font-bold text-red-600 mt-2">+27</h4>
                          <p className="text-sm mt-1">vs L&G Portfolio</p>
                          <h4 className="text-xl font-bold text-red-600 mt-2">+15</h4>
                          <p className="text-sm mt-1">vs External Benchmark</p>
                        </th>
                        <th className="text-center p-4 border border-gray-200">
                          <h3 className="text-lg font-bold">Energy</h3>
                          <h4 className="text-xl font-bold text-green-600 mt-2">-4</h4>
                          <p className="text-sm mt-1">vs L&G Portfolio</p>
                          <h4 className="text-xl font-bold text-green-600 mt-2">-8</h4>
                          <p className="text-sm mt-1">vs External Benchmark</p>
                        </th>
                        <th className="text-center p-4 border border-gray-200">
                          <h3 className="text-lg font-bold">Materials</h3>
                          <h4 className="text-xl font-bold text-green-600 mt-2">-20</h4>
                          <p className="text-sm mt-1">vs L&G Portfolio</p>
                          <h4 className="text-xl font-bold text-green-600 mt-2">-12</h4>
                          <p className="text-sm mt-1">vs External Benchmark</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 border border-gray-200"></td>
                        <td className="p-4 border border-gray-200"></td>
                        <td className="p-4 border border-gray-200"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Sector Carbon Intensity Chart */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Detailed Sector Carbon Intensity</h3>
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Carbon Intensity by Sector (tCO2e/£m)</p>
                    <p className="text-sm text-gray-500">Utilities: 185,158 | Energy: 188,192 | Materials: 270,290 | Government: 82,83</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-900 rounded"></div>
                    <span>Odd bars (1st, 3rd, 5th, 7th): Investments Under Consideration (New)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span>Even bars (2nd, 4th, 6th, 8th): Existing L&G Portfolio</span>
                  </div>
                </div>
              </div>

              {/* Sector Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-3 text-left font-medium">Sector</th>
                      <th className="border border-gray-200 p-3 text-right font-medium">Investments Under Consideration (tCO2e/£m)</th>
                      <th className="border border-gray-200 p-3 text-right font-medium">Existing L&G Portfolio (tCO2e/£m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3">Utilities</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">185</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">158</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3">Energy</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">188</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">192</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3">Materials</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">270</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">290</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3">Industrial</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">No Investments in this sector</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">50</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3">Government</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">82</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">83</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3">Other</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">No Investments in this sector</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">14</td>
                    </tr>
                    <tr className="bg-gray-100 font-bold">
                      <td className="border border-gray-200 p-3">Total</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">42</td>
                      <td className="border border-gray-200 p-3 text-right font-mono">49</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Sector Analysis Conclusion */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Sector Analysis Conclusion</h3>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-amber-700">
                    <strong>Conclusion: 18 additional investments are less carbon intensive than the existing portfolio apart from the proposed investment in the utilities sector which are more carbon intensive. investments in this sector</strong>
                  </p>
                  <p className="text-lg font-semibold text-red-600">
                    <strong>Please consider alternative investment strategy</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">DETAILED ANALYSIS</CardTitle>
              <p className="text-gray-600">Detailed analysis at individual investment level can be found below</p>
            </CardHeader>
            <CardContent>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Individual Investment Breakdown</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export CSV
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-3 text-left font-medium">Investment Name</th>
                        <th className="border border-gray-200 p-3 text-left font-medium">Sector</th>
                        <th className="border border-gray-200 p-3 text-left font-medium">Asset Class</th>
                        <th className="border border-gray-200 p-3 text-right font-medium">Carbon Intensity (tCO2e/£m)</th>
                        <th className="border border-gray-200 p-3 text-right font-medium">Weighted Average Carbon Intensity (WACI)</th>
                        <th className="border border-gray-200 p-3 text-right font-medium">Portfolio Temperature Alignment (C)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INVESTMENT_PORTFOLIO.map((investment, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-200 p-3">{investment.name}</td>
                          <td className="border border-gray-200 p-3">{investment.sector}</td>
                          <td className="border border-gray-200 p-3">{investment.assetClass}</td>
                          <td className="border border-gray-200 p-3 text-right font-mono">{investment.carbonIntensity}</td>
                          <td className="border border-gray-200 p-3 text-right font-mono">{investment.waci}</td>
                          <td className="border border-gray-200 p-3 text-right font-mono">{investment.temp}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-bold">
                        <td className="border border-gray-200 p-3" colSpan={3}>Total</td>
                        <td className="border border-gray-200 p-3 text-right font-mono">42</td>
                        <td className="border border-gray-200 p-3 text-right font-mono">105</td>
                        <td className="border border-gray-200 p-3 text-right font-mono">2.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Data Quality Assessment */}
        <TabsContent value="data-quality" className="space-y-6">
          {/* Data Quality KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-sm font-medium text-gray-600">PCAF Score</p>
                    <p className="text-2xl font-bold text-gray-900">2.4</p>
                    <p className="text-xs text-red-600">vs L&G 2.3</p>
                  </div>
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Primary Data</p>
                    <p className="text-2xl font-bold text-gray-900">{DATA_QUALITY_SOURCES.primary}%</p>
                    <p className="text-xs text-green-600">High quality</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Secondary Data</p>
                    <p className="text-2xl font-bold text-gray-900">{DATA_QUALITY_SOURCES.secondary}%</p>
                    <p className="text-xs text-yellow-600">Medium quality</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estimated Data</p>
                    <p className="text-2xl font-bold text-gray-900">{DATA_QUALITY_SOURCES.estimated}%</p>
                    <p className="text-xs text-orange-600">Needs attention</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Quality Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Sources Distribution</CardTitle>
              <p className="text-sm text-gray-600">Breakdown of data source quality for the 18 investments</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Primary Sources (Highest Quality)</span>
                  <span className="text-sm text-gray-600">{DATA_QUALITY_SOURCES.primary}%</span>
                </div>
                <Progress value={DATA_QUALITY_SOURCES.primary} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Secondary Sources (Medium Quality)</span>
                  <span className="text-sm text-gray-600">{DATA_QUALITY_SOURCES.secondary}%</span>
                </div>
                <Progress value={DATA_QUALITY_SOURCES.secondary} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Estimated Data (Lowest Quality)</span>
                  <span className="text-sm text-gray-600">{DATA_QUALITY_SOURCES.estimated}%</span>
                </div>
                <Progress value={DATA_QUALITY_SOURCES.estimated} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
