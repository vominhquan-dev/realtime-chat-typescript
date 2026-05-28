import User from "./user.model.js";
import { MessagesError } from "../../shared/constants/messagesError.js";

class UserService {
  // Register user
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username }],
      });

      if (existingUser) {
        throw new Error(MessagesError.ERROR.EMAIL_ALREADY_EXISTS);
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      return {
        success: true,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatarImage: user.avatarImage,
        },
      };
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new Error(MessagesError.ERROR.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  }

  // Get all users
  async getAllUsers(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const users = await User.find()
        .select("-password")
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments();

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  }

  // Update user
  async updateUser(userId, updateData) {
    try {
      // Remove password from update if provided
      delete updateData.password;

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        throw new Error(MessagesError.ERROR.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        throw new Error(MessagesError.ERROR.USER_NOT_FOUND);
      }

      return { success: true, message: MessagesError.SUCCESS.DELETED };
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  }

  // Search users
  async searchUsers(query) {
    try {
      const users = await User.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      }).select("-password");

      return users;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new Error(MessagesError.ERROR.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  }
}

export default new UserService();
