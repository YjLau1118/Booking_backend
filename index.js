import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRouter from "./src/router/productRouter.js";
import authRouter from "./src/router/authRouter.js";
import cookieParser from "cookie-parser";
import bookingRouter from "./src/router/bookingRouter.js";
import bucketRouter from "./src/router/bucketRouter.js";
import userRouter from "./src/router/userRouter.js";
import cors from "cors";
import statisticRouter from "./src/router/statisticRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;
const MONGOURL = process.env.MONGO_URL;

//middleware
app.use(cookieParser()),
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use("/api/cars", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/bucket", bucketRouter);
app.use("/api/users", userRouter);
app.use("/api/statistic", statisticRouter)
mongoose.connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Error connecting to database:", error));
