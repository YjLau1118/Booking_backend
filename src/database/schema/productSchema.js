import { Schema, model } from "mongoose";

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, "product name is needed"]
  },
  productBrand: {
    type: String,
    required: [true, "product brand is needed"]
  },
  productModel: {
    type: String,
    required: [true, "product model is needed"]
  },
  productPlate: {
    type: String,
    required: [true, "product plate is needed"]
  },
  productImage: {
    type: [String],
    required: [true, "product image is needed"]
  },
  productVariant: {
    type: String,
    required: false
  },
  productSeries: {
    type: String,
    required: false
  },
  productType: {
    type: String,
    required: [true, "product type is needed"]
  },
  productSeat: {
    type: Number,
    required: [true, "product seat is needed"]
  },
  productManufacturingYear: {
    type: Number,
    required: false
  },
  productMode: {
    type: String,
    required: [true, "product mode is needed"]
  },
  productFuelType: {
    type: String,
    required: [true, "product fuel type is needed"]
  },
  productPricePerDay: {
    type: Number,
    required: [true, "product price is needed"]
  }
});



const productModel = model("products", productSchema);

export default productModel;
