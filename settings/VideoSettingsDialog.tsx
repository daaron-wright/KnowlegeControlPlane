"use client";

import React, { useState, useEffect } from "react";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VideoKey, useVideoSettings } from "@/lib/video-settings-provider";

interface VideoSettingItemProps {
  id: VideoKey;
  label: string;
  description: string;
}

// Component for individual video setting toggle
const VideoSettingItem = ({
  id,
  label,
  description,
}: VideoSettingItemProps) => {
  const { videoSettings, toggleVideoSetting } = useVideoSettings();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor={`video-${id}`} className="text-base font-medium">
            {label}
          </Label>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          >
            {isDescriptionOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        </div>
        <Switch
          id={`video-${id}`}
          checked={videoSettings[id] === true}
          onCheckedChange={() => toggleVideoSetting(id)}
        />
      </div>

      {isDescriptionOpen && (
        <div className="mt-2 text-sm text-gray-500 pl-4 border-l-2 border-gray-100">
          {description}
        </div>
      )}
    </div>
  );
};

export function VideoSettingsDialog() {
  const { videoSettings, toggleVideoSetting } = useVideoSettings();
  const [allEnabled, setAllEnabled] = useState(true);

  // Update allEnabled state based on current video settings
  useEffect(() => {
    const areAllEnabled = Object.values(videoSettings).every(
      (value) => value === true
    );
    setAllEnabled(areAllEnabled);
  }, [videoSettings]);

  // Function to toggle all videos at once
  const toggleAll = () => {
    // Toggle to the opposite of current allEnabled state
    const newState = !allEnabled;

    // Toggle each video setting to the new state
    (
      ["measles", "chatOutput", "entities", "dohDeepDive"] as VideoKey[]
    ).forEach((key) => {
      // Only toggle if the current state doesn't match the target state
      if (videoSettings[key] !== newState) {
        toggleVideoSetting(key);
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Video Settings"
        >
          <Settings size={20} className="text-gray-700" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Video Settings</DialogTitle>
          <DialogDescription>
            Toggle which videos to show automatically in the application.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <VideoSettingItem
            id="measles"
            label="Measles Case Study"
            description="Shows when the healthcare use case prompt is detected"
          />
          <VideoSettingItem
            id="chatOutput"
            label="Chat Output Visualization"
            description="Shows when redirected from DAG tab to Chat tab"
          />
          <VideoSettingItem
            id="entities"
            label="55 Entities Visualization"
            description="Shows when opening the 3D DAG popup"
          />
          <VideoSettingItem
            id="dohDeepDive"
            label="DOH Deep Dive"
            description="Shows in the DAG visualization on double-click"
          />

          {/* Toggle All option */}
          <div className="pt-6 mt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Label htmlFor="toggle-all" className="text-base font-semibold">
                Toggle All Videos
              </Label>
              <Switch
                id="toggle-all"
                checked={allEnabled}
                onCheckedChange={toggleAll}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
