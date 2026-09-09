import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { StudentRegisterForm } from "@/components/auth/StudentRegisterForm";

export const metadata = {
  title: "Student Registration — Academic Quiz",
  description: "Create an academic student account to practice GST past questions",
};

export default function StudentRegisterPage() {
  return (
    <AuthCard
      title="Student Registration"
      description="Enter your institutional matriculation information to begin"
      className="max-w-xl"
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-600 font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <StudentRegisterForm />
    </AuthCard>
  );
}
