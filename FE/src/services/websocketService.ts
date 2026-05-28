import { io, Socket } from "socket.io-client";
import { getToken } from "@/utils";
import { getCurrentUserFromToken } from "@/lib/utils";
import { fetchUserProfile } from "@/api/userApi";

type MessageHandler = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private url: string;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private currentUserId: string | null = null;

  constructor(
    url: string = import.meta.env.VITE_WS_URL || "http://localhost:3000",
  ) {
    this.url = url;
  }

  /**
   * Set current user ID for private messaging
   */
  setCurrentUserId(userId: string): void {
    this.currentUserId = userId;
    // If already connected, register with the server
    if (this.socket?.connected) {
      this.socket.emit("user_join", userId);
    }
  }

  /**
   * Connect to Socket.IO server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // If already connected, resolve immediately
      if (this.socket?.connected) {
        resolve();
        return;
      }

      // If already connecting, don't create new connection
      if (this.socket && !this.socket.disconnected) {
        // Wait for existing connection
        this.socket.once("connect", () => resolve());
        this.socket.once("connect_error", (err) => reject(err));
        return;
      }

      try {
        const token = getToken();

        if (!token) {
          reject(new Error("No authentication token"));
          return;
        }

        this.socket = io(this.url, {
          auth: { token },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        const handleConnect = async () => {
          // Send user info when connected
          try {
            const response = await fetchUserProfile();
            const user = response.data;
            if (user) {
              this.currentUserId = user._id;
              // Register user for private messaging
              this.socket?.emit("user_join", user._id);
              // Join public room
              this.socket?.emit("join_public");
              // Send user info
              this.socket?.emit("user-info", {
                userId: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatarImage,
              });
            }
          } catch (error) {
            // Fallback: use token user info
            const tokenUser = getCurrentUserFromToken();
            if (tokenUser?.id) {
              this.currentUserId = tokenUser.id;
              this.socket?.emit("user_join", tokenUser.id);
              this.socket?.emit("join_public");
            }
          }

          this.startHeartbeat();
          resolve();
        };

        const handleError = (err: any) => {
          reject(err);
        };

        this.socket.once("connect", handleConnect);
        this.socket.once("connect_error", handleError);

        this.socket.on("disconnect", () => {
          this.stopHeartbeat();
        });

        // Handle ALL events dynamically
        this.socket.onAny((event, data) => {
          const handlers = this.messageHandlers.get(event) || [];
          handlers.forEach((h) => h(data));
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    this.stopHeartbeat();
    this.socket?.disconnect();
    this.socket = null;
    this.currentUserId = null;
  }

  /**
   * Send message via socket
   */
  sendMessage(event: string, data: any): void {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  /**
   * Subscribe to an event
   */
  on(event: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, []);
    }
    this.messageHandlers.get(event)!.push(handler);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(event);
    if (!handlers) return;
    const index = handlers.indexOf(handler);
    if (index !== -1) handlers.splice(index, 1);
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  /**
   * Join a conversation room (for private messaging)
   */
  joinConversation(conversationId: string): void {
    this.socket?.emit("join_conversation", conversationId);
  }

  /**
   * Send private message
   */
  sendPrivateMessage(data: {
    conversationId: string;
    senderId: string;
    recipientId: string;
    content: string;
  }): void {
    this.socket?.emit("send_message", data);
  }

  /**
   * Send typing indicator
   */
  sendTyping(conversationId: string, userId: string, username: string): void {
    this.socket?.emit("typing", { conversationId, userId, username });
  }

  /**
   * Send stop typing indicator
   */
  sendStopTyping(conversationId: string): void {
    this.socket?.emit("stop_typing", conversationId);
  }

  /**
   * Mark message as seen
   */
  markMessageSeen(
    messageId: string,
    conversationId: string,
    userId: string,
  ): void {
    this.socket?.emit("message_seen", { messageId, conversationId, userId });
  }

  /**
   * Heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.socket?.emit("ping-check", { t: Date.now() });
      }
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const socketService = new SocketService();
