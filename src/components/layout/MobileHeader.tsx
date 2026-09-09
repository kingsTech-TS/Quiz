"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onToggleSidebar: () => void;
}

export function MobileHeader({ onToggleSidebar }: MobileHeaderProps) {
  return (
    <header className="lg:hidden h-16 bg-[#F4F5FA] px-5 flex items-center justify-between sticky top-0 z-30 border-b border-gray-200/60">
      <Link
        href="/"
        className="tracking-wider font-black text-xl text-gray-950 uppercase"
      >
        BRAIO
      </Link>
      <button
        type="button"
        onClick={onToggleSidebar}
        className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-white transition-colors cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
}
