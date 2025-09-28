// all this process is same whenever we try to connect database
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    // for connecting with mongoDB
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected! DB host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error ", error);
    process.exit(1);
  }
};

export default connectDB;
