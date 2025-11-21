"use client";

import { useState } from "react";
import { CustomerSegmentOverview } from "./customer-segment-overview";
import { BasketGapAnalysis } from "./basket-gap-analysis";
import { WISMOAnalysis } from "./wismo-analysis";
import { CampaignForecast } from "./campaign-forecast";
import { AIMarketingGenerator } from "./ai-marketing-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface TVGDashboardProps {
  logoSrc?: string;
  title?: string;
  lastUpdated?: string;
}

export default function TVGDashboard({
  logoSrc = "/images/the-very-group-logo.png",
  title = "Emily Persona - Attach Rate & WISMO Optimization",
  lastUpdated = "Live Analysis",
}: TVGDashboardProps) {
  const [activeTab, setActiveTab] = useState("profile");

  const dashboardSections = [
    {
      id: "profile",
      label: "Emily Profile",
      component: CustomerSegmentOverview,
    },
    {
      id: "attach-strategy",
      label: "Attach Rate Strategy",
      component: BasketGapAnalysis,
    },
    {
      id: "wismo-reduction",
      label: "WISMO Reduction",
      component: WISMOAnalysis,
    },
    {
      id: "ai-marketing",
      label: "AI Marketing Heroes",
      component: AIMarketingGenerator,
    },
    {
      id: "forecast",
      label: "4-Week Impact",
      component: CampaignForecast,
    },
  ];

  return (
    <>
      <style jsx global>{`
        /* Clean, subtle tab styling that blends with dashboard */
        .tvg-tab {
          position: relative;
          background-color: transparent !important;
          border: none !important;
          border-bottom: 3px solid transparent !important;
          color: #6b7280 !important;
          font-weight: 500 !important;
          transition: all 0.2s ease-in-out !important;
          height: 60px !important;
        }
        
        .tvg-tab:hover {
          color: #374151 !important;
          background-color: rgba(249, 250, 251, 0.5) !important;
        }
        
        .tvg-tab-active {
          color: #df007a !important;
          border-bottom-color: #df007a !important;
          background-color: rgba(253, 242, 248, 0.5) !important;
        }
        
        /* Override any existing tab styles */
        [role="tab"] {
          background-color: transparent !important;
          border-bottom: 3px solid transparent !important;
        }
        
        [role="tab"][data-state="active"] {
          background-color: rgba(253, 242, 248, 0.5) !important;
          color: #df007a !important;
          border-bottom-color: #df007a !important;
        }
        
        [role="tab"]:hover:not([data-state="active"]) {
          background-color: rgba(249, 250, 251, 0.5) !important;
          color: #374151 !important;
        }
        
        /* Ensure content areas maintain proper backgrounds */
        [role="tabpanel"] {
          background-color: transparent !important;
        }
        
        .bg-white {
          background-color: white !important;
        }
        
        .bg-gray-50 {
          background-color: #f9fafb !important;
        }
      `}</style>
      
      <div className="flex flex-col min-h-full bg-white text-gray-900">
        {/* Header with Logo and Navigation */}
        <header className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between min-h-[72px]">
          <div className="flex items-center gap-12">
            {/* Logo */}
            {logoSrc && (
              <div className="flex items-center">
                <Image
                  src={logoSrc}
                  alt="Kyndryl + L&G Partnership"
                  width={160}
                  height={48}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
            )}
            
            {/* Navigation Tabs */}
            <div className="flex items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="inline-flex h-15 items-center justify-center bg-transparent p-0 gap-8">
                  {dashboardSections.map((section, index) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className={`
                        tvg-tab relative h-15 px-5 py-0 font-medium text-sm
                        bg-transparent border-0 border-b-3 border-transparent
                        ${activeTab === section.id ? 'tvg-tab-active' : ''}
                      `}
                    >
                      {section.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
              {lastUpdated}
            </Badge>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {dashboardSections.map((section) => {
              const ComponentToRender = section.component;
              return (
                <TabsContent
                  key={section.id}
                  value={section.id}
                  className="m-0 p-6 bg-gray-50 min-h-full"
                >
                  <div className="max-w-7xl mx-auto">
                    <ComponentToRender />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </>
  );
}
