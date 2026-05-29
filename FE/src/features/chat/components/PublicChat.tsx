import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Loader2,
  MessageSquare,
  Sparkles,
  MessageCircle,
  Gamepad2,
  Users,
  Smile,
  Paperclip,
  Mic,
} from "lucide-react";
import { getCurrentUserFromToken } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import { socketService } from "@/services";
import { getPublicMessages, getOnlineUsersCount } from "@/api/publicChatApi";
import { ChatMessage } from "@/features/chat/types";

interface PublicChatProps {
  currentUserId: string;
  currentUsername: string;
  onOnlineUsersChange?: (count: number) => void;
}

export function PublicChat({
  currentUserId,
  currentUsername,
  onOnlineUsersChange,
}: PublicChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [userCache, setUserCache] = useState<Record<string, string>>({});
  const endRef = useRef<HTMLDivElement>(null);
  const userCacheRef = useRef(userCache);
  userCacheRef.current = userCache;

  // ===== HANDLE MESSAGE FROM SERVER =====
  const handleIncomingMessage = useCallback((data: any) => {
    const senderId = data?.senderId?._id || data?.senderId || "unknown";
    const cache = userCacheRef.current;
    const username =
      cache[senderId] ||
      data?.senderId?.username ||
      data?.senderName ||
      data?.username ||
      "Anonymous";

    const msg: ChatMessage = {
      id: data._id,
      content: data.content,
      sender: {
        id: senderId,
        username: username,
        avatar: data?.senderId?.avatarImage,
      },
      timestamp: new Date(data.timestamp),
      status: "read",
    };

    setMessages((prev) => {
      // If server sends back _clientId, match it to the temp message ID
      if (data._clientId) {
        const tempIdx = prev.findIndex((m) => m.id === data._clientId);
        if (tempIdx !== -1) {
          const copy = [...prev];
          copy[tempIdx] = msg;
          return copy;
        }
      }

      // Deduplicate by ID
      const exists = prev.some((m) => m.id === msg.id);
      if (exists) return prev;

      return [...prev, msg];
    });
  }, []);

  // ===== LOAD HISTORY + REGISTER LISTENERS =====
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const result = await getPublicMessages();
      const history = result?.messages || [];
      if (Array.isArray(history) && history.length > 0) setMessages(history);

      socketService.on("new_public_message", handleIncomingMessage);
      socketService.on("online_users", (userIds: any) => {
        if (mounted) {
          const count = Array.isArray(userIds) ? userIds.length : 0;
          onOnlineUsersChange?.(count);
        }
      });

      try {
        const count = await getOnlineUsersCount();
        if (mounted) {
          onOnlineUsersChange?.(count);
        }
      } catch (error) {
        // Ignore error
      }
    };

    init();

    return () => {
      mounted = false;
      socketService.off("new_public_message", handleIncomingMessage);
    };
  }, [handleIncomingMessage, onOnlineUsersChange]);

  // ===== AUTOSCROLL =====
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== SEND MESSAGE =====
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsSending(true);

    const tokenUser = getCurrentUserFromToken();
    const userId = tokenUser?.id || currentUserId || "unknown";
    const usernameToSend =
      tokenUser?.username || currentUsername || "Anonymous";

    setUserCache((prev) => ({
      ...prev,
      [userId]: usernameToSend,
    }));

    const messageId = `msg-${Date.now()}`;
    const tempMsg: ChatMessage = {
      id: messageId,
      content: inputValue,
      sender: {
        id: userId,
        username: usernameToSend,
        avatar: tokenUser?.avatar,
      },
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, tempMsg]);

    socketService.sendMessage("send_public_message", {
      _id: messageId,
      content: inputValue,
      senderId: userId,
      username: usernameToSend,
      avatar: tokenUser?.avatar,
    });

    setInputValue("");

    // Update temp message status optimistically
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "delivered" as const } : m,
        ),
      );
    }, 400);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "read" as const } : m,
        ),
      );
    }, 800);

    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 space-y-1 bg-gradient-to-b from-background via-background to-muted/10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-fade-in px-10">
            {/* Welcome icon */}
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30 animate-float">
              <MessageCircle className="h-9 w-9 text-white" />
            </div>

            {/* Welcome title */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              Chào mừng đến Public Chat
              <Sparkles className="h-5 w-5 text-violet-500" />
            </h3>

            <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-sm mb-6">
              Kết nối với cộng đồng, chia sẻ đam mê và kết bạn mới mỗi ngày!
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mb-6">
              <div className="glass-card rounded-xl p-3 text-center">
                <div className="h-9 w-9 mx-auto rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-500/20 dark:to-purple-500/20 flex items-center justify-center mb-2">
                  <MessageCircle className="h-4 w-4 text-violet-500" />
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Trò chuyện cùng cộng đồng
                </p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <div className="h-9 w-9 mx-auto rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 flex items-center justify-center mb-2">
                  <Gamepad2 className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Chia sẻ game yêu thích
                </p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <div className="h-9 w-9 mx-auto rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/20 flex items-center justify-center mb-2">
                  <Users className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Kết bạn mới 🤝
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => {
                document
                  .querySelector<HTMLInputElement>(
                    'input[placeholder*="message"]',
                  )
                  ?.focus();
              }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-6 h-10 rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 animate-glow-pulse"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Bắt đầu trò chuyện
            </Button>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in">
              <MessageBubble
                message={msg}
                isOwn={msg.sender.id === currentUserId}
              />
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div className="relative border-t bg-gradient-to-r from-violet-500/[0.02] to-purple-500/[0.02] px-4 py-4 md:px-6">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

        <div className="flex gap-2.5 items-end">
          <div className="flex-1 relative">
            {/* Attachment button */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-400 hover:text-violet-500 transition-colors">
              <Paperclip className="h-5 w-5" />
            </div>
            {/* Emoji button */}
            <div className="absolute right-14 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-400 hover:text-amber-500 transition-colors">
              <Smile className="h-5 w-5" />
            </div>
            {/* Mic button */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-400 hover:text-violet-500 transition-colors">
              <Mic className="h-5 w-5" />
            </div>
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="discord-input flex-1 h-12 pl-10 pr-20 text-foreground placeholder:text-gray-400/60 text-sm"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isSending || !inputValue.trim()}
            className="h-10 px-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 flex items-center gap-1.5 text-xs font-semibold"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Send <Send className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
