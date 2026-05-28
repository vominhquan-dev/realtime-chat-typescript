import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
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

  // ===== HANDLE MESSAGE FROM SERVER =====
  const handleIncomingMessage = useCallback(
    (data: any) => {
      const senderId = data?.senderId?._id || data?.senderId || "unknown";
      // Try to get username from cache first, then from data, then fallback
      const username =
        userCache[senderId] ||
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
        // Check if message already exists (dedup)
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev; // Already have this message
        return [...prev, msg];
      });
    },
    [userCache],
  );

  // ===== LOAD HISTORY + REGISTER LISTENERS =====
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const result = await getPublicMessages();
      const history = result?.messages || [];
      if (Array.isArray(history) && history.length > 0) setMessages(history);

      // Listen for new public messages from server
      socketService.on("new_public_message", handleIncomingMessage);
      // Listen for online users list
      socketService.on("online_users", (userIds: any) => {
        if (mounted) {
          const count = Array.isArray(userIds) ? userIds.length : 0;
          onOnlineUsersChange?.(count);
        }
      });

      // Request initial online count from backend
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

    // Get user info from token first, then fallback to props
    const tokenUser = getCurrentUserFromToken();
    const userId = tokenUser?.id || currentUserId || "unknown";
    const usernameToSend =
      tokenUser?.username || currentUsername || "Anonymous";

    // Cache this user's username for future lookups
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

    // Send via socket using the correct backend event name
    socketService.sendMessage("send_public_message", {
      _id: messageId,
      content: inputValue,
      senderId: userId,
      username: usernameToSend,
      avatar: tokenUser?.avatar,
    });

    setInputValue("");

    // Fake delivery state
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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender.id === currentUserId}
          />
        ))}
        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} disabled={isSending}>
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
