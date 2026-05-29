import { useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { Mail, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Simulate sending reset link
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-1">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Check Your Email
          </h1>
          <p className="text-balance text-sm text-muted-foreground max-w-xs">
            We've sent a password reset link to{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 flex items-start gap-3">
          <Mail className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          <span>
            Didn't receive the email? Check your spam folder or try another
            email address.
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
          onClick={() => setSent(false)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Try another email
        </Button>

        <div className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <a
            href={AUTH_ROUTES.LOGIN}
            className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-4 hover:decoration-2 transition-all"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25 mb-1">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Forgot Password?</h1>
        <p className="text-balance text-sm text-muted-foreground max-w-xs">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-10 pr-4 border rounded-xl bg-white/50 text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 transition-all duration-200 border-gray-200 focus:ring-violet-400/30 focus:border-violet-400"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200"
        >
          Send Reset Link
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <a
          href={AUTH_ROUTES.LOGIN}
          className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-4 hover:decoration-2 transition-all"
        >
          Back to login
        </a>
      </div>
    </form>
  );
}
