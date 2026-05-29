import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage, ChatRoom } from "@/features/chat/types";
import {
  Send,
  MessageSquare,
  Users,
  Sparkles,
  MessageCircle,
  Gamepad2,
  Smile,
  Paperclip,
  Mic,
} from "lucide-react";

interface ChatWindowProps {
  room: ChatRoom;
  currentUserId: string;
}

export function ChatWindow({ room, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(room.messages || []);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: {
        id: currentUserId,
        username: "You", // Should come from Redux auth state
        avatar: undefined,
      },
      timestamp: new Date(),
      status: "sent",
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // TODO: Send to backend via API
    // TODO: Update backend
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="relative border-b bg-gradient-to-r from-violet-500/5 to-purple-500/5 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">{room.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              {room.members?.length || 0} members
            </p>
          </div>
        </div>
        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 space-y-1 bg-gradient-to-b from-background via-background to-muted/10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-fade-in px-10">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30 animate-float">
              <MessageCircle className="h-9 w-9 text-white" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              Welcome to {room.name}
              <Sparkles className="h-5 w-5 text-violet-500" />
            </h3>

            <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-sm mb-6">
              This is the beginning of this channel. Start a conversation, share
              your thoughts, and connect with everyone!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mb-4">
              <div className="glass-card rounded-xl p-3 text-center">
                <div className="h-9 w-9 mx-auto rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-500/20 dark:to-purple-500/20 flex items-center justify-center mb-2">
                  <MessageCircle className="h-4 w-4 text-violet-500" />
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Chat together
                </p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <div className="h-9 w-9 mx-auto rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 flex items-center justify-center mb-2">
                  <Gamepad2 className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Share & discuss
                </p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <div className="h-9 w-9 mx-auto rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/20 flex items-center justify-center mb-2">
                  <Users className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Make friends 🤝
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <MessageBubble
                message={message}
                isOwn={message.sender.id === currentUserId}
              />
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative border-t bg-gradient-to-r from-violet-500/[0.02] to-purple-500/[0.02] px-4 py-4 md:px-6">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

        <div className="flex gap-2.5 items-end">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-400 hover:text-violet-500 transition-colors">
              <Paperclip className="h-5 w-5" />
            </div>
            <div className="absolute right-14 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-400 hover:text-amber-500 transition-colors">
              <Smile className="h-5 w-5" />
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-400 hover:text-violet-500 transition-colors">
              <Mic className="h-5 w-5" />
            </div>
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="discord-input flex-1 h-12 pl-10 pr-20 text-foreground placeholder:text-gray-400/60 text-sm"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="h-10 px-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 flex items-center gap-1.5 text-xs font-semibold"
          >
            Send <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
