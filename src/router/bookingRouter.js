import express from "express";
import { verifyToken } from "../middleware/authJWT.js";
import bookingController from "../controller/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", verifyToken, bookingController.createBooking);
bookingRouter.get("/list", verifyToken, bookingController.getBookingList);
bookingRouter.get("/allbooking", verifyToken, bookingController.getAllBookings)
export default bookingRouter;