import express from "express";
import authController from "../controller/authController.js";
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/refresh", authController.refreshToken);
authRouter.post("/forgetPwd", authController.forgotPassword);
authRouter.post("/verify", authController.verifyPin);
authRouter.post("/reset", authController.resetPassword);
authRouter.post("/logout", authController.logout);
export default authRouter;