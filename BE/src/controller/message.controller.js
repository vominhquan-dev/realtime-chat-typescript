import ApiResponse from "../utils/ApiResponse.js";
import { MessagesError } from "../constants/messagesError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import MessageService from "../service/message.service.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;
    const result = await MessageService.sendDirectMessage(
      senderId,
      recipientId,
      content,
      conversationId,
    );
    return ApiResponse.success(
      res,
      result,
      "Message sent successfully",
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const result = await MessageService.sendGroupMessage(
      conversationId,
      senderId,
      content,
    );

    return ApiResponse.success(
      res,
      result,
      "Message sent successfully",
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      cursor,
    );

    return ApiResponse.success(
      res,
      result,
      "Messages retrieved successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await MessageService.markConversationAsRead(
      conversationId,
      userId,
    );

    return ApiResponse.success(
      res,
      conversation,
      "Conversation marked as read",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getPublicMessages = async (req, res) => {
  try {
    const { limit, cursor } = req.query;

    const result = await MessageService.getPublicMessages(
      limit ? parseInt(limit) : 50,
      cursor,
    );

    return ApiResponse.success(
      res,
      result,
      "Public messages retrieved successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};
