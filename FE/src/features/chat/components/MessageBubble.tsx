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
      className={`group flex items-end gap-2.5 mb-3 transition-all duration-200 ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 hidden sm:block">
        <div
          className={`h-8 w-8 rounded-full bg-gradient-to-br ${getAvatarColor(
            username,
          )} flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white dark:ring-gray-800`}
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
          className={`flex items-center gap-2 mb-1.5 ${
            isOwn ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {isOwn ? "You" : username}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Bubble */}
        <div
          className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-200 group-hover:shadow-md ${
            isOwn
              ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-tr-md"
              : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-md shadow-gray-200/50 dark:shadow-gray-900/30"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          {/* Status indicator for own messages */}
          {isOwn && message.status && (
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <span className="text-[10px] text-white/60 mr-0.5">
                {formatTime(message.timestamp)}
              </span>
              <StatusIcon />
            </div>
          )}

          {/* Tail decoration for bubble */}
          <div
            className={`absolute bottom-0 w-3 h-3 ${
              isOwn
                ? "right-[-5px] text-violet-500"
                : "left-[-5px] text-white dark:text-gray-800"
            }`}
          >
            <svg
              viewBox="0 0 12 12"
              className="w-full h-full"
              fill="currentColor"
            >
              <path
                d={
                  isOwn
                    ? "M12 0C7.5 0 4 3.5 4 8v4h8V0z"
                    : "M0 0C4.5 0 8 3.5 8 8v4H0V0z"
                }
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
