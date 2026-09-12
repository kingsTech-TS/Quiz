"use client";

import React from "react";
import type { User } from "@/types/user";
import { STUDENT_LEVELS, GST_COURSES } from "@/lib/constants";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface UserTableProps {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
  level: string;
  onLevelChange: (level: string) => void;
  gst: string;
  onGstChange: (gst: string) => void;
  isLoading?: boolean;
}

export function UserTable({
  users,
  total,
  page,
  totalPages,
  onPageChange,
  search,
  onSearchChange,
  level,
  onLevelChange,
  gst,
  onGstChange,
  isLoading,
}: UserTableProps) {
  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, matric, or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-gray-200/80 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none shadow-2xs transition-all"
          />
        </div>

        <div>
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value)}
            aria-label="Filter by Academic Level"
            className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-gray-200/80 bg-white text-gray-800 font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none shadow-2xs transition-all cursor-pointer"
          >
            <option value="">All Academic Levels</option>
            {STUDENT_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={gst}
            onChange={(e) => onGstChange(e.target.value)}
            aria-label="Filter by Registered GST"
            className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-gray-200/80 bg-white text-gray-800 font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none shadow-2xs transition-all cursor-pointer"
          >
            <option value="">All GST Registrations</option>
            {GST_COURSES.map((g) => (
              <option key={g.code} value={g.code}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-[28px] shadow-xs overflow-hidden">
        {users.length === 0 && !isLoading ? (
          <EmptyState
            icon={Users}
            title="No students found"
            description="No students match the selected filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Full Name</th>
                  <th className="py-4 px-6">Matric No.</th>
                  <th className="py-4 px-6">Level</th>
                  <th className="py-4 px-6">Faculty / Dept</th>
                  <th className="py-4 px-6">Registered GSTs</th>
                  <th className="py-4 px-6">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {users.map((u, idx) => (
                  <tr key={u.id || u.matric_number || `user-${idx}`} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-950">
                      {u.full_name}
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-500 font-medium">
                      {u.matric_number || "—"}
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-medium">
                      {u.level || "—"}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      <div className="font-semibold text-gray-950">{u.faculty || "—"}</div>
                      <div className="text-[11px] text-gray-400 font-medium">
                        {u.department}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {((u.gst_courses && u.gst_courses.length > 0) || (u.gst_codes && u.gst_codes.length > 0)) ? (
                          (u.gst_courses?.length ? u.gst_courses : u.gst_codes || []).map((code) => (
                            <span
                              key={code}
                              className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-extrabold uppercase"
                            >
                              {code}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-gray-500 font-medium">
                      {u.phone || u.phone_number || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-white">
            <span className="text-xs text-gray-400 font-medium">
              Showing page {page} of {totalPages} ({total} students total)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-gray-950 px-2">{page}</span>
              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
