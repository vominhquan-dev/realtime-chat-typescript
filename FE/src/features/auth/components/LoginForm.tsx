import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Input, Label } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AUTH_VALIDATION, AUTH_ROUTES } from "@/features/auth/constants";
import { LoginCredentials } from "@/types/auth";
import { LogIn } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginCredentials>({
    mode: "onBlur",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login Successful", {
        description: "Welcome back!",
      });
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error("Login Failed", {
        description: error,
      });
    }
  }, [error]);

  // ✅ Tạo biến kiểm tra form hợp lệ
  const isFormValid = isValid && !isLoading;

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        {/* Logo icon */}
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 mb-1">
          <span className="text-white font-bold text-lg">RC</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">WELCOME BACK</h1>
        <p className="text-balance text-sm text-muted-foreground max-w-xs">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="identifier" className="text-sm font-medium">
            Email or Username
          </Label>
          <div className="relative">
            <Input
              id="identifier"
              placeholder="Enter your email or username"
              className={`h-11 pl-4 pr-4 border rounded-xl bg-white/50 text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.identifier
                  ? "border-red-400 focus:ring-red-400/30 focus:border-red-400"
                  : "border-gray-200 focus:ring-violet-400/30 focus:border-violet-400"
              }`}
              {...register("identifier", {
                required: AUTH_VALIDATION.IDENTIFIER_REQUIRED,
              })}
            />
          </div>
          {errors.identifier && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 text-sm px-3.5 py-2.5 rounded-xl mt-1 flex items-center gap-2.5 animate-fade-in">
              <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs">⚠️</span>
              </div>
              <span>{errors.identifier.message}</span>
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <a
              href={AUTH_ROUTES.FORGOT_PASSWORD}
              className="ml-auto text-sm text-violet-600 hover:text-violet-700 underline-offset-4 hover:underline transition-colors"
            >
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="**********"
              className={`h-11 pl-4 pr-4 border rounded-xl bg-white/50 text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.password
                  ? "border-red-400 focus:ring-red-400/30 focus:border-red-400"
                  : "border-gray-200 focus:ring-violet-400/30 focus:border-violet-400"
              }`}
              {...register("password", {
                required: AUTH_VALIDATION.PASSWORD_REQUIRED,
                minLength: {
                  value: 8,
                  message: AUTH_VALIDATION.PASSWORD_MIN_LENGTH,
                },
              })}
            />
          </div>
          {errors.password && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 text-sm px-3.5 py-2.5 rounded-xl mt-1 flex items-center gap-2.5 animate-fade-in">
              <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs">⚠️</span>
              </div>
              <span>{errors.password.message}</span>
            </div>
          )}
        </div>

        {/* ✅ Nút Login với điều kiện isFormValid */}
        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          disabled={!isFormValid}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Logging in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </span>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200">
          <span className="relative z-10 bg-white/80 px-3 text-muted-foreground text-xs uppercase tracking-wider font-medium">
            Or continue with
          </span>
        </div>

        <Button
          variant="outline"
          className="w-full h-11 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="size-4 mr-2"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Login with Google
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-4 hover:decoration-2 transition-all"
        >
          Sign up
        </a>
      </div>
    </form>
  );
}
