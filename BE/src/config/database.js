import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📌 MongoDB connected at: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error:`, error.message);
    process.exit(1);
  }
};

export default connectDB;
