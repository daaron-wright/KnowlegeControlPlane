import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";
import { ProviderHeader } from "./provider-header";

// Generate a static ID for the dashboard to ensure it doesn't get recreated
const DASHBOARD_ID = `dashboard-${Math.random().toString(36).substring(2, 9)}`;

// Dynamically import the autonomous dashboard
const DynamicAutonomousDashboard = dynamic(
  () => import("./index"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="sr-only">Loading dashboard...</span>
      </div>
    ),
  }
);



export function ChatDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shouldRenderDashboard, setShouldRenderDashboard] = useState(false);
  const dashboardMountedRef = useRef(false);

  useEffect(() => {
    console.log("Autonomous Dashboard mounted in chat");

    // Only mount the dashboard once it hasn't been mounted yet
    if (!dashboardMountedRef.current) {
      // Add a slight delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setShouldRenderDashboard(true);
        dashboardMountedRef.current = true;
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
      <div className="bg-gray-50 p-2 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">
          Autonomous Vehicle Fleet Dashboard
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Expand autonomous dashboard clicked");
            setIsDialogOpen(true);
          }}
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          title="View in fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
          <span className="sr-only">Expand dashboard</span>
        </Button>
      </div>

      <div
        className="h-[450px] relative overflow-auto"
        id={`dashboard-container-${DASHBOARD_ID}`}
      >
        {shouldRenderDashboard ? (
          <DynamicAutonomousDashboard key={DASHBOARD_ID} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Preparing autonomous dashboard...</span>
          </div>
        )}
      </div>

      {/* Full-screen dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="p-0 m-0 max-w-[99vw] w-[99vw] max-h-[99vh] h-[99vh] overflow-hidden border-0 rounded-none bg-white">
          <DialogTitle className="sr-only">
            Autonomous Vehicle Fleet Dashboard
          </DialogTitle>
          <div className="h-full w-full flex flex-col">
            <div className="bg-gray-50 py-1 px-3 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10">
              <h2 className="text-lg font-semibold text-gray-800">
                Autonomous Vehicle Fleet Dashboard
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Close
              </Button>
            </div>
            <div
              className="w-full h-[calc(99vh-40px)] overflow-auto"
              id={`fullscreen-dashboard-${DASHBOARD_ID}`}
            >
              {shouldRenderDashboard && (
                <DynamicAutonomousDashboard key={`fullscreen-${DASHBOARD_ID}`} />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 