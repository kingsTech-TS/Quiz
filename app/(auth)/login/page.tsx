import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In — Academic Quiz",
  description: "Sign in to your academic student, instructor, or admin account",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign in to your account"
      description="Enter your credentials to access the academic assessment portal"
      footer={
        <div className="space-y-2">
          <p>
            Student without an account?{" "}
            <Link
              href="/register"
              className="text-purple-600 font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
          <p className="text-xs text-gray-400">
            Are you an instructor or course coordinator?{" "}
            <Link
              href="/quiz-master-register"
              className="text-purple-600 font-semibold hover:underline"
            >
              Register as Quiz Master
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
