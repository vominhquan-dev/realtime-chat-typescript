import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { SidebarLeft } from "@/components/sidebar-left";
import { PublicChat } from "@/features/chat/components/PublicChat";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getCurrentUserFromToken } from "@/lib/utils";
import { Users, MessageCircle, Activity } from "lucide-react";
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
import { getOnlineUsersList } from "@/api/publicChatApi";

export default function DashBoardPage() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Handle online count changes from PublicChat
  const handleOnlineCountChange = useCallback((count: number) => {
    setOnlineCount(count);
  }, []);

  // Fetch online users on mount + listen for socket updates
  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
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

    fetchUsers();

    // Listen for real-time online users updates from socket
    const handleSocketOnlineUsers = (data: any) => {
      if (!mounted) return;
      // Backend sends either array of user IDs or array of user objects
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

  // Mock user data for testing
  const tokenUser = getCurrentUserFromToken();
  const currentUser = user || {
    id: "mock-user-1",
    email: "demo@example.com",
    name: "Demo User",
  };

  const currentUsername =
    tokenUser?.username || currentUser.name || currentUser.email;

  const avatarColors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-600",
  ];

  const getAvatarColor = (username?: string) => {
    const safeName = username || "?";
    let hash = 0;
    for (let i = 0; i < safeName.length; i++) {
      hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
          <div className="flex h-16 items-center gap-2 px-4 lg:px-6">
            <SidebarTrigger className="-ml-1.5 h-9 w-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200" />
            <Separator
              orientation="vertical"
              className="h-5 data-[orientation=vertical]:mx-2"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                    <MessageCircle className="h-4 w-4" />
                    Public Chat
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Online count badge in header */}
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-700">
                  {onlineCount} online
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-white">
            <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-6">
              <div className="flex-1 rounded-2xl border border-gray-200/60 bg-white shadow-sm overflow-hidden flex flex-col">
                <PublicChat
                  currentUserId={currentUser.id}
                  currentUsername={currentUsername}
                  onOnlineUsersChange={handleOnlineCountChange}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Online Users */}
          <div className="hidden lg:flex w-72 flex-col border-l border-gray-200/60 bg-white">
            {/* Panel Header */}
            <div className="flex-shrink-0 px-4 pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Online Users
                </h3>
                <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {onlineCount}
                </span>
              </div>
              <Separator className="bg-gray-200/60 mt-3" />
            </div>

            {/* Online Users List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {isLoading ? (
                <div className="space-y-3 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-xl animate-pulse"
                    >
                      <div className="h-9 w-9 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-2 w-16 bg-gray-100 rounded mt-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : usersList.length > 0 ? (
                <div className="space-y-0.5 pt-2">
                  {usersList.map((user: any, index: number) => (
                    <div
                      key={user.socketId || user.userId || index}
                      className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50/50 transition-all duration-200 cursor-pointer"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`h-9 w-9 rounded-full bg-gradient-to-br ${getAvatarColor(
                            user.username,
                          )} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                        >
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <span>
                              {(user.username || "?").charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                        </span>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-violet-700 transition-colors">
                          {user.username || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email || "Active now"}
                        </p>
                      </div>

                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Activity className="h-4 w-4 text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    No users online
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    When users come online, they'll appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
