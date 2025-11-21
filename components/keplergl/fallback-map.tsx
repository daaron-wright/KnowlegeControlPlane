"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);

interface FallbackMapProps {
  datasets: any[];
  mapboxApiAccessToken: string;
}

interface CasePoint {
  lat: number;
  lng: number;
  location: string;
  cases: number;
  date: string;
}

interface VaccinationPoint {
  lat: number;
  lng: number;
  name: string;
  capacity: number;
}

const FallbackMap: React.FC<FallbackMapProps> = ({ datasets }) => {
  // Fix Leaflet icon issues when loading on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Dynamically import marker setup to fix Leaflet's default icon issue
      import("./marker-setup");
    }
  }, []);

  // Extract case data points
  const caseDataset = datasets.find((d) => d.info.id === "cases");
  const vaccinationDataset = datasets.find((d) => d.info.id === "vaccination");

  // Extract case data points
  const casePoints = caseDataset
    ? caseDataset.data.rows.map(
        (row: any[], i: number): CasePoint => ({
          lat: row[0],
          lng: row[1],
          location: row[2],
          cases: row[3],
          date: row[4],
        })
      )
    : [];

  // Extract vaccination centers
  const vaccinationPoints = vaccinationDataset
    ? vaccinationDataset.data.rows.map(
        (row: any[], i: number): VaccinationPoint => ({
          lat: row[0],
          lng: row[1],
          name: row[2],
          capacity: row[3],
        })
      )
    : [];

  return (
    <div className="h-full w-full">
      {typeof window !== "undefined" && (
        <MapContainer
          center={[24.4539, 54.3773]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Render case data points */}
          {casePoints.map((point: CasePoint, index: number) => (
            <CircleMarker
              key={`case-${index}`}
              center={[point.lat, point.lng]}
              radius={Math.min(20, Math.max(5, point.cases / 2))}
              pathOptions={{
                fillColor: "#ff0000",
                color: "#ff0000",
                fillOpacity: 0.6,
                weight: 1,
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{point.location}</h3>
                  <p>Cases: {point.cases}</p>
                  <p>Date: {new Date(point.date).toLocaleDateString()}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Render vaccination centers */}
          {vaccinationPoints.map((point: VaccinationPoint, index: number) => (
            <Marker key={`vac-${index}`} position={[point.lat, point.lng]}>
              <Popup>
                <div>
                  <h3 className="font-bold">{point.name}</h3>
                  <p>Daily Capacity: {point.capacity}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default FallbackMap;
