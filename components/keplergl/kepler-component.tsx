"use client";

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./kepler-styles.css";
import dynamic from "next/dynamic";

const FallbackMap = dynamic(() => import("./fallback-map"), {
  ssr: false,
});

interface KeplerGlComponentProps {
  datasets: any[];
  config: any;
  mapboxApiAccessToken: string;
  width: string | number;
  height: string | number;
}

// This component will only be loaded on the client side
const KeplerGlComponent: React.FC<KeplerGlComponentProps> = ({
  datasets,
  config,
  mapboxApiAccessToken,
  width,
  height,
}) => {
  const [isKeplerLoaded, setIsKeplerLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Load Kepler.gl and render it directly to avoid Next.js issues
  useEffect(() => {
    // Skip rendering on server
    if (typeof window === "undefined") return;

    // Only load once
    if (isKeplerLoaded || hasFailed) return;

    const loadAndRenderKepler = async () => {
      try {
        // Import required modules
        const redux = await import("redux");
        const { Provider } = await import("react-redux");
        const { taskMiddleware } = await import("react-palm/tasks");

        // Import Kepler modules
        // We need to use a dynamic import with a fully resolved path
        const KeplerGl = (await import("kepler.gl")).default;

        // Try different paths for importing actions and reducers
        let addDataToMap, keplerGlReducer;

        try {
          // Try the dist path first
          const actions = await import("kepler.gl/dist/actions");
          const reducers = await import("kepler.gl/dist/reducers");
          addDataToMap = actions.addDataToMap;
          keplerGlReducer = reducers.keplerGlReducer;
        } catch (e) {
          // Fallback to the regular path
          const actions = await import("kepler.gl/actions");
          const reducers = await import("kepler.gl/reducers");
          addDataToMap = actions.addDataToMap;
          keplerGlReducer = reducers.keplerGlReducer;
        }

        // Create the reducer
        const rootReducer = redux.combineReducers({
          keplerGl: keplerGlReducer,
        });

        // Create the store
        const store = redux.createStore(
          rootReducer,
          {},
          redux.applyMiddleware(taskMiddleware)
        );

        // Add data to the map
        store.dispatch(
          addDataToMap({
            datasets,
            config,
            options: {
              centerMap: true,
              readOnly: false,
            },
          })
        );

        // Make sure container exists
        if (containerRef.current) {
          // Create a root for React 18
          const root = createRoot(containerRef.current);

          // Render Kepler.gl
          root.render(
            <Provider store={store}>
              <KeplerGl
                id="map"
                mapboxApiAccessToken={mapboxApiAccessToken}
                width={width}
                height={height}
              />
            </Provider>
          );

          setIsKeplerLoaded(true);
        }
      } catch (error) {
        console.error("Error loading Kepler.gl:", error);
        setHasFailed(true);
      }
    };

    loadAndRenderKepler();

    // Set a timeout to load the fallback map if Kepler fails
    const timeout = setTimeout(() => {
      if (!isKeplerLoaded) {
        console.log(
          "Kepler.gl is taking too long to load, switching to fallback map"
        );
        setHasFailed(true);
      }
    }, 10000); // 10 seconds timeout

    // Cleanup function
    return () => {
      clearTimeout(timeout);
    };
  }, [
    datasets,
    config,
    mapboxApiAccessToken,
    width,
    height,
    isKeplerLoaded,
    hasFailed,
  ]);

  // If Kepler failed to load, show the fallback map
  if (hasFailed) {
    return (
      <FallbackMap
        datasets={datasets}
        mapboxApiAccessToken={mapboxApiAccessToken}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ position: "relative" }}
    >
      {!isKeplerLoaded && !hasFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-600 text-lg">Loading Kepler.gl map...</div>
        </div>
      )}
    </div>
  );
};

export default KeplerGlComponent;
