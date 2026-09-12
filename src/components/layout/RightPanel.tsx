"use client";

import React, { useState } from "react";
import {
  Trophy,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOverallLeaderboard } from "@/hooks/use-courses";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { getInitials } from "@/lib/utils";

interface RightPanelProps {
  className?: string;
}

function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Monday as 0: (day + 6) % 7
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-xs border border-gray-100/90 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-gray-950">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-1 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center">
        {daysOfWeek.map((d) => (
          <span key={d} className="text-[11px] font-bold text-gray-400 py-1">
            {d}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 text-center gap-y-1">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const dayNum = i + 1;
          const isToday = isCurrentMonth && today.getDate() === dayNum;
          const isSelected = selectedDay === dayNum;

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => setSelectedDay(dayNum)}
              className={`w-7 h-7 mx-auto rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                isToday
                  ? "bg-purple-600 text-white font-bold shadow-xs"
                  : isSelected
                  ? "bg-purple-100 text-purple-700 font-bold ring-1 ring-purple-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UserCoursesWidget() {
  const { user } = useAuth();
  const enrolledCourses = user?.gst_courses || [];

  if (!enrolledCourses || enrolledCourses.length === 0) return null;

  return (
    <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-xs border border-gray-100/90 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-gray-950">Enrolled GSTs</h3>
            <p className="text-[10px] text-gray-400 font-semibold">{enrolledCourses.length} Registered Courses</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {enrolledCourses.map((code) => (
          <span
            key={code}
            className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-purple-50 text-purple-700 border border-purple-100/80"
          >
            {code}
          </span>
        ))}
      </div>
    </div>
  );
}

function TopStudentsRanking() {
  const [selectedGst, setSelectedGst] = useState<string>("all");
  const { data: students, isLoading } = useOverallLeaderboard(
    selectedGst === "all" ? undefined : selectedGst
  );

  const gstTabs = ["all", "GST 112", "GST 116", "GST 118", "GST 212"];

  return (
    <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-xs border border-gray-100/90 flex flex-col space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-950">
              {selectedGst === "all" ? "Top 10 Students" : `Top in ${selectedGst}`}
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              {selectedGst === "all" ? "First Attempt Overall" : "First Attempt"}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
          <Sparkles className="w-2.5 h-2.5 text-purple-600" />
          Live
        </span>
      </div>

      {/* GST Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {gstTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedGst(tab)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedGst === tab
                ? "bg-purple-600 text-white shadow-2xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
            }`}
          >
            {tab === "all" ? "All GSTs" : tab}
          </button>
        ))}
      </div>

      {/* Dynamic List */}
      {isLoading ? (
        <div className="space-y-2 py-1">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      ) : !students || students.length === 0 ? (
        <div className="p-5 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-200 space-y-1.5">
          <Award className="w-6 h-6 text-gray-300 mx-auto" />
          <p className="text-xs font-bold text-gray-800">No student rankings yet</p>
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
            {selectedGst === "all"
              ? "Overall top scores will rank here dynamically once assessments are submitted."
              : `Top scores for ${selectedGst} on first attempt will appear here.`}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
          {students.map((student, idx) => {
            const rank = student.rank || idx + 1;
            const isGold = rank === 1;
            const isSilver = rank === 2;
            const isBronze = rank === 3;
            const percentage = Math.round(student.percentage);

            return (
              <div
                key={student.matric_number || `${student.student_name}-${rank}`}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      isGold
                        ? "bg-amber-100 text-amber-800 ring-1 ring-amber-300"
                        : isSilver
                        ? "bg-slate-200 text-slate-700 ring-1 ring-slate-300"
                        : isBronze
                        ? "bg-orange-100 text-orange-800 ring-1 ring-orange-300"
                        : "bg-gray-100 text-gray-500 font-bold"
                    }`}
                  >
                    {rank}
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-950 truncate">
                      {student.student_name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {student.matric_number && (
                        <p className="text-[10px] font-mono text-gray-400 truncate">
                          {student.matric_number}
                        </p>
                      )}
                      {student.gst_code && selectedGst === "all" && (
                        <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded">
                          {student.gst_code}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full shrink-0 ml-2">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RightPanel({ className }: RightPanelProps) {
  const { user } = useAuth();
  const role = user?.role;

  // Format display role: student role is "Student"
  const roleDisplay =
    role === "admin"
      ? "System Administrator"
      : role === "quiz_master"
      ? "Quiz Master / Instructor"
      : "Student";

  const displayName = user?.full_name || "QUZIY";
  const initials = getInitials(displayName);

  return (
    <aside
      className={`flex flex-col h-full bg-transparent px-2 py-4 space-y-4 ${
        className || ""
      }`}
    >
      {/* Top User Profile Header */}
      <div className="flex flex-col items-center text-center pt-2">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center mb-2 shadow-2xs border border-purple-200/60">
          {initials}
        </div>
        <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
          {displayName}
        </h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          {roleDisplay}
        </p>
        {user?.matric_number && (
          <p className="text-[11px] font-mono text-purple-600 font-bold mt-0.5">
            {user.matric_number}
          </p>
        )}
        <div className="w-full border-b border-gray-200/70 mt-4" />
      </div>

      {/* User Enrolled GST Courses (if any) */}
      <UserCoursesWidget />

      {/* Calendar Section */}
      <CalendarWidget />

      {/* Top 10 Overall Best Students Ranking */}
      <TopStudentsRanking />
    </aside>
  );
}
