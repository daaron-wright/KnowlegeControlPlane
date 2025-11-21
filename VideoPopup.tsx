"use client";

import React, { useRef, useState, useEffect } from "react";

interface VideoPopupProps {
  isOpen: boolean;
  onClose: (completed?: boolean) => void;
  videoSrc: string;
  autoClose?: boolean;
}

export function VideoPopup({
  isOpen,
  onClose,
  videoSrc,
  autoClose = true,
}: VideoPopupProps) {
  // Initialize position in the top right corner
  const [position, setPosition] = useState({
    x: window.innerWidth - 350,
    y: 100,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLDivElement>(null);

  // Set initial position when the component mounts
  useEffect(() => {
    // Position in top right with some margin
    if (typeof window !== "undefined") {
      setPosition({
        x: window.innerWidth - 350,
        y: 100,
      });
    }
  }, [isOpen]);

  // Handle window resize to maintain position in viewport
  useEffect(() => {
    const handleResize = () => {
      if (!isDragging && isOpen) {
        setPosition((prev) => {
          // Ensure it stays within viewport
          const newX = Math.min(window.innerWidth - 320, prev.x);
          return { x: newX, y: prev.y };
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDragging, isOpen]);

  // Handle video end
  useEffect(() => {
    const video = videoRef.current;

    if (video && autoClose) {
      const handleEnded = () => {
        // Call onClose with completed=true to indicate natural completion
        onClose(true);
      };

      video.addEventListener("ended", handleEnded);
      return () => {
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [onClose, autoClose]);

  // Handle close button click
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Call onClose with completed=false to indicate manual close
    onClose(false);
  };

  // Mouse down handler to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't initiate drag if clicking the close button
    if (
      closeButtonRef.current &&
      closeButtonRef.current.contains(e.target as Node)
    ) {
      return;
    }

    e.preventDefault();

    // Calculate drag offset
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Mouse move handler to update position during drag
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  // Mouse up handler to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Reset video when opening/closing
  useEffect(() => {
    if (videoRef.current) {
      if (isOpen) {
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .catch((err) => console.error("Failed to play video:", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
      }}
    >
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: 9999,
          pointerEvents: "auto",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Minimal X button outside the circle */}
        <div
          ref={closeButtonRef}
          onClick={handleCloseClick}
          style={{
            position: "absolute",
            top: "-15px",
            right: "-15px",
            background: "rgba(100, 100, 100, 0.7)",
            color: "white",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontWeight: "normal",
            fontSize: "18px",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            zIndex: 10000,
            pointerEvents: "auto",
          }}
        >
          ✕
        </div>

        {/* Circular container */}
        <div
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "4px solid white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
            src={videoSrc}
            muted={false}
            playsInline
          />
        </div>
      </div>
    </div>
  );
}
