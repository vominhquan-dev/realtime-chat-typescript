import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, LogOut, ChevronLeft, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const isDarkMode = false; // TODO: Use theme context

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-3">
              {/* Back button if not on dashboard */}
              {location.pathname !== "/dashboard" && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
              )}

              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                  RealChat
                </span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => {
                  /* TODO: Toggle theme */
                }}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User info */}
              {user && (
                <div className="flex items-center gap-2.5 mr-1">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium leading-tight text-gray-900 dark:text-gray-100">
                      {user.username}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Online
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white dark:ring-gray-800">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
              )}

              {/* Logout */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Bottom gradient separator */}
        <div className="absolute bottom-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
