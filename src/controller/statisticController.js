import bookingModel from "../database/schema/bookingSchema.js";
import productModel from "../database/schema/productSchema.js";
import userModel from "../database/schema/userSchema.js";

const statisticController = {
  async getStatistic(req, res){
    try {
    const totalBookings = await bookingModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();

    res.status(200).json({
      status: 'Success',
      message: 'Total counts retrieved successfully',
      data: {
        totalBookings,
        totalUsers,
        totalProducts
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      error: err.message
    });
  }
  }
}

export default statisticController;