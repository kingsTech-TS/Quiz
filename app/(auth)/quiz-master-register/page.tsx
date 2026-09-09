import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { QuizMasterRegisterForm } from "@/components/auth/QuizMasterRegisterForm";

export const metadata = {
  title: "Quiz Master Registration — Academic Quiz",
  description:
    "Register as a Quiz Master to upload, review, and manage course questions",
};

export default function QuizMasterRegisterPage() {
  return (
    <AuthCard
      title="Instructor / Quiz Master"
      description="Create a faculty account to upload and manage academic past questions"
      footer={
        <div className="space-y-2">
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p className="text-xs text-gray-500 font-medium">
            Looking for student registration?{" "}
            <Link
              href="/register"
              className="text-purple-600 font-bold hover:underline"
            >
              Register as Student
            </Link>
          </p>
        </div>
      }
    >
      <QuizMasterRegisterForm />
    </AuthCard>
  );
}
