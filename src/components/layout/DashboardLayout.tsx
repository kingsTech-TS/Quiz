"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { RightPanel } from "./RightPanel";
import { useAuth } from "@/hooks/use-auth";
import { X } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole?: "user" | "quiz_master" | "admin";
}

export function DashboardLayout({
  children,
  allowedRole,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (allowedRole && user && user.role !== allowedRole) {
        router.push("/403");
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRole, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (allowedRole && user?.role !== allowedRole)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F5FA] text-gray-900 flex flex-col lg:flex-row antialiased">
      {/* Desktop Left Navigation Sidebar */}
      <div className="hidden lg:flex w-56 xl:w-60 shrink-0 h-screen sticky top-0 p-3 flex-col z-20">
        <Sidebar />
      </div>

      {/* Mobile Top Header */}
      <MobileHeader onToggleSidebar={() => setMobileOpen(true)} />

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#F4F5FA] h-full shadow-2xl flex flex-col z-10 p-2 animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-gray-900 rounded-xl cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onItemClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Center Main Content Area (White Rounded Card Container) */}
      <div className="flex-1 min-w-0 p-2 sm:p-3 lg:p-4 flex flex-col">
        <main className="flex-1 bg-white rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100/80 p-5 sm:p-7 lg:p-9 min-h-[calc(100vh-2rem)] flex flex-col">
          {children}
        </main>
      </div>

      {/* Desktop Right Panel (Profile, Reminders & Mascot Card) */}
      <div className="hidden xl:flex w-72 2xl:w-80 shrink-0 h-screen sticky top-0 p-3 flex-col z-20 overflow-y-auto">
        <RightPanel />
      </div>
    </div>
  );
}
