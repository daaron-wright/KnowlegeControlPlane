"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

export function ABTestingSimulation() {
  const bundleVariants = [
    {
      id: "A",
      name: "School Uniform Complete Bundle",
      items: ["Uniform Shirt", "Trousers", "Shoes", "Pencil Case"],
      price: "£45.99",
      discount: "15%",
      cvr: 13.2,
      lift: "+13%",
      marginImpact: "+8.4%",
      riskScore: "Low",
      revenue: "£186K",
      recommendation: "Deploy to Emily's segment"
    },
    {
      id: "B", 
      name: "Electronics Power Bundle",
      items: ["Tablet", "Headphones", "Screen Protector", "Bag"],
      price: "£129.99",
      discount: "10%",
      cvr: 7.8,
      lift: "+7%",
      marginImpact: "-2.1%",
      riskScore: "High",
      revenue: "£94K",
      recommendation: "Exclude from <£90 baskets"
    },
    {
      id: "C",
      name: "Stationery Essentials",
      items: ["Notebook Set", "Pens", "Calculator", "Ruler"],
      price: "£18.99",
      discount: "20%",
      cvr: 11.5,
      lift: "+11%",
      marginImpact: "+5.2%",
      riskScore: "Medium",
      revenue: "£127K",
      recommendation: "Test with free delivery"
    },
    {
      id: "D",
      name: "Children's Outfit Bundle",
      items: ["T-Shirt", "Jeans", "Socks", "Underwear"],
      price: "£32.99", 
      discount: "12%",
      cvr: 9.4,
      lift: "+9%",
      marginImpact: "+3.8%",
      riskScore: "Low",
      revenue: "£158K",
      recommendation: "Scale to similar segments"
    }
  ];

  const testResults = {
    winner: "Bundle A",
    confidence: 95,
    testDuration: "14 days",
    sampleSize: "2,847 customers",
    significantLift: true
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100"; 
      case "High": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getMarginColor = (margin: string) => {
    return margin.startsWith("+") ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Test Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">🏆 Current Test Winner: {testResults.winner}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{testResults.confidence}%</p>
              <p className="text-sm text-gray-600">Confidence</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{testResults.testDuration}</p>
              <p className="text-sm text-gray-600">Test Duration</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{testResults.sampleSize}</p>
              <p className="text-sm text-gray-600">Sample Size</p>
            </div>
            <div className="text-center">
              <Badge className="bg-green-500 text-white">Significant</Badge>
              <p className="text-sm text-gray-600 mt-1">Statistical Power</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bundle Variants Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Bundle Variant Performance</CardTitle>
          <p className="text-gray-600">Conversion rates, margin impact, and risk assessment</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bundleVariants.map((bundle) => (
              <div key={bundle.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-bold">
                        Bundle {bundle.id}
                      </Badge>
                      <h3 className="font-semibold text-lg">{bundle.name}</h3>
                      <Badge className={getRiskColor(bundle.riskScore)}>
                        {bundle.riskScore} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Items: {bundle.items.join(" • ")}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">{bundle.price}</span>
                      <span className="text-green-600 ml-2">({bundle.discount} off)</span>
                    </p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-2xl font-bold">{bundle.revenue}</p>
                    <p className="text-sm text-gray-600">Projected Revenue</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Conversion Rate</span>
                      <span className="font-bold">{bundle.cvr}% {bundle.lift}</span>
                    </div>
                    <Progress value={bundle.cvr * 5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Margin Impact</span>
                      <span className={`font-bold ${getMarginColor(bundle.marginImpact)}`}>
                        {bundle.marginImpact}
                      </span>
                    </div>
                    <Progress 
                      value={Math.abs(parseFloat(bundle.marginImpact.replace('%', ''))) * 10} 
                      className="h-2" 
                    />
                  </div>
                  <div className="flex items-center">
                    {bundle.riskScore === "Low" && (
                      <Button className="bg-green-600 hover:bg-green-700 w-full" size="sm">
                        Deploy
                      </Button>
                    )}
                    {bundle.riskScore === "Medium" && (
                      <Button variant="outline" className="w-full" size="sm">
                        Test Further
                      </Button>
                    )}
                    {bundle.riskScore === "High" && (
                      <Button variant="destructive" className="w-full" size="sm">
                        Review
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <span className="font-medium">Recommendation:</span> {bundle.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>✅ Winning Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-semibold text-green-800 mb-2">Bundle A - School Uniform</h4>
                <ul className="text-sm space-y-1">
                  <li>• 13% higher conversion rate</li>
                  <li>• 8.4% margin improvement</li>
                  <li>• Perfect for Emily's back-to-school shopping</li>
                  <li>• Low risk, high confidence</li>
                </ul>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Deploy to Emily Segment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚠️ Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h4 className="font-semibold text-red-800 mb-2">Bundle B - Electronics</h4>
                <ul className="text-sm space-y-1">
                  <li>• Only 7% conversion lift</li>
                  <li>• 2.1% margin reduction</li>
                  <li>• High price point risk</li>
                  <li>• Exclude from low-value baskets</li>
                </ul>
              </div>
              <Button variant="destructive" className="w-full">
                Disable for &lt;£90 Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 