"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useMapContext } from "./map-context";
import dynamic from "next/dynamic";
import {
  mockRegions,
  mockCases,
  mockVaccinationCenters,
} from "@/lib/measles/uae-mock-data";

// Dynamically import the timeline component
const SimpleTimeline = dynamic(() => import("./simple-timeline"), {
  ssr: false,
});

// Dynamically import Leaflet components to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-lg text-gray-600">Loading map...</div>
    </div>
  ),
});

export default function MeaslesMap() {
  const {
    showRiskHeatmap,
    setShowRiskHeatmap,
    showVaccinationHeatmap,
    setShowVaccinationHeatmap,
    selectedRegion,
    setSelectedRegion,
    activeDataPoint,
    setActiveDataPoint,
  } = useMapContext();

  const [timelineValue, setTimelineValue] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // Default to 1 second per step

  // Filter data based on timeline value (simulating timeline-based filtering)
  const visibleCases = useMemo(() => {
    return mockCases.filter((c) => c.timeline <= timelineValue);
  }, [timelineValue]);

  // Memoize static props that don't change
  const staticMapProps = useMemo(
    () => ({
      center: [24.4539, 54.3773] as [number, number],
      zoom: 7,
      regions: mockRegions,
      vaccinationCenters: mockVaccinationCenters,
      showRiskHeatmap,
      showVaccinationHeatmap,
      selectedRegion,
      onRegionSelect: setSelectedRegion,
      onMarkerSelect: setActiveDataPoint,
    }),
    [
      showRiskHeatmap,
      showVaccinationHeatmap,
      selectedRegion,
      setSelectedRegion,
      setActiveDataPoint,
    ]
  );

  // Format a simple label for display
  const formatTimelineLabel = (value: number) => `Day ${value + 1}`;

  // Handle timeline value change
  const handleTimelineChange = (value: number) => {
    setTimelineValue(value);
  };

  return (
    <div className="w-full h-full relative bg-gray-100">
      {/* Map area */}
      <div className="w-full h-full" style={{ minHeight: "500px" }}>
        <LeafletMap {...staticMapProps} cases={visibleCases} />
      </div>

      {/* Timeline control at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gold/30 py-2 px-3 z-10">
        <SimpleTimeline
          value={timelineValue}
          onChange={handleTimelineChange}
          min={0}
          max={10}
          step={1}
          initialPlaybackSpeed={playbackSpeed}
          labels={Array.from({ length: 11 }, (_, i) => formatTimelineLabel(i))}
        />
      </div>
    </div>
  );
}
