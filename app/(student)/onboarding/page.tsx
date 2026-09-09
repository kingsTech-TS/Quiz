"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2, GraduationCap, ArrowRight } from "lucide-react";
import { GST_COURSES } from "@/lib/constants";
import { userService } from "@/services/user.service";
import { QUERY_KEYS } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { getApiError } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const initialGsts = user?.gst_codes || user?.gst_courses || [];
  const [selectedGsts, setSelectedGsts] = useState<string[]>(initialGsts);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (user) {
      const gsts = user.gst_codes || user.gst_courses || [];
      if (gsts.length > 0 && selectedGsts.length === 0) {
        setSelectedGsts(gsts);
      }
    }
  }, [user]);

  const toggleGst = (code: string) => {
    setSelectedGsts((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGsts.length === 0) {
      toast.error("Please select at least one GST course to proceed.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = await userService.updateGSTs({
        gst_codes: selectedGsts,
        gst_courses: selectedGsts,
      });
      queryClient.setQueryData(QUERY_KEYS.me, updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses });
      toast.success("Enrolled GST courses saved successfully");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(getApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white mx-auto mb-4 shadow-sm shadow-purple-600/30">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950">
          Select Your GST Courses
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
          Choose the General Studies (GST) courses you are taking this semester
          to customize your past questions syllabus and practice assessments.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="space-y-3">
          {GST_COURSES.map((course) => {
            const isSelected = selectedGsts.includes(course.code);

            return (
              <div
                key={course.code}
                onClick={() => toggleGst(course.code)}
                className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? "border-purple-600 bg-purple-50/40 ring-1 ring-purple-600"
                    : "border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-gray-950 block">
                      {course.code}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {course.label} — General Studies Assessment
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isSelected
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  General Studies
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-gray-400">
            {selectedGsts.length} course(s) selected
          </span>

          <button
            type="submit"
            disabled={isSubmitting || selectedGsts.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gray-950 hover:bg-gray-800 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Enrollment...</span>
              </>
            ) : (
              <>
                <span>Save & Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
