import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import loginBgImage from "@/assets/images/login-bg.svg?url";

export function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-violet-500/15 to-purple-600/10 blur-3xl animate-float" />
        <div
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-fuchsia-500/10 to-violet-500/15 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-gradient-to-r from-amber-500/5 to-purple-500/5 blur-3xl" />
      </div>

      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${loginBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: 0.8,
        }}
      />

      {/* Main Content - Form centered */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 md:px-10">
        <AuthLayout>
          <SignupForm />
        </AuthLayout>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-4 text-[11px] text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} RealChat. All rights reserved.
      </div>
    </div>
  );
}
