import productModel from "../database/schema/productSchema.js";

const productController = {
  async createProduct(req, res) {
    const { isAdmin } = req.user;
    if (!isAdmin) {
      return res.status(404).json({
        status: 'Error',
        message: 'You are not authorized to create products'
      });
    }
    const newProduct = new productModel(req.body);
    try {
      const saveProduct = await newProduct.save();
      res.status(200).json({
        status: 'Success',
        message: 'Product created successfully',
        data: saveProduct
      });
    } catch (err) {
      console.error("Error saving product:", err);
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
        });
    }
  },

  async getProductById(req, res) {
    try {
      const productDetail = await productModel.findById(req.params.id);
      if (!productDetail) {
        return res.status(404).json({
          status: 'Error',
          message: 'Product not found'
        });
      }
      res.status(200).json({
        status: 'Success',
        message: 'Get product detail successfully',
        data: productDetail
      });
    } catch (err) {
      console.error("Error getting product:", err);
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
      });
    }
  },

 async getProductList(req, res) {
  try {
    const { page = 1, size = 10, sortBy = 'productName', sortOrder = 'asc', searchField, searchQuery, filter, filterId, minPrice, maxPrice } = req.query;

    let query = {};
    if (searchField && searchQuery) {
      const searchFields = searchField.split(',');  
      query.$or = searchFields.map(field => ({
        [field]: { $regex: searchQuery, $options: 'i' }  
      }));
    }
    if (filter && filterId) {
      query[filterId] = filter;  
    }

    if (minPrice && maxPrice) {
      query.productPricePerDay = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    const limit = parseInt(size, 10);
    const skip = (parseInt(page, 10) - 1) * limit;

    const productDetails = await productModel.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await productModel.countDocuments(query);

    res.status(200).json({
      status: 'Success',
      message: 'Get product list successfully',
      data: productDetails,
      pagination: {
        total,
        page: parseInt(page, 10),
        size: limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Error getting product:", err);
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      error: err.message
    });
  }
}
,

  async updateProduct (req, res) {
    try {
      const updateProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updateProduct) {
        return res.status(404).json({
          status: 'Error',
          message: 'Product not found'
        });
      }
      res.status(200).json({
        status: 'Success',
        message: 'Product updated successfully',
        data: updateProduct
      });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      const deleteProduct = await productModel.findByIdAndDelete(req.params.id);
      if (!deleteProduct) {
        return res.status(404).json({
          status: 'Error',
          message: 'Product not found'
        });
      }
      res.status(200).json({
        status: 'Success',
        message: 'Product deleted successfully',
      });
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
      });
    }
  }
}

export default productController;