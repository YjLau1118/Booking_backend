import bookingModel from "../database/schema/bookingSchema.js";
import productModel from "../database/schema/productSchema.js";
const bookingController = {
  async createBooking(req, res) {
    const {product, startDate, endDate} = req.body;
    try {
      const productExist = await productModel.findById(product);
      if (!productExist){
        return res.status(404).json({
          status: 'Error',
          message: 'Product not found'
        });
      }

       const existingBooking = await bookingModel.findOne({
        product: product,
        $or: [
          { startDate: { $lte: startDate }, endDate: { $gte: startDate } }, 
          { startDate: { $lte: endDate }, endDate: { $gte: endDate } },    
          { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
        ]
      });

    if (existingBooking) {
      return res.status(400).json({
        status: 'Error',
        message: 'Too late, this product is already booked by someone'
      });
    }
      
      const newBooking = new bookingModel({
        user: req.user.id,
        product,
        startDate,
        endDate
      });
      const saveBooking = await newBooking.save();
      res.status(200).json({
        status: 'Success',
        message: 'Booking created successfully',
        data: saveBooking
      });
    } catch (err) {
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
        });
    }
  },

  async getBookingList(req, res) {
    try {
      const bookings = await bookingModel.find({user: req.user.id}).populate("product");
      res.status(200).json({
        status: 'Success',
        message: 'Booking created successfully',
        data: bookings
      });
    } catch (err){
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
        });
    }
  },

  async getAllBookings(req, res) {
    try {
      const bookings = await bookingModel.find().populate("product");
      res.status(200).json({
        status: 'Success',
        message: 'All bookings retrieved successfully',
        data: bookings
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

export default bookingController