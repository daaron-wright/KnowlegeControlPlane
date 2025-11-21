"use client";

import React from "react";

// Mock 3D DAG component for demo mode - avoids Three.js dependency issues
const Mock3DDAG = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          3D M2M DAG Visualization
        </h3>
        
        <div className="max-w-md mx-auto text-gray-600 space-y-3">
          <p className="text-lg">
            <strong>Demo Mode:</strong> 3D visualization temporarily disabled
          </p>
          <p className="text-sm">
            This component normally displays an interactive 3D graph showing:
          </p>
          <ul className="text-sm text-left space-y-1 mt-4">
            <li>• Machine-to-Machine communication flows</li>
            <li>• Real-time data streaming connections</li>
            <li>• Network topology and device relationships</li>
            <li>• Interactive node exploration</li>
          </ul>
        </div>
        
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-blue-200">
          <p className="text-sm text-blue-700">
            💡 <strong>Note:</strong> The full 3D visualization is available when running with all dependencies installed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mock3DDAG;
