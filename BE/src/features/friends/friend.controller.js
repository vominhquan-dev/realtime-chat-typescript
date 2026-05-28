import ApiResponse from "../../shared/utils/ApiResponse.js";
import { MessagesError } from "../../shared/constants/messagesError.js";
import { HTTP_STATUS } from "../../shared/constants/httpStatus.js";
import UserService from "../users/user.service.js";
import FriendService from "./friend.service.js";

export const sendRequestFriend = async (req, res) => {
  try {
    const { to, message } = req.body;
    const from = req.user._id;

    if (from.toString() === to) {
      return ApiResponse.error(
        res,
        "Cannot send friend request to yourself",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const userExists = await UserService.getUserById(to);
    if (!userExists) {
      return ApiResponse.error(
        res,
        MessagesError.ERROR.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const result = await FriendService.sendRequestFriend(from, to, message);
    return ApiResponse.success(
      res,
      result,
      "Friend request sent",
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

export const acceptedRequestFriend = async (req, res) => {
  try {
    const { requestId } = req.body;
    const toId = req.user._id;
    const result = await FriendService.acceptedRequestFriend(requestId, toId);
    return ApiResponse.success(
      res,
      result,
      "Friend request accepted",
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

export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await FriendService.getPendingRequests(userId);
    return ApiResponse.success(
      res,
      requests,
      "Pending requests retrieved",
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

export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const friends = await FriendService.getFriends(userId);
    return ApiResponse.success(
      res,
      friends,
      "Friends list retrieved",
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
