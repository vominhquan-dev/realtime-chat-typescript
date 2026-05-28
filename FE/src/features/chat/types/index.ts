export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: "public" | "private";
  members: Array<{
    id: string;
    username: string;
    avatar?: string;
  }>;
  messages: ChatMessage[];
}
