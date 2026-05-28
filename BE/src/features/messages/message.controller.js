import ApiResponse from "../../shared/utils/ApiResponse.js";
import { MessagesError } from "../../shared/constants/messagesError.js";
import { HTTP_STATUS } from "../../shared/constants/httpStatus.js";
import MessageService from "./message.service.js";
import OnlineUsersService from "./onlineUsers.service.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;
    const result = await MessageService.sendDirectMessage(
      senderId,
      recipientId,
      content,
      conversationId
    );
    return ApiResponse.success(
      res,
      result,
      "Message sent successfully",
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    if (!content || content.trim() === "") {
      return ApiResponse.error(
        res,
        "Message content is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await MessageService.sendGroupMessage(
      conversationId,
      senderId,
      content
    );

    return ApiResponse.success(
      res,
      result,
      "Message sent successfully",
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit, cursor } = req.query;
    const userId = req.user._id;

    const result = await MessageService.getConversationMessages(
      conversationId,
      userId,
      limit ? parseInt(limit) : 20,
      cursor
    );

    return ApiResponse.success(
      res,
      result,
      "Messages retrieved successfully",
      HTTP_STATUS.OK
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};
export const markMessageAsSeen = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await MessageService.markMessageAsSeen(messageId, userId);

    return ApiResponse.success(
      res,
      message,
      "Message marked as seen",
      HTTP_STATUS.OK
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await MessageService.markConversationAsRead(
      conversationId,
      userId
    );

    return ApiResponse.success(
      res,
      conversation,
      "Conversation marked as read",
      HTTP_STATUS.OK
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// Public chat endpoints
export const sendPublicMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const senderId = req.user._id;

    if (!content || content.trim() === "") {
      return ApiResponse.error(
        res,
        "Message content is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await MessageService.sendPublicMessage(senderId, content);

    return ApiResponse.success(
      res,
      result,
      "Public message sent successfully",
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const getPublicMessages = async (req, res) => {
  try {
    const { limit, skip } = req.query;

    const result = await MessageService.getPublicMessages(
      limit ? parseInt(limit) : 50,
      skip ? parseInt(skip) : 0
    );

    return ApiResponse.success(
      res,
      result,
      "Public messages retrieved successfully",
      HTTP_STATUS.OK
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const getOnlineCount = async (req, res) => {
  try {
    const onlineCount = OnlineUsersService.getOnlineCount();
    return ApiResponse.success(
      res,
      { onlineUsers: onlineCount },
      "Online users count retrieved",
      HTTP_STATUS.OK
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const getOnlineUsersList = async (req, res) => {
  try {
    const result = OnlineUsersService.getOnlineUsersList();

    return ApiResponse.success(
      res,
      result,
      "Online users list retrieved",
      HTTP_STATUS.OK
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};
