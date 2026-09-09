"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function DocumentUploader({
  onUpload,
  isUploading = false,
}: DocumentUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = [".pdf", ".docx", ".doc", ".txt"];

  const validateAndSetFile = (file: File) => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      toast.error(
        `Invalid file type. Please upload academic documents (${allowedExtensions.join(", ")})`
      );
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size exceeds the 25MB limit.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
    } catch {
      // Error handled by parent or toast
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-xs">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragOver
            ? "border-purple-600 bg-purple-50/50"
            : "border-gray-200 hover:border-purple-300 bg-gray-50/50 hover:bg-gray-50/80"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h4 className="text-base font-extrabold text-gray-950">
          Upload Past Questions Document
        </h4>
        <p className="mt-1.5 text-xs text-gray-400 max-w-sm mx-auto font-medium leading-relaxed">
          Drag and drop your syllabus or exam past questions (PDF, DOCX) here,
          or click to browse your local files.
        </p>

        <span className="inline-block mt-4 text-[11px] font-semibold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-2xs">
          Supported formats: PDF, DOCX, TXT (Max 25MB)
        </span>
      </div>

      {selectedFile && (
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-950 truncate">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-gray-400 font-medium">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStartUpload();
            }}
            disabled={isUploading}
            className="px-6 py-2.5 text-xs font-bold rounded-full bg-gray-950 hover:bg-gray-800 text-white transition-all disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
          >
            {isUploading ? "Uploading..." : "Process Document"}
          </button>
        </div>
      )}
    </div>
  );
}
