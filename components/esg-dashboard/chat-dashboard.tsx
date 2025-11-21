"use client";

import React, { useState } from "react";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ESGDashboardAmil from "@/components/esg-dashboard/index-amil";

export function ESGChatDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden shadow-md">
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-gray-700">
            ESG Financed Emissions Dashboard
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Expand ESG Dashboard button clicked");
            setIsDialogOpen(true);
          }}
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          title="View in fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
          <span className="sr-only">Expand dashboard visualization</span>
        </Button>
      </div>

      <div className="h-[600px] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <ESGDashboardAmil className="p-4" />
        </div>
      </div>

      {/* Full-screen dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="p-0 m-0 max-w-[99vw] w-[99vw] max-h-[99vh] h-[99vh] overflow-auto border-0 rounded-none">
          <DialogTitle className="sr-only">
            ESG Financed Emissions Dashboard - Full Screen
          </DialogTitle>
          <div className="h-full w-full flex flex-col">
            <div className="bg-white py-2 px-4 border-b flex justify-between items-center shrink-0 shadow-sm z-10">
              <div>
                <h2 className="text-lg font-semibold">
                  ESG Financed Emissions Dashboard
                </h2>
                <p className="text-sm text-gray-600">
                  Analysis of 18 investments against L&G portfolio benchmarks
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ESGDashboardAmil className="p-6" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
