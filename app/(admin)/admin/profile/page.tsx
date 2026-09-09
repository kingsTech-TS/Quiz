"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { ShieldAlert, Mail, ShieldCheck } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Administrator Profile"
        description="System administration and institution-level access credentials."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Admin Profile" },
        ]}
      />

      <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-gray-100 text-center sm:text-left">
          <div className="w-18 h-18 rounded-3xl bg-purple-50 text-purple-600 text-xl font-black flex items-center justify-center border border-purple-100 shrink-0 shadow-2xs">
            {getInitials(user?.full_name || "Admin")}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-950">
              {user?.full_name || "System Administrator"}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-mono font-medium">
              {user?.email || "admin@institution.edu"}
            </p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700">
                System Administrator
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                Full Clearance
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              Administrative Email
            </span>
            <p className="font-bold text-gray-950 text-sm font-mono">
              {user?.email || "—"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Security Role
            </span>
            <p className="font-bold text-gray-950 text-sm">Super Admin</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-red-100 bg-red-50/40 text-xs text-gray-600 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-red-950 mb-1.5">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Administrative Authority</span>
          </div>
          You have superuser access across all academic courses, student registrations,
          instructor accounts, assessment data, and file exports.
        </div>
      </div>
    </div>
  );
}
