import express from "express";
import { verifyToken } from "../middleware/authJWT.js";
import statisticController from "../controller/statisticController.js";
const statisticRouter = express.Router();

statisticRouter.get("/data", verifyToken, statisticController.getStatistic);

export default statisticRouter;