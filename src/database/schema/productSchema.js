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
  productPlate: {
    type: String,
    required: [true, "product plate is needed"]
  },
  productImage: {
    type: [String],
    required: [true, "product image is needed"]
  },
  productType: {
    type: String,
    required: [true, "product type is needed"]
  },
  productSeat: {
    type: String,
    required: false
  },
  productManufacturingYear: {
    type: Number,
    required: false
  },
  productMode: {
    type: String,
    required: [true, "product mode is needed"]
  },
  productPricePerDay: {
    type: Number,
    required: [true, "product price is needed"]
  }
});

const productModel = model("products", productSchema);

export default productModel;
