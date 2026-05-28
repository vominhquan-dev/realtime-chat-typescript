import AuthService from "./auth.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import { MessagesError } from "../../shared/constants/messagesError.js";
import { HTTP_STATUS } from "../../shared/constants/httpStatus.js";

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return ApiResponse.error(
        res,
        MessagesError.VALIDATION.REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await AuthService.login({ identifier, password });
    return ApiResponse.success(
      res,
      result,
      MessagesError.SUCCESS.LOGIN,
      HTTP_STATUS.OK
    );
  } catch (err) {
    return ApiResponse.error(
      res,
      err.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};

export const me = async (req, res) => {
  // req.user should be populated by middleware
  if (!req.user)
    return ApiResponse.error(
      res,
      MessagesError.ERROR.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED
    );
  return ApiResponse.success(
    res,
    req.user,
    MessagesError.SUCCESS.DEFAULT,
    HTTP_STATUS.OK
  );
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return ApiResponse.error(
        res,
        MessagesError.VALIDATION.REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const result = await AuthService.refresh(refreshToken);
    return ApiResponse.success(res, result, "Token refreshed", HTTP_STATUS.OK);
  } catch (err) {
    return ApiResponse.error(
      res,
      err.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};
