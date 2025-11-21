"use client";

import { type ReactNode } from "react";
import { AnimatedOmnisImage } from "@/components/auth/animated-omnis-image";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#0a1622] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[60%_40%] w-full h-screen relative">
        {/* Left side with auth form - higher z-index to stay on top */}
        <div className="relative px-8 md:px-16 lg:px-24 py-12 z-10 flex flex-col items-center justify-center bg-white">
          <div className="w-full max-w-[380px]">
            {/* Omnis text */}
            <h1
              className="font-noto-naskh-arabic text-center text-[#333333] mb-12"
              style={{
                fontWeight: 400,
                fontSize: "54px",
                lineHeight: "1.2",
                letterSpacing: "0.02em",
              }}
            >
              Omnis
            </h1>

            {/* Form container */}
            <div className="w-full">{children}</div>
          </div>
        </div>

        {/* Right side with animated background */}
        <div className="hidden md:block h-full relative bg-[#0a1622]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[95%] h-full relative">
              <AnimatedOmnisImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
