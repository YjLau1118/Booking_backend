import bookingModel from "../database/schema/bookingSchema.js";
import productModel from "../database/schema/productSchema.js";
import userModel from "../database/schema/userSchema.js";
import nodemailer from 'nodemailer';
const bookingController = {
  async createBooking(req, res) {
  const { product, startDate, endDate, emergencyContact } = req.body;
  try {
    const productExist = await productModel.findById(product);
    if (!productExist) {
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
      endDate,
      emergencyContact
    });
    const saveBooking = await newBooking.save();

    const user = await userModel.findById(req.user.id); // Assuming you have a user model to get user details

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Booking Confirmation',
      text: `Dear ${user.username},\n\n` +
        `Your booking has been confirmed successfully. Here are your booking details:\n\n` +
        `Booking ID: ${saveBooking._id}\n` +
        `Product Name: ${productExist.productName}\n` +
        `Start Date: ${new Date(startDate).toDateString()}\n` +
        `End Date: ${new Date(endDate).toDateString()}\n` +
        `Emergency Contact: ${emergencyContact}\n\n` +
        `Thank you for choosing our platform!\n\n`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({
          status: 'Error',
          message: 'Internal server error',
          error: err.message
        });
      }

      res.status(200).json({
        status: 'Success',
        message: 'Booking created successfully',
        data: saveBooking
      });
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
  },

  async getBookingById(req, res) {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findById(id).populate("product");
      if (!booking) {
        return res.status(404).json({
          status: 'Error',
          message: 'Booking not found'
        });
      }
      res.status(200).json({
        status: 'Success',
        message: 'Booking retrieved successfully',
        data: booking
      });
    } catch (err) {
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
      });
    }
  },
}

export default bookingController