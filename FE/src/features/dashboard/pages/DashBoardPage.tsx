import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { SidebarLeft } from "@/components/sidebar-left";
import { PublicChat } from "@/features/chat/components/PublicChat";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getCurrentUserFromToken } from "@/lib/utils";
import {
  Users,
  MessageCircle,
  Activity,
  Search,
  Globe,
  TrendingUp,
  MessageSquare,
  Flame,
  Hash,
  Sparkles,
} from "lucide-react";
import { socketService } from "@/services";
import { updateOnlineUsers } from "@/features/chat/redux/chatSlice";
import { AppDispatch } from "@/app/store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { getOnlineUsersList } from "@/api/publicChatApi";

const communityStats = {
  members: 2450,
  messages: 18392,
  activeToday: 321,
};

const trendingTopics = [
  { tag: "Gaming", color: "from-violet-500 to-purple-600" },
  { tag: "Anime", color: "from-pink-500 to-rose-500" },
  { tag: "Technology", color: "from-blue-500 to-cyan-500" },
  { tag: "Music", color: "from-emerald-500 to-teal-500" },
  { tag: "Movies", color: "from-amber-500 to-orange-500" },
  { tag: "Sports", color: "from-indigo-500 to-blue-600" },
];

export default function DashBoardPage() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOnlineCountChange = useCallback((count: number) => {
    setOnlineCount(count);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const result = await getOnlineUsersList();
        if (mounted) {
          setUsersList(result.users || []);
          setOnlineCount(result.count || 0);
          dispatch(updateOnlineUsers(result.users || []));
        }
      } catch (error) {
        // Ignore errors
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();

    const handleSocketOnlineUsers = (data: any) => {
      if (!mounted) return;
      let users: any[] = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (data?.onlineUsers) {
        users = data.onlineUsers;
      }
      setUsersList(users);
      setOnlineCount(users.length);
      dispatch(updateOnlineUsers(users));
    };

    socketService.on("online_users", handleSocketOnlineUsers);

    return () => {
      mounted = false;
      socketService.off("online_users", handleSocketOnlineUsers);
    };
  }, [dispatch]);

  const tokenUser = getCurrentUserFromToken();
  const currentUser = user || {
    id: "mock-user-1",
    email: "demo@example.com",
    name: "Demo User",
  };

  const currentUsername =
    tokenUser?.username || currentUser.name || currentUser.email;

  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        {/* ===== HEADER (#2) - Richer info ===== */}
        <header className="sticky top-0 z-10 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
          <div className="flex h-16 items-center gap-2 px-4 lg:px-6">
            <SidebarTrigger className="-ml-1.5 h-9 w-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200" />
            <Separator
              orientation="vertical"
              className="h-5 data-[orientation=vertical]:mx-2"
            />

            {/* Group avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-500/20">
              <Globe className="h-5 w-5 text-white" />
            </div>

            {/* Channel info */}
            <div className="flex flex-col min-w-0">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                      🌍 Public Chat
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <p className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {communityStats.members.toLocaleString()} members
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-400" />
                  {communityStats.activeToday} online
                </span>
              </p>
            </div>

            {/* Search */}
            <div className="ml-auto flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-52 lg:w-64 rounded-full bg-gray-100 dark:bg-white/5 border-none pl-9 pr-4 text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-violet-400/30 transition-all duration-200"
                />
              </div>

              {/* Online badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 border border-emerald-200/60 dark:border-emerald-500/20 rounded-full shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {onlineCount} online
                </span>
              </div>
            </div>
          </div>
          {/* Decorative header line */}
          <div className="absolute bottom-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-purple-950/20">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-6">
              <div className="flex-1 rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-white/90 dark:bg-gray-950/80 shadow-sm shadow-gray-200/50 overflow-hidden flex flex-col">
                <PublicChat
                  currentUserId={currentUser.id}
                  currentUsername={currentUsername}
                  onOnlineUsersChange={handleOnlineCountChange}
                />
              </div>
            </div>
          </div>

          {/* ===== RIGHT SIDEBAR (#4) - Community Stats + Trending ===== */}
          <div className="hidden lg:flex w-72 flex-col border-l border-gray-200/60 dark:border-gray-800 bg-white/80 dark:bg-gray-950/60 backdrop-blur-sm">
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
              {/* --- Community Stats --- */}
              <div className="glass-card rounded-2xl p-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shadow-violet-500/20">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  Community Stats
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/5 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
                      {communityStats.members.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                      <Users className="h-3 w-3" /> Members
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/5 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {communityStats.messages.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                      <MessageSquare className="h-3 w-3" /> Messages
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/5 rounded-xl p-3">
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 text-center">
                    {communityStats.activeToday}
                  </p>
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                    <Flame className="h-3 w-3 text-orange-400" /> Active today
                  </p>
                </div>
              </div>

              {/* --- Online Users (compact) --- */}
              <div className="glass-card rounded-2xl p-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm shadow-emerald-500/20">
                    <Activity className="h-3.5 w-3.5 text-white" />
                  </div>
                  Online Now
                  <span className="ml-auto text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {onlineCount}
                  </span>
                </h3>

                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 shimmer rounded-lg p-2"
                      >
                        <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="flex-1">
                          <div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : usersList.length > 0 ? (
                  <div className="space-y-1">
                    {usersList.slice(0, 5).map((u: any, i: number) => (
                      <div
                        key={u.socketId || u.userId || i}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50/50 dark:hover:from-white/5 dark:hover:to-transparent transition-all duration-200 cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="relative">
                          <div
                            className={`h-7 w-7 rounded-full bg-gradient-to-br ${getAvatarColor(u.username)} flex items-center justify-center text-white text-[10px] font-bold shadow-sm ring-2 ring-white dark:ring-gray-900`}
                          >
                            {(u.username || "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                          {u.username || "Unknown"}
                        </span>
                      </div>
                    ))}
                    {usersList.length > 5 && (
                      <p className="text-[10px] text-gray-400 text-center pt-1">
                        +{usersList.length - 5} more online
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="h-8 w-8 mx-auto rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                      <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs font-medium text-gray-400">
                      No users online
                    </p>
                  </div>
                )}
              </div>

              {/* --- Trending Topics --- */}
              <div className="glass-card rounded-2xl p-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shadow-amber-500/20">
                    <TrendingUp className="h-3.5 w-3.5 text-white" />
                  </div>
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <span
                      key={topic.tag}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${topic.color} text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer`}
                    >
                      <Hash className="h-3 w-3" />
                      {topic.tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// ===== Helper: Avatar color by username =====
const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-600",
];

function getAvatarColor(username?: string) {
  const safeName = username || "?";
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}
