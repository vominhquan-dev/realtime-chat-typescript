import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { MessagesError } from "../../shared/constants/messagesError.js";

const SECRET_KEY = process.env.SECRET_KEY || "change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "5m";
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "7d";

class AuthService {
  // Generate access token
  generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  }
  // Generate refresh token
  generateRefreshToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRES });
  }
  //login user
  async login({ identifier, password }) {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) throw new Error(MessagesError.ERROR.INVALID_CREDENTIALS);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error(MessagesError.ERROR.INVALID_CREDENTIALS);

    // Create tokens with id and username
    const accessToken = this.generateToken({
      id: user._id,
      username: user.username,
    });
    const refreshToken = this.generateRefreshToken({
      id: user._id,
      username: user.username,
    });

    // (optional) save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarImage: user.avatarImage,
      },
    };
  }

  // Verify token
  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") throw new Error("Token expired");
      throw new Error("Invalid token");
    }
  }

  // Refresh access token
  async refresh(refreshToken) {
    if (!refreshToken) throw new Error("Missing refresh token");

    let payload;
    try {
      payload = jwt.verify(refreshToken, SECRET_KEY);
    } catch (err) {
      throw new Error("Invalid refresh token");
    }

    // Check refresh token exists in DB (avoid stolen token)
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Refresh token not recognized");
    }

    const newAccessToken = this.generateToken({ id: user._id });

    return { accessToken: newAccessToken };
  }
}

export default new AuthService();
