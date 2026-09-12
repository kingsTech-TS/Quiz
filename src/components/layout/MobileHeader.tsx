"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onToggleSidebar: () => void;
  onToggleRightPanel?: () => void;
}

export function MobileHeader({ onToggleSidebar, onToggleRightPanel }: MobileHeaderProps) {
  return (
    <header className="xl:hidden h-16 bg-[#F4F5FA] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 border-b border-gray-200/60">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-white transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link
          href="/"
          className="tracking-wider font-black text-xl text-gray-950 uppercase"
        >
          QUZIY
        </Link>
      </div>

      {onToggleRightPanel && (
        <button
          type="button"
          onClick={onToggleRightPanel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-full transition-colors cursor-pointer border border-purple-200/60 shadow-2xs"
          aria-label="View Leaderboard & Calendar"
        >
          <span>Leaderboard</span>
        </button>
      )}
    </header>
  );
}
