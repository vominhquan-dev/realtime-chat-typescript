import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: đảm bảo user1 luôn < user2 (sorted pair)
friendSchema.pre("save", function (next) {
  const id1 = this.user1.toString();
  const id2 = this.user2.toString();

  // Chỉ swap nếu cần (khi id1 > id2 theo string comparison)
  if (id1 > id2) {
    const temp = this.user1;
    this.user1 = this.user2;
    this.user2 = temp;
  }
  next();
});

// Unique index trên sorted pair
friendSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Friend = mongoose.models.Friend || mongoose.model("Friend", friendSchema);

// Tạo index ngay khi khởi động
Friend.collection
  .createIndex({ user1: 1, user2: 1 }, { unique: true })
  .catch((err) => {
    console.log("Index already exists or error:", err.message);
  });

export default Friend;
