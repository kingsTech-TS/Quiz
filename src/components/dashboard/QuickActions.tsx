import React from "react";
import Link from "next/link";
import { BookOpen, History, Settings, Sparkles } from "lucide-react";

export function QuickActions() {
  return (
    <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-2xs">
      <h3 className="text-base font-bold text-gray-950 tracking-tight mb-4">Quick Navigation</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/courses"
          className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/50 hover:border-purple-200 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-gray-900 block truncate">
              Available Courses
            </span>
            <span className="text-[11px] text-gray-400 font-medium block truncate">
              Browse approved tests
            </span>
          </div>
        </Link>

        <Link
          href="/results"
          className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/50 hover:border-purple-200 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <History className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-gray-900 block truncate">
              Test History
            </span>
            <span className="text-[11px] text-gray-400 font-medium block truncate">
              Review score records
            </span>
          </div>
        </Link>

        <Link
          href="/onboarding"
          className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/50 hover:border-purple-200 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-gray-900 block truncate">
              Manage GSTs
            </span>
            <span className="text-[11px] text-gray-400 font-medium block truncate">
              Update registered courses
            </span>
          </div>
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/50 hover:border-purple-200 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Settings className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-gray-900 block truncate">
              Student Profile
            </span>
            <span className="text-[11px] text-gray-400 font-medium block truncate">
              View matriculation info
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
