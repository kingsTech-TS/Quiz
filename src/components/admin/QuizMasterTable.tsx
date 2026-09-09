import React from "react";
import type { QuizMasterSummary } from "@/types/admin";
import { EmptyState } from "@/components/shared/EmptyState";
import { ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface QuizMasterTableProps {
  quizMasters: QuizMasterSummary[];
  isLoading?: boolean;
}

export function QuizMasterTable({
  quizMasters,
  isLoading,
}: QuizMasterTableProps) {
  if (quizMasters.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No Quiz Masters Registered"
        description="No instructor or quiz master accounts have been registered yet."
      />
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-[28px] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-4 px-6">Instructor Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Total Courses</th>
              <th className="py-4 px-6">Published</th>
              <th className="py-4 px-6">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-900">
            {quizMasters.map((qm) => (
              <tr key={qm.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-950">
                  {qm.full_name}
                </td>
                <td className="py-4 px-6 font-mono text-gray-500 font-medium">
                  {qm.email}
                </td>
                <td className="py-4 px-6 text-gray-950 font-black">
                  {qm.total_courses}
                </td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                    {qm.published_courses}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-400 text-xs font-medium">
                  {qm.created_at ? formatDate(qm.created_at) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
