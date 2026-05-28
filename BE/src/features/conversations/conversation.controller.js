import ApiResponse from "../../shared/utils/ApiResponse.js";
import { MessagesError } from "../../shared/constants/messagesError.js";
import { HTTP_STATUS } from "../../shared/constants/httpStatus.js";
import ConversationService from "./conversation.service.js";

export const createConversation = async (req, res) => {
  try {
    const { participantsId, type, name } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      !participantsId ||
      (type === "group" && !name) ||
      !Array.isArray(participantsId) ||
      participantsId.length === 0
    ) {
      return ApiResponse.error(
        res,
        MessagesError.VALIDATION.REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const conversation = await ConversationService.createConversation({
      participantsId,
      type,
      name,
      createdBy: userId,
    });

    return ApiResponse.success(
      res,
      conversation,
      "Conversation created successfully",
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

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await ConversationService.getConversations(userId);

    return ApiResponse.success(
      res,
      conversations,
      "Conversations retrieved successfully",
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

export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await ConversationService.getConversationById(
      conversationId,
      userId
    );

    return ApiResponse.success(
      res,
      conversation,
      "Conversation retrieved successfully",
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

export const addParticipantsToGroup = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userIds } = req.body;
    const userId = req.user._id;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return ApiResponse.error(
        res,
        "User IDs must be a non-empty array",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const conversation = await ConversationService.addParticipantsToGroup(
      conversationId,
      userIds,
      userId
    );

    return ApiResponse.success(
      res,
      conversation,
      "Participants added successfully",
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

export const removeParticipantFromGroup = async (req, res) => {
  try {
    const { conversationId, participantId } = req.params;
    const userId = req.user._id;

    const conversation = await ConversationService.removeParticipantFromGroup(
      conversationId,
      participantId,
      userId
    );

    return ApiResponse.success(
      res,
      conversation,
      "Participant removed successfully",
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

export const updateGroupInfo = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { name, avatarImage } = req.body;
    const userId = req.user._id;

    const conversation = await ConversationService.updateGroupInfo(
      conversationId,
      { name, avatarImage },
      userId
    );

    return ApiResponse.success(
      res,
      conversation,
      "Group info updated successfully",
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
