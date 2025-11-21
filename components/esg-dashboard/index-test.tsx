"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Download, Eye, EyeOff } from "lucide-react";

interface ESGDashboardProps {
  className?: string;
}

export default function ESGDashboard({ className }: ESGDashboardProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">ESG Portfolio Analytics Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">
          Test version to check compilation
        </p>
      </div>

      {/* Simple KPI */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total AUM</p>
                <p className="text-2xl font-bold text-gray-900">$116.2M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ESG Score</p>
                <p className="text-2xl font-bold text-gray-900">78.4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Toggle */}
      <div>
        <Button
          variant={showTable ? "default" : "outline"}
          size="sm"
          onClick={() => setShowTable(!showTable)}
        >
          {showTable ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
          Investment Holdings
        </Button>
      </div>

      {/* Simple Table */}
      {showTable && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Test Table</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Test Investment</td>
                    <td className="p-2">$1,000,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
