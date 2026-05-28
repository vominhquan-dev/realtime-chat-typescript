import AuthService from "../../features/auth/auth.service.js";
import User from "../../features/users/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MessagesError } from "../constants/messagesError.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.error(
        res,
        MessagesError.ERROR.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = AuthService.verifyToken(token);
    const user = await User.findById(payload.id).select("-password");
    if (!user)
      return ApiResponse.error(
        res,
        MessagesError.ERROR.USER_NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED
      );

    req.user = user;
    next();
  } catch (err) {
    return ApiResponse.error(
      res,
      err.message || MessagesError.ERROR.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};
