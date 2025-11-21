"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useMapContext } from "./map-context";
import dynamic from "next/dynamic";
import {
  mockRegions,
  mockCases,
  mockVaccinationCenters,
  uaeCaseData,
} from "@/lib/measles/uae-mock-data";

// Create a type definition for the props without importing
interface MapWrapperProps {
  cases: Array<{
    lat: number;
    lng: number;
    location: string;
    cases: number;
    date: string;
  }>;
  vaccinationCenters: Array<{
    id: string;
    name: string;
    position: [number, number];
    capacity: number;
  }>;
  showRiskHeatmap: boolean;
  showVaccinationHeatmap: boolean;
  selectedRegion: string | null;
  setSelectedRegion: (region: string | null) => void;
  setActiveDataPoint: (point: any) => void;
  mapId: string;
}

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Load Leaflet MapContainer only on client-side with absolute path
const MapComponent = dynamic(() => import("../measles-dashboard/map-wrapper"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-lg text-gray-600">Loading map...</div>
    </div>
  ),
});

function EnhancedMap() {
  const {
    selectedRegion,
    setSelectedRegion,
    activeDataPoint,
    setActiveDataPoint,
    showRiskHeatmap,
    showVaccinationHeatmap,
  } = useMapContext();

  const [timeValue, setTimeValue] = useState(0);
  const mapInstanceRef = useRef<string | null>(null);

  // Filter cases data based on time value
  const filteredCases = useMemo(() => {
    return uaeCaseData.filter((_, index) => {
      // Simple filter to simulate timeline filtering
      return index <= (uaeCaseData.length * timeValue) / 10;
    });
  }, [timeValue]);

  // Format vaccination centers with proper icon
  const vaccinationCenters = useMemo(() => {
    return mockVaccinationCenters.map((center) => ({
      id: center.id,
      name: center.name,
      position: [center.lat, center.lng] as [number, number],
      capacity: center.dailyCapacity,
    }));
  }, []);

  // Update time value to simulate time progression
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(Number(e.target.value));
  };

  // Generate map instance ID once to ensure stability
  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = `map-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
    }
  }, []);

  // Prepare props for the map component
  const mapProps: MapWrapperProps = {
    cases: filteredCases,
    vaccinationCenters,
    showRiskHeatmap,
    showVaccinationHeatmap,
    selectedRegion,
    setSelectedRegion,
    setActiveDataPoint,
    mapId: mapInstanceRef.current || "map-instance",
  };

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full">
        <MapComponent {...mapProps} />
      </div>

      {/* Timeline control */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-20 w-4/5 max-w-md">
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={timeValue}
          onChange={handleTimeChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-1 px-1">
          <span>Jan 2025</span>
          <span>Jun 2025</span>
          <span>Dec 2025</span>
        </div>
      </div>
    </div>
  );
}

export default EnhancedMap;
