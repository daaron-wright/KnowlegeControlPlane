"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Client component that uses searchParams
function LoadingIndicatorInner() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Create EventEmitter-like functionality for route changes
    const handleRouteChangeStart = () => handleStart();
    const handleRouteChangeComplete = () => handleComplete();
    const handleRouteChangeError = () => handleComplete();

    // Listen for route changes
    window.addEventListener("beforeunload", handleRouteChangeStart);
    window.addEventListener("load", handleRouteChangeComplete);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      window.removeEventListener("load", handleRouteChangeComplete);
    };
  }, []);

  // Reset loading state when the route changes
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-8 shadow-xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Fallback component while LoadingIndicatorInner loads
function LoadingFallback() {
  return null; // Empty fallback since we don't want to show anything during loading
}

// Main component that wraps the inner component in Suspense
export function LoadingIndicator() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoadingIndicatorInner />
    </Suspense>
  );
}

// Initialize client-side event listeners
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const indicator = document.querySelector(
      "#global-loading-indicator div"
    ) as HTMLDivElement | null;

    // Custom event listeners for auth state
    document.addEventListener("auth:loading-start", () => {
      if (indicator) indicator.style.display = "block";
    });

    document.addEventListener("auth:loading-end", () => {
      if (indicator) indicator.style.display = "none";
    });
  });
}
