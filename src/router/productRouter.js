import express from "express";
import productController from "../controller/productController.js";
import { verifyToken } from "../middleware/authJWT.js";

const productRouter = express.Router();

productRouter.post("/create", verifyToken, productController.createProduct);
productRouter.get("/detail/:id", verifyToken, productController.getProductById);
productRouter.get("/list", verifyToken, productController.getProductList);
productRouter.post("/update/:id", verifyToken, productController.updateProduct);
productRouter.post("/delete/:id", verifyToken, productController.deleteProduct);



export default productRouter;
