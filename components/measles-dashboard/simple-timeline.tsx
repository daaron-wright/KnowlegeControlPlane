"use client";

import { useState, useEffect, useRef } from "react";

interface SimpleTimelineProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  labels?: string[];
  initialPlaybackSpeed?: number; // Initial value for playback speed
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
  containerClassName?: string;
  labelFormatter?: (value: number) => string;
}

export default function SimpleTimeline({
  value,
  onChange,
  min,
  max,
  step,
  labels = [],
  initialPlaybackSpeed = 1000, // Default to 1 second between steps
  onPlayStateChange,
  className,
  containerClassName,
  labelFormatter = (val) => val.toString(),
}: SimpleTimelineProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(initialPlaybackSpeed);
  const animationRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  const localValueRef = useRef(value);
  const lastUpdateTimeRef = useRef<number | null>(null);

  // Keep onChange ref up to date without triggering effect reruns
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync local state with props safely
  useEffect(() => {
    if (localValue !== value) {
      setLocalValue(value);
      localValueRef.current = value;
    }
  }, [value, localValue]);

  // Animation frame handler for smoother playback
  const animateStep = (timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastUpdateTimeRef.current;
    const frameDuration = playbackSpeed; // Time between steps in ms

    if (elapsed >= frameDuration) {
      const currentValue = localValueRef.current;
      const nextValue = currentValue + step;

      if (nextValue > max) {
        // Stop playing when reaching the end
        setIsPlaying(false);
        lastUpdateTimeRef.current = null;
        animationRef.current = null;
        onPlayStateChange?.(false);
        return;
      }

      // Update the value
      localValueRef.current = nextValue;
      setLocalValue(nextValue);
      onChangeRef.current(nextValue);

      // Reset the timer
      lastUpdateTimeRef.current = timestamp;
    }

    // Continue the animation loop
    animationRef.current = requestAnimationFrame(animateStep);
  };

  // Handle animation playback
  useEffect(() => {
    if (isPlaying) {
      console.log("Starting animation, current value:", localValueRef.current);
      lastUpdateTimeRef.current = null; // Reset the timer
      animationRef.current = requestAnimationFrame(animateStep);
    } else if (animationRef.current) {
      console.log("Stopping animation");
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      lastUpdateTimeRef.current = null;
    }

    // Clean up on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Notify parent about play state changes
  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    localValueRef.current = newValue;
    setLocalValue(newValue);
    onChangeRef.current(newValue);
  };

  // Toggle play/pause
  const togglePlay = () => {
    // If we're at the max, restart from the beginning when play is clicked
    if (localValue >= max && !isPlaying) {
      localValueRef.current = min;
      setLocalValue(min);
      onChangeRef.current(min);
    }
    setIsPlaying(!isPlaying);
  };

  // Reset to beginning
  const handleReset = () => {
    localValueRef.current = min;
    setLocalValue(min);
    onChangeRef.current(min);
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  // Handle playback speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  // Calculate positions for labels
  const getPositionStyle = (index: number) => {
    const position = ((index / (labels.length - 1)) * 100).toFixed(1);
    return { left: `${position}%` };
  };

  return (
    <div className={`w-full ${containerClassName || ""}`}>
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-7 h-7 bg-white border border-gold/40 rounded-full shadow-sm hover:bg-gold/5 focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            // Pause icon (two vertical bars)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            // Play icon (triangle pointing right)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center w-7 h-7 bg-white border border-gold/40 rounded-full shadow-sm hover:bg-gold/5 focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors"
          aria-label="Reset timeline"
        >
          {/* Reset icon (circular arrow) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        </button>

        <div className="flex-1 ml-1">
          <select
            value={playbackSpeed}
            onChange={(e) => handleSpeedChange(parseInt(e.target.value, 10))}
            className="px-1 py-0.5 text-xs bg-white border border-gold/30 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-gold/40"
          >
            <option value={2000}>Slow</option>
            <option value={1000}>Normal</option>
            <option value={500}>Fast</option>
          </select>
        </div>
      </div>

      <div className="relative mb-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer timeline-slider"
        />

        {/* Current value indicator */}
        <div
          className="absolute -top-5 text-xs font-medium text-gray-700 px-1 py-0.5 rounded bg-white shadow-sm border border-gold/30 transform -translate-x-1/2"
          style={{ left: `${((localValue - min) / (max - min)) * 100}%` }}
        >
          {labelFormatter(localValue)}
        </div>
      </div>

      {/* Timeline labels */}
      {labels.length > 0 && (
        <div className="relative w-full h-4">
          {labels.map((label, index) => (
            <div
              key={index}
              className="absolute -translate-x-1/2 text-xs text-gray-600"
              style={getPositionStyle(index)}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
