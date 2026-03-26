import mongoose from "mongoose";

const dbConnection = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database connection successfull")
};
export default dbConnection;