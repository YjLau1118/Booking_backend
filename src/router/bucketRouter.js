import express from "express";
import { verifyToken } from "../middleware/authJWT.js";
import bucketController from "../controller/bucketController.js";
import multer from "multer";
import path from 'path';

const bucketRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/images/'); // Specify the destination folder for file uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extract the file extension
    cb(null, Date.now() + ext); // Use current timestamp as filename (with original extension)
  }
});

const upload = multer({ storage: storage });
bucketRouter.post("/upload", verifyToken, upload.single('image'), bucketController.uploadImage);
bucketRouter.get("/image/:id", verifyToken, bucketController.getImageById);

export default bucketRouter;