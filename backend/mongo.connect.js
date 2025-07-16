import mongoose from "mongoose";
import dotnev from "dotenv"
dotnev.config({ path: '../.env' });

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection error:", err));
