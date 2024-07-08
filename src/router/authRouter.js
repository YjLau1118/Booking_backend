import express from "express";
import authController from "../controller/authController.js";
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/refresh", authController.refreshToken);
authRouter.get("/forgetPwd", authController.forgotPassword);
authRouter.get("/verify", authController.verifyPin);
authRouter.get("/reset", authController.resetPassword);
authRouter.get("/logout", authController.logout);
export default authRouter;