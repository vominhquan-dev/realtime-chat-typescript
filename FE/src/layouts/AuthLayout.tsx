import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="relative">
        {/* Gradient border glow effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-fuchsia-500/30 rounded-2xl blur-md" />

        {/* Card with glass effect */}
        <div className="relative glass rounded-2xl p-8 md:p-10 shadow-2xl shadow-violet-500/10">
          {/* Decorative top gradient line */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent rounded-full" />

          {children}
        </div>
      </div>
    </div>
  );
}
