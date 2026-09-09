"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await adminService.exportUsers();
      toast.success("Student records exported successfully");
    } catch {
      toast.error("Failed to export student records from server");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-60 cursor-pointer shadow-2xs"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          <span>Generating CSV...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-purple-600" />
          <span>Export Records (CSV)</span>
        </>
      )}
    </button>
  );
}
