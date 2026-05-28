export const updateConversationAfterCreateMessage = (
  conversation,
  message,
  senderId
) => {
  // Update last message
  conversation.lastMessage = {
    messageId: message._id,
    sendBy: senderId,
    content: message.content,
  };

  conversation.lastMessageAt = message.timestamp;

  // Update unread count - increment for recipients (not sender)
  conversation.participants.forEach((p) => {
    const id = p.userId.toString();
    const senderIdStr = senderId.toString();

    if (id !== senderIdStr) {
      const current = conversation.unreadCounts.get(id) || 0;
      conversation.unreadCounts.set(id, current + 1);
    }
  });

  return conversation;
};
