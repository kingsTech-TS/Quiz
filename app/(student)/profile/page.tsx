"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { GraduationCap, Edit, Phone, Building, Layers } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function StudentProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Student Academic Profile"
        description="Your matriculation and General Studies enrollment details."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
      />

      {/* Main Profile Card */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-gray-100 text-center sm:text-left">
          <div className="w-18 h-18 rounded-3xl bg-purple-50 text-purple-600 text-xl font-black flex items-center justify-center border border-purple-100 shrink-0 shadow-2xs">
            {getInitials(user?.full_name || "User")}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-950">
              {user?.full_name || "Student"}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-mono font-medium">
              Matriculation: {user?.matric_number || "—"}
            </p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                {user?.level || "Undergraduate"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                Role: Student
              </span>
            </div>
          </div>
        </div>

        {/* Academic Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
              <Building className="w-3.5 h-3.5 text-purple-600" />
              Faculty
            </span>
            <p className="font-bold text-gray-950 text-sm">
              {user?.faculty || "—"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              Department
            </span>
            <p className="font-bold text-gray-950 text-sm">
              {user?.department || "—"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
              <Phone className="w-3.5 h-3.5 text-purple-600" />
              Phone Number
            </span>
            <p className="font-bold text-gray-950 text-sm font-mono">
              {user?.phone || "—"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              Academic Status
            </span>
            <p className="font-bold text-green-700 text-sm">
              Active Student Registration
            </p>
          </div>
        </div>

        {/* Registered GST Section */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-gray-950">
              Registered General Studies (GST) Courses
            </h3>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Modify Selection</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {user?.gst_courses && user.gst_courses.length > 0 ? (
              user.gst_courses.map((gst) => (
                <span
                  key={gst}
                  className="px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-extrabold"
                >
                  {gst}
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-400 font-medium">
                No GST courses registered. Click modify to enroll in courses.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
