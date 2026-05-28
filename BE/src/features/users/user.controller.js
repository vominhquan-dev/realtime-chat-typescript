import UserService from "./user.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import { MessagesError } from "../../shared/constants/messagesError.js";
import { HTTP_STATUS } from "../../shared/constants/httpStatus.js";

export const registerUser = async (req, res) => {
  try {
    const result = await UserService.registerUser(req.body);
    return ApiResponse.success(
      res,
      result.data,
      MessagesError.SUCCESS.REGISTER,
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

export const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    return ApiResponse.success(
      res,
      user,
      MessagesError.SUCCESS.DEFAULT,
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

export const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const result = await UserService.getAllUsers(page, limit);
    return ApiResponse.success(
      res,
      result,
      MessagesError.SUCCESS.DEFAULT,
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

export const updateUser = async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    return ApiResponse.success(
      res,
      user,
      MessagesError.SUCCESS.UPDATED,
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

export const deleteUser = async (req, res) => {
  try {
    const result = await UserService.deleteUser(req.params.id);
    return ApiResponse.success(
      res,
      null,
      MessagesError.SUCCESS.DELETED,
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

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return ApiResponse.error(
        res,
        MessagesError.VALIDATION.REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const users = await UserService.searchUsers(query);
    return ApiResponse.success(
      res,
      users,
      MessagesError.SUCCESS.DEFAULT,
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

export const getOnlineUsers = async (req, res) => {
  try {
    const onlineCount = global.socketService?.getOnlineCount() || 0;
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

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserService.getUserProfile(userId);
    return ApiResponse.success(
      res,
      user,
      MessagesError.SUCCESS.DEFAULT,
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
