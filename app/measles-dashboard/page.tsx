"use client";

import MeaslesDashboard from "@/components/measles-dashboard";
import { useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the dashboard with SSR disabled to prevent Leaflet errors
const DynamicMeaslesDashboard = dynamic(
  () => import("@/components/measles-dashboard"),
  { ssr: false }
);

export default function MeaslesDashboardPage() {
  // Add Leaflet CSS
  useEffect(() => {
    // Add Leaflet CSS
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    linkEl.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    linkEl.crossOrigin = "";
    document.head.appendChild(linkEl);

    return () => {
      document.head.removeChild(linkEl);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white py-4 px-6 border-b shadow-sm">
        <h1 className="text-xl font-semibold">Measles Dashboard - Test Page</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="h-[80vh] shadow-xl rounded-xl overflow-hidden">
          <DynamicMeaslesDashboard />
        </div>
      </main>
    </div>
  );
}
