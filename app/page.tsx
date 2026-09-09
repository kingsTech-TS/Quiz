import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  BarChart3,
  ArrowRight,
  UploadCloud,
  Users,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Academic Quiz Platform — University Past Questions & GST Practice",
  description:
    "Institutional past questions practice platform for university students and academic course coordinators.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F5FA] text-gray-900 flex flex-col font-sans">
      {/* Top Academic Header */}
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-sm shadow-purple-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-gray-950">
                QUZIY ACADEMY
              </span>
              <span className="text-[10px] font-semibold text-purple-600 tracking-wider uppercase">
                Past Question Portal
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-gray-600 hover:text-gray-950 transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-sm"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24 w-full">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto pt-6 sm:pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-8 shadow-2xs border border-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Official General Studies Examination Practice Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-950 leading-[1.1] sm:leading-[1.15]">
            Master Your GST Exams with Verified Past Questions
          </h1>

          <p className="mt-6 text-base sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-normal">
            Timed university test simulations, server-verified grading, and verified
            explanations tailored specifically for university curriculum.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/25 group"
            >
              <span>Enroll as Student</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/quiz-master-register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-gray-950 font-bold text-sm border border-gray-200 hover:bg-gray-50 transition-all shadow-xs"
            >
              <span>Faculty & Instructor Portal</span>
            </Link>
          </div>
        </section>

        {/* Workflow: How It Works */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Structured Academic Assessment Workflow
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Designed according to institutional examination standards for rigorous practice and faculty oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 font-black text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-gray-950 mb-2">
                Document Ingestion
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Instructors upload PDF or Word past questions. The system parses text, questions, and options into structured items.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 font-black text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-gray-950 mb-2">
                Academic Verification
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Faculty verify answer keys, resolve confidence warnings, and ensure syllabus alignment before publication.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 font-black text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-gray-950 mb-2">
                Secure Timed Quizzes
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Students practice under realistic examination timers. Client-side answer tampering is prevented by backend validation.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 font-black text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-gray-950 mb-2">
                Solution Analysis
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Comprehensive performance analytics, instant grading, and verified rationales for every examination question.
              </p>
            </div>
          </div>
        </section>

        {/* Features for Students & Faculty */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Built for Both Students and Academic Staff
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Dedicated interfaces customized to role-specific requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Students Card */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-purple-700 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-950">For Students</h3>
                  <p className="text-xs text-purple-600 font-semibold">
                    Targeted GST Preparation
                  </p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-gray-600 leading-relaxed">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Enrolled GST syllabus customization (GST 112, 116, 118, 212).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Strict countdown timers with server-validated expiration.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Question navigator grid for rapid review before submission.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Historical score records and detailed solution review.
                  </span>
                </li>
              </ul>
            </div>

            {/* Instructors Card */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-950">
                    For Instructors & Coordinators
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">
                    Question Bank Management & Quality Assurance
                  </p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-gray-600 leading-relaxed">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Upload past exam papers in PDF, DOCX, and text formats.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Confidence scoring highlights questions requiring human review.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    In-browser question editor for text, option keys, and explanations.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Class performance analytics and student score leaderboards.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-950 rounded-[36px] p-8 sm:p-14 text-center text-white space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Begin Your Examination Preparation Today
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Create an account using your matriculation number to access official General Studies past question assessments.
            </p>
            <div className="pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-purple-600 text-white text-sm font-bold hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/30"
              >
                <span>Register Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-gray-200/70 bg-white py-8 text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
              Q
            </div>
            <span>QUZIY Academic Platform</span>
          </div>
          <p className="text-gray-400">
            General Studies Examination Management System.
          </p>
          <div className="flex items-center gap-4 font-semibold text-gray-600">
            <Link href="/login" className="hover:text-gray-950">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-gray-950">
              Register
            </Link>
            <Link href="/quiz-master-register" className="hover:text-gray-950">
              Instructor Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
