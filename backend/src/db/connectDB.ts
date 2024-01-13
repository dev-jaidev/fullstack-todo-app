import { connect } from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI + "/" + process.env.DB_NAME || "");
    console.log("Connected to DB successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB