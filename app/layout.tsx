import "./globals.css";
import { Noto_Kufi_Arabic } from "next/font/google";
import { AuthProvider } from "@/lib/auth-provider";
import { ChatProvider } from "@/lib/chat-provider";
import { Toaster } from "sonner";
import { LoadingIndicator } from "@/components/loading-indicator";
import { LettaChatProvider } from "@/lib/mock-letta-chat-provider";
import { VideoSettingsProvider } from "@/lib/video-settings-provider";

// Load Inter font as fallback
const notoKufi = Noto_Kufi_Arabic({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-noto-kufi",
});

export const metadata = {
  title: "Omnis Demo",
  description: "Omnis UAE Health and Security Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-noto-kufi">
        <AuthProvider>
          <LettaChatProvider>
            <ChatProvider>
              <VideoSettingsProvider>
                <LoadingIndicator />
                {children}
                <Toaster position="top-right" />
              </VideoSettingsProvider>
            </ChatProvider>
          </LettaChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
