import Image from "next/image";
import React from "react";
import { ReasoningPopup } from "./reasoning-popup";

interface ProviderHeaderProps {
  provider: "gatik" | "nvidia" | "applied-intuition";
  title: string;
  logoSrc?: string;
}

export function ProviderHeader({ provider, title, logoSrc }: ProviderHeaderProps) {
  const providerConfigs = {
    gatik: {
      fallback: "G",
      bgColor: "bg-blue-500",
      logoSrc: "/images/gatik-logo.png" // We'll create a placeholder or use existing
    },
    nvidia: {
      fallback: "N", 
      bgColor: "bg-green-500",
      logoSrc: "/images/nvidia-logo.png"
    },
          "applied-intuition": {
        fallback: "AI",
        bgColor: "bg-purple-500",
        logoSrc: "/images/applied_intuition_inc_logo.jpeg"
      }
  };

  const config = providerConfigs[provider];
  const finalLogoSrc = logoSrc || config.logoSrc;

  return (
    <div className="mb-6 bg-white/90 rounded-lg border border-gray-200 p-4 shadow-sm h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {finalLogoSrc ? (
          <Image 
            src={finalLogoSrc} 
            alt={provider} 
            width={40} 
            height={40}
            className="object-contain"
            onError={(e) => {
              // Fallback to colored square if logo fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = `w-10 h-10 ${config.bgColor} rounded flex items-center justify-center`;
                fallback.innerHTML = `<span class="text-sm font-bold text-white">${config.fallback}</span>`;
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className={`w-10 h-10 ${config.bgColor} rounded flex items-center justify-center`}>
            <span className="text-sm font-bold text-white">{config.fallback}</span>
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      
      {/* Help Icon */}
      <ReasoningPopup provider={provider} />
    </div>
  );
} 