import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "403 Access Forbidden — QUZIY Academic",
  description: "You do not have permission to access this resource",
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F5FA]">
      <div className="max-w-md w-full text-center bg-white border border-gray-100 rounded-[32px] p-8 sm:p-10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5 shadow-2xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Access Restricted (403)
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed font-normal">
          Your account role does not possess the requisite clearance to access
          this section. Please verify that you are signed in with the correct credentials.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-xs font-bold rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all shadow-2xs"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
