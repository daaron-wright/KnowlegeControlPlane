"use client";

import { Home, Plus, Settings, LogOut, Expand } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoPopup } from "@/components/VideoPopup";
import { ConcatenatedLogo } from "@/components/ui/concatenated-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-provider";

// Dynamically import the 3D component to avoid SSR issues
const ThreeDimensionalDAG = dynamic(() => import("@/components/3dm2m/mock-3d-dag"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue/30 border-t-blue rounded-full animate-spin"></div>
      <span className="ml-3">Preparing 3D visualization...</span>
    </div>
  ),
});

interface ChatSidebarContentProps {
  children: React.ReactNode;
}

function ChatSidebarContent({ children }: ChatSidebarContentProps) {
  const [isM2MPopupOpen, setIsM2MPopupOpen] = useState(false);
  const [isM2MLoading, setIsM2MLoading] = useState(true);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleM2MPopup = () => {
    setIsM2MPopupOpen((prev) => {
      if (!prev) {
        // Start loading when opening
        setIsM2MLoading(true);
        // Simulate loading time
        setTimeout(() => {
          setIsM2MLoading(false);
        }, 1500);

        // Add 2-second delay before showing video popup
        // setTimeout(() => {
        //   setShowVideoPopup(true);
        // }, 2000); // DISABLED: Video popup deactivated
      }
      return !prev;
    });
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out user");
      await signOut();
      setIsUserModalOpen(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const { state, toggleSidebar } = useSidebar();

  const handleSidebarClick = (e: React.MouseEvent) => {
    // Only expand if collapsed and not clicking on interactive elements
    if (state === "collapsed") {
      const target = e.target as HTMLElement;
      // Don't expand if clicking on buttons or links
      if (!target.closest('button') && !target.closest('a')) {
        toggleSidebar();
      }
    }
  };

  return (
    <>
      <Sidebar 
        variant="sidebar" 
        collapsible="icon" 
        className="border-r"
        onClick={handleSidebarClick}
      >
        <SidebarHeader className="flex items-center justify-center border-b bg-white">
          {/* Kyndryl + L&G Concatenated Logos */}
          <div className="flex items-center justify-center py-2">
            <ConcatenatedLogo
              width={state === "expanded" ? 200 : 60}
              height={state === "expanded" ? undefined : 20}
              className="chat-sidebar__concatenated-logo transition-all duration-300"
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="flex flex-col gap-0">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="lg" className={`h-12 ${state === "collapsed" ? "justify-center px-0" : ""}`}>
                    <Link href="/prompt">
                      <Home className="h-5 w-5" />
                      <span className={`font-medium ${state === "collapsed" ? "sr-only" : ""}`}>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="lg" className={`h-12 ${state === "collapsed" ? "justify-center px-0" : ""}`}>
                    <button
                      onClick={async () => {
                        try {
                          if (typeof window !== "undefined") {
                            localStorage.setItem("starting_new_chat", "true");
                          }
                          window.location.href = "/prompt";
                        } catch (error) {
                          console.error("Error starting new chat:", error);
                        }
                      }}
                    >
                      <Plus className="h-5 w-5" />
                      <span className={`font-medium ${state === "collapsed" ? "sr-only" : ""}`}>New Chat</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="mt-auto border-t bg-gray-50/50" style={{ background: '#fff'}}>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" className={`h-12 ${state === "collapsed" ? "justify-center px-0" : ""}`}>
                <button onClick={toggleSidebar}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M11 19l-7-7 7-7" />
                    <path d="M21 19l-7-7 7-7" />
                  </svg>
                  <span className={`font-medium ${state === "collapsed" ? "sr-only" : ""}`}>Collapse</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" className={`h-12 ${state === "collapsed" ? "justify-center px-0" : ""}`}>
                <Link href="/settings">
                  <Settings className="h-5 w-5" />
                  <span className={`font-medium ${state === "collapsed" ? "sr-only" : ""}`}>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" className={`h-12 ${state === "collapsed" ? "justify-center px-0" : ""}`}>
                <button
                  onClick={() => {
                    console.log("User logout button clicked, opening modal");
                    setIsUserModalOpen(true);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span className={`font-medium ${state === "collapsed" ? "sr-only" : ""}`}>Account</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
        {children}
      </SidebarInset>

      {/* User Account Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsUserModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-2xl p-6 w-96 max-w-[90vw] mx-4">
            {/* Close button */}
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-700"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Account</h3>
              <p className="text-sm text-gray-600 mt-1">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Signed in</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Sign out
              </button>

              <button
                onClick={() => setIsUserModalOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D DAG Dialog */}
      <Dialog
        open={isM2MPopupOpen}
        onOpenChange={(open) => {
          // Only allow Dialog to close if video popup is not open
          if (!showVideoPopup) {
            setIsM2MPopupOpen(open);
          } else if (!open) {
            // If trying to close while video is playing, don't close
            // This prevents interactions with the video from closing the DAG dialog
            return;
          }
        }}
      >
        <DialogContent className="p-0 m-0 max-w-[99vw] w-[99vw] max-h-[99vh] h-[99vh] overflow-hidden border-0 rounded-none">
          <DialogTitle className="sr-only">3D M2M DAG</DialogTitle>
          <DialogDescription className="sr-only">
            Interactive 3D visualization showing relationships between
            government entities and health services
          </DialogDescription>
          <div className="h-full w-full flex flex-col">
            <div className="bg-white py-1 px-3 border-b border-blue/30 flex justify-between items-center shrink-0 shadow-sm z-10">
              <h2 className="text-lg font-semibold">3D M2M DAG</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsM2MPopupOpen(false)}
                className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Close
              </Button>
            </div>
            <div className="w-full h-[calc(99vh-40px)] bg-white">
              {isM2MLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue/30 border-t-blue rounded-full animate-spin"></div>
                  <span className="ml-3">Preparing 3D visualization...</span>
                </div>
              ) : (
                <div className="h-full w-full">
                  <ThreeDimensionalDAG />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Popup */}
      <VideoPopup
        isOpen={showVideoPopup}
        onClose={() => setShowVideoPopup(false)}
        videoSrc="/videos/55 Entities.mp4"
        autoClose={true}
      />
    </>
  );
}

export function ChatSidebar({ children }: ChatSidebarContentProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <ChatSidebarContent>{children}</ChatSidebarContent>
    </SidebarProvider>
  );
}