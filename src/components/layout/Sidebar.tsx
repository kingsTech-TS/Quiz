"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutGrid,
  CalendarDays,
  Folder,
  BarChart3,
  Settings,
  LogOut,
  Users,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { NavItem } from "./NavItem";

interface SidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export function Sidebar({ onItemClick, className }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = user?.role;

  return (
    <aside
      className={`flex flex-col h-full bg-transparent justify-between p-3 select-none ${
        className || ""
      }`}
    >
      {/* Top Brand / Logo */}
      <div>
        <div className="px-3 pt-3 pb-8">
          <Link
            href="/"
            onClick={onItemClick}
            className="inline-block tracking-wider font-black text-2xl text-gray-950 hover:opacity-90 transition-opacity uppercase"
          >
            QUZIY
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {role === "user" && (
            <>
              <NavItem
                href="/dashboard"
                label="Overview"
                icon={LayoutGrid}
                onClick={onItemClick}
              />
              <NavItem
                href="/dashboard"
                label="Schedule"
                icon={CalendarDays}
                onClick={onItemClick}
              />
              <NavItem
                href="/courses"
                label="Courses"
                icon={Folder}
                onClick={onItemClick}
              />
              <NavItem
                href="/results"
                label="Statistic"
                icon={BarChart3}
                onClick={onItemClick}
              />
              <NavItem
                href="/profile"
                label="Settings"
                icon={Settings}
                onClick={onItemClick}
              />
            </>
          )}

          {role === "quiz_master" && (
            <>
              <NavItem
                href="/qm/dashboard"
                label="Overview"
                icon={LayoutGrid}
                onClick={onItemClick}
              />
              <NavItem
                href="/qm/courses/create"
                label="Schedule"
                icon={CalendarDays}
                onClick={onItemClick}
              />
              <NavItem
                href="/qm/courses"
                label="Courses"
                icon={Folder}
                onClick={onItemClick}
              />
              <NavItem
                href="/qm/analytics"
                label="Statistic"
                icon={BarChart3}
                onClick={onItemClick}
              />
              <NavItem
                href="/qm/profile"
                label="Settings"
                icon={Settings}
                onClick={onItemClick}
              />
            </>
          )}

          {role === "admin" && (
            <>
              <NavItem
                href="/admin/dashboard"
                label="Overview"
                icon={LayoutGrid}
                onClick={onItemClick}
              />
              <NavItem
                href="/admin/users"
                label="Students"
                icon={Users}
                onClick={onItemClick}
              />
              <NavItem
                href="/admin/quiz-masters"
                label="Quiz Masters"
                icon={ShieldCheck}
                onClick={onItemClick}
              />
              <NavItem
                href="/admin/analytics"
                label="Statistic"
                icon={BarChart3}
                onClick={onItemClick}
              />
              <NavItem
                href="/admin/profile"
                label="Settings"
                icon={Settings}
                onClick={onItemClick}
              />
            </>
          )}

          {!role && (
            <>
              <NavItem
                href="/dashboard"
                label="Overview"
                icon={LayoutGrid}
                onClick={onItemClick}
              />
              <NavItem
                href="/courses"
                label="Courses"
                icon={Folder}
                onClick={onItemClick}
              />
            </>
          )}
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div className="px-1 pb-3">
        <button
          onClick={() => {
            onItemClick?.();
            logout();
          }}
          className="group flex items-center gap-3.5 px-3.5 py-3 text-sm font-semibold text-gray-500 hover:text-red-600 rounded-2xl hover:bg-red-50/70 transition-all duration-150 w-full cursor-pointer"
          title="Log out"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
          <span className="truncate">Log out</span>
        </button>
      </div>
    </aside>
  );
}
