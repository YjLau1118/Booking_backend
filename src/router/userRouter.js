import express from "express";
import { verifyToken } from "../middleware/authJWT.js";
import userController from "../controller/userController.js";
const userRouter = express.Router();

userRouter.get("/details/:id", verifyToken, userController.getUserById);
userRouter.get("/list", verifyToken, userController.getAllUsers);

export default userRouter;