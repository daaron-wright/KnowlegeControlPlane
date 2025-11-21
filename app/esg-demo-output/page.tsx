import React from 'react';
import { ESGDemoWorkbook } from '../../components/esg-demo';

export default function ESGDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ESG Scope 3 Demo - Interactive Report
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive financed emissions analysis with interactive Excel-like interface. 
            This report demonstrates the output of our enhanced data validation workflow 
            implementing PCAF Category 15 methodology.
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Demo Features</h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Tab Navigation:</strong> Switch between Financed Emissions Analysis and Data Quality Assessment</li>
            <li>• <strong>Excel-like Styling:</strong> Familiar interface with professional table formatting</li>
            <li>• <strong>Interactive Elements:</strong> Hover effects, quality badges, and summary cards</li>
            <li>• <strong>Responsive Design:</strong> Adapts to different screen sizes</li>
          </ul>
        </div>

        {/* Main ESG Workbook Component */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ESGDemoWorkbook />
        </div>

        {/* Technical Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Technical Implementation</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>Framework:</strong> React with TypeScript</li>
              <li>• <strong>Styling:</strong> CSS-in-JS with Excel-inspired theme</li>
              <li>• <strong>Data Structure:</strong> Structured JSON replacing HTML content</li>
              <li>• <strong>Components:</strong> Modular sheet renderers</li>
              <li>• <strong>State Management:</strong> React hooks for tab navigation</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>Internal Portfolio DB:</strong> Investment values and holdings</li>
              <li>• <strong>CDP Climate Data:</strong> Company emissions reporting</li>
              <li>• <strong>Bloomberg ESG:</strong> Financial and ESG metrics</li>
              <li>• <strong>Refinitiv ESG:</strong> Supplementary emissions data</li>
              <li>• <strong>Annual Reports:</strong> Manual data extraction</li>
            </ul>
          </div>
        </div>

        {/* Integration Notes */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Integration with DAG Workflow</h3>
          <p className="text-sm text-green-800">
            This interactive report represents the final output of our comprehensive 11-node Stage 3 validation workflow. 
            The data shown here has been processed through parallel data ingestion (S1A, S1B), systematic quality analysis (V2, V3), 
            reporting (S4), proxy application (S5), and multi-stakeholder review (S6A-S6E) before final consolidation.
          </p>
        </div>
      </div>
    </div>
  );
}
