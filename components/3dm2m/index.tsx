"use client";

import React, { useState, useEffect, ErrorInfo } from "react";
import dynamic from "next/dynamic";
import {
  AccessibilityCheck,
  ThreeDAccessibility,
} from "./components/accessibility";

// Loading component that shows while DAG is initializing
const LoadingIndicator = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-[#F5A623] mb-6"></div>
    <div className="text-gray-800 text-xl font-medium">
      Initializing 3D environment...
    </div>
    <div className="text-gray-500 mt-2">Preparing visualization</div>
  </div>
);

// Error component
const ErrorDisplay = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-6">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Visualization Error
      </h2>
      <p className="mb-4 text-gray-700">
        Sorry, we encountered an error loading the 3D visualization.
      </p>
      <pre className="bg-gray-100 p-3 rounded text-xs text-left overflow-auto max-h-32 mb-4">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Simple error boundary
class ThreeDErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ThreeDimensionalDAG error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Dynamically import the visualization component
const DAGVisualization = dynamic(() => import("./dag-visualization"), {
  ssr: false,
  loading: () => <LoadingIndicator />,
});

/**
 * Main 3D M2M Visualization Component
 * Renders the 3D DAG visualization with accessibility support
 */
export default function ThreeDimensionalDAG() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasWebGLSupport, setHasWebGLSupport] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Apply cleanup for SVG icons
  useEffect(() => {
    // Forcefully remove any X SVG icons after a short delay
    const removeTimer = setTimeout(() => {
      document.querySelectorAll("svg.lucide-x").forEach((element) => {
        element.remove();
      });
    }, 100);

    return () => clearTimeout(removeTimer);
  }, []);

  // Simple loading delay to ensure smooth initialization
  useEffect(() => {
    // Set short timeout to ensure component mounts properly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    console.log("ThreeDimensionalDAG useEffect running"); // Debug log

    // Check if we're running in a browser
    if (typeof window !== "undefined") {
      console.log("Browser environment detected");

      // Check for WebGL support
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        const hasSupport = !!gl;
        console.log("WebGL support check:", hasSupport);
        setHasWebGLSupport(hasSupport);

        // Also check if the gl context is not limited
        if (gl) {
          try {
            const webGLContext = gl as WebGLRenderingContext;
            const ext = webGLContext.getExtension("WEBGL_debug_renderer_info");
            if (ext) {
              const vendor = webGLContext.getParameter(
                ext.UNMASKED_VENDOR_WEBGL
              );
              const renderer = webGLContext.getParameter(
                ext.UNMASKED_RENDERER_WEBGL
              );
              console.log("WebGL Vendor:", vendor);
              console.log("WebGL Renderer:", renderer);

              // Check for software rendering which can indicate poor performance
              const isSoftwareRenderer =
                renderer.toString().includes("SwiftShader") ||
                renderer.toString().includes("llvmpipe") ||
                renderer.toString().includes("Software");

              if (isSoftwareRenderer) {
                console.warn(
                  "Software rendering detected, performance may be limited"
                );
              }
            }
          } catch (e) {
            console.warn("Unable to get WebGL renderer info:", e);
          }
        }
      } catch (e) {
        console.error("Error checking WebGL support:", e);
        setHasWebGLSupport(false);
      }
    }
  }, []);

  const handleWebGLCheck = (result: any) => {
    console.log("WebGL check result:", result); // Debug log
    setHasWebGLSupport(result.hasWebGL);
  };

  const handleRetry = () => {
    console.log("Retry requested"); // Debug log
    setIsLoading(true);
    setError(null);
    // Force reload after a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!hasWebGLSupport) {
    console.log("No WebGL support detected, showing fallback"); // Debug log
    return (
      <ThreeDAccessibility>
        <AccessibilityCheck onCheck={handleWebGLCheck} onRetry={handleRetry} />
      </ThreeDAccessibility>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} resetErrorBoundary={handleRetry} />;
  }

  console.log("Rendering DAGVisualization"); // Debug log
  return (
    <ThreeDErrorBoundary
      fallback={
        <ErrorDisplay
          error={new Error("Failed to render 3D visualization")}
          resetErrorBoundary={handleRetry}
        />
      }
    >
      <ThreeDAccessibility>
        <DAGVisualization />
      </ThreeDAccessibility>
    </ThreeDErrorBoundary>
  );
}
