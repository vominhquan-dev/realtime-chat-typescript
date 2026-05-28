import { ChatMessage } from "@/features/chat/types";
import { Check, CheckCheck, Clock } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const username = message.sender.username || "Anonymous";
  const firstChar = (username || "A").charAt(0).toUpperCase();

  // Avatar color based on username
  const avatarColors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-600",
  ];

  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Clock className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default:
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <div
      className={`group flex items-end gap-2.5 mb-4 ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 hidden sm:block">
        <div
          className={`h-8 w-8 rounded-full bg-gradient-to-br ${getAvatarColor(
            username,
          )} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
        >
          {message.sender.avatar ? (
            <img
              alt={username}
              src={message.sender.avatar}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{firstChar}</span>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[75%] lg:max-w-[60%] ${
          isOwn ? "items-end" : "items-start"
        } flex flex-col`}
      >
        {/* Username & Time */}
        <div
          className={`flex items-center gap-2 mb-1 ${
            isOwn ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="text-xs font-semibold text-gray-500">
            {isOwn ? "You" : username}
          </span>
          <span className="text-[10px] text-gray-400">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Bubble */}
        <div
          className={`relative px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isOwn
              ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-tr-md"
              : "bg-white border border-gray-200 text-gray-800 rounded-tl-md"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          {/* Status indicator for own messages */}
          {isOwn && message.status && (
            <div className="flex items-center justify-end gap-1 mt-1">
              <StatusIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
