"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";

// Helper component to set map view
function MapViewSetter({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
      // Force a resize event to ensure map renders correctly
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [map, center, zoom]);

  return null;
}

// Create custom icons for markers
const createIcon = (color: string, size = 10) => {
  return new DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; box-shadow: 0 0 0 2px #fff;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Define the props interface for the map component
interface MapComponentProps {
  defaultCenter: [number, number];
  defaultZoom: number;
  regions: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    risk: string;
    cases: number;
  }>;
  cases: Array<{
    id: string;
    lat: number;
    lng: number;
    confirmed: boolean;
    active: boolean;
    age: number;
    timeline: number;
  }>;
  vaccinationCenters: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: string;
    dailyCapacity: number;
  }>;
  showRiskHeatmap: boolean;
  showVaccinationHeatmap: boolean;
  selectedRegion: string | null;
  onRegionClick: (region: string) => void;
  onMarkerClick: (point: any) => void;
}

export default function MapComponent({
  defaultCenter,
  defaultZoom,
  regions,
  cases,
  vaccinationCenters,
  showRiskHeatmap,
  showVaccinationHeatmap,
  selectedRegion,
  onRegionClick,
  onMarkerClick,
}: MapComponentProps) {
  // Use a ref for the container element to ensure stability
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Use a state to control when to render the map
  const [shouldRenderMap, setShouldRenderMap] = useState(false);
  // Unique ID for this map instance
  const mapId = useRef(`map-${Math.random().toString(36).substring(2, 9)}`);

  // Add effect to load Leaflet CSS and prepare map container
  useEffect(() => {
    // Ensure Leaflet CSS is loaded
    const linkEl = document.querySelector('link[href*="leaflet.css"]');
    if (!linkEl) {
      const newLinkEl = document.createElement("link");
      newLinkEl.rel = "stylesheet";
      newLinkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(newLinkEl);
    }

    // Clean up any previous Leaflet instances
    if (mapContainerRef.current) {
      // Remove any existing Leaflet container classes
      mapContainerRef.current.classList.remove("leaflet-container");

      // Clean up all child elements
      while (mapContainerRef.current.firstChild) {
        mapContainerRef.current.removeChild(mapContainerRef.current.firstChild);
      }
    }

    // Delay rendering map to ensure DOM is ready and previous instances are cleaned up
    const timer = setTimeout(() => {
      setShouldRenderMap(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      setShouldRenderMap(false);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Final cleanup when component unmounts
      if (mapContainerRef.current) {
        // Remove classes and children
        mapContainerRef.current.classList.remove("leaflet-container");
        mapContainerRef.current.classList.remove("leaflet-touch");
        mapContainerRef.current.classList.remove("leaflet-fade-anim");

        while (mapContainerRef.current.firstChild) {
          mapContainerRef.current.removeChild(
            mapContainerRef.current.firstChild
          );
        }

        // Clear any Leaflet-related data attributes
        const attrs = mapContainerRef.current.attributes;
        for (let i = attrs.length - 1; i >= 0; i--) {
          const name = attrs[i].name;
          if (name.startsWith("data-leaflet")) {
            mapContainerRef.current.removeAttribute(name);
          }
        }
      }

      // Try to clean up any global Leaflet state
      try {
        if (window && window.L) {
          // Don't attempt to access specific properties that TypeScript doesn't know about
          // Just log that we're cleaning up
          console.log("Cleaning up Leaflet global state");
        }
      } catch (e) {
        // Ignore any errors in cleanup
      }
    };
  }, []);

  if (!shouldRenderMap) {
    return (
      <div
        ref={mapContainerRef}
        className="w-full h-full flex items-center justify-center bg-gray-100"
        id={mapId.current}
      >
        <div className="text-lg font-medium text-gray-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div ref={mapContainerRef} className="w-full h-full" id={mapId.current}>
      <MapContainer
        key={mapId.current}
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewSetter center={defaultCenter} zoom={defaultZoom} />

        {/* Render region markers */}
        {regions.map((region) => (
          <Marker
            key={region.id}
            position={[region.lat, region.lng]}
            icon={createIcon(
              region.id === selectedRegion ? "rgb(234, 179, 8)" : "#4b5563",
              12
            )}
            eventHandlers={{
              click: () => onRegionClick(region.id),
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold text-sm">{region.name}</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Risk Level:{" "}
                  <span className="font-medium text-red-600">
                    {region.risk}
                  </span>
                </p>
                {region.cases && (
                  <p className="text-xs text-gray-600">
                    Cases: <span className="font-medium">{region.cases}</span>
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render case markers */}
        {showRiskHeatmap &&
          cases.map((casePoint) => (
            <Marker
              key={casePoint.id}
              position={[casePoint.lat, casePoint.lng]}
              icon={createIcon(casePoint.confirmed ? "#ef4444" : "#fb923c", 8)}
              eventHandlers={{
                click: () => onMarkerClick(casePoint),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-semibold text-xs">
                    {casePoint.confirmed ? "Confirmed Case" : "Suspected Case"}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        casePoint.active ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {casePoint.active ? "Active" : "Recovered"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600">
                    Age: <span className="font-medium">{casePoint.age}</span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Render vaccination centers */}
        {showVaccinationHeatmap &&
          vaccinationCenters.map((center) => (
            <Marker
              key={center.id}
              position={[center.lat, center.lng]}
              icon={createIcon("#3b82f6", 8)}
              eventHandlers={{
                click: () => onMarkerClick(center),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-semibold text-xs">{center.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Type: <span className="font-medium">{center.type}</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    Daily Capacity:{" "}
                    <span className="font-medium">{center.dailyCapacity}</span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
