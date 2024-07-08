import userModel from "../database/schema/userSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import nodemailer from 'nodemailer';

const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const authController = {
  
  async register(req, res) {
    try{
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
      const newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
      })
      await newUser.save()
      res.status(200).json({
        status: 'Success',
        message: 'User register successfully',
        data: newUser
      })
    } catch (err){
       res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
        });
    }
  },

  async login(req, res) {
    try{
      const user = await userModel.findOne({email: req.body.email});
      if(!user) {
        return res.status(404).json({
          status: 'Error',
          message: 'User not found'
        });
      }
      const isPassword = await bcrypt.compare(req.body.password, user.password)
      if(!isPassword){
        return res.status(400).json({
          status: 'Error',
          message: 'Password incorrect'
        });
      }
      const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
      });

      const refreshToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
      });

      user.refreshToken = refreshToken;
      user.accessToken = accessToken;
      await user.save();

      res.cookie("access_token", accessToken,  { httpOnly: true })
      res.cookie("refresh_token", refreshToken,  { httpOnly: true })

      res.status(200).json({
        status: 'Success',
        message: 'User login successfully',
        data: user,
      })
    } catch (err){
       res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
        });
    }
  },

  async refreshToken(req, res) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ status: 'Error', message: 'Unauthorized' });
    }

    try {
      const user = await userModel.findOne({ refreshToken });

      if (!user) {
        return res.status(403).json({ status: 'Error', message: 'Forbidden' });
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ status: 'Error', message: 'Forbidden' });
        }

        const newAccessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '15m' 
        });

        res.cookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
          status: 'Success',
          message: 'Access token refreshed successfully',
          accessToken: newAccessToken
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

  async forgotPassword(req, res) {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          status: 'Error',
          message: 'User not found'
        });
      }

      const pin = generatePin();
      user.passwordResetPin = pin;
      user.passwordResetExpires = Date.now() + 3600000;
      await user.save();

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
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please use the following PIN to reset your password:\n\n` +
          `${pin}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`
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
          message: 'Password reset email sent successfully'
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

   async verifyPin(req, res) {
    try {
      const user = await userModel.findOne({
        email: req.body.email,
        passwordResetPin: req.body.pin,
        passwordResetExpires: { $gt: Date.now() }
      });
      console.log(user)
      if (!user) {
        return res.status(400).json({
          status: 'Error',
          message: 'PIN is invalid or has expired',
          
        });
      }

      user.pinVerified = true;
      await user.save();

      res.status(200).json({
        status: 'Success',
        message: 'PIN verified successfully',
        data: user
      });
    } catch (err) {
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
      });
    }
  },

  async resetPassword(req, res) {
    try {
      const user = await userModel.findOne({
        email: req.body.email,
        pinVerified: true
      });
      if (!user) {
        return res.status(400).json({
          status: 'Error',
          message: 'PIN verification required'
        });
      }

      const saltRounds = 10;
      user.password = await bcrypt.hash(req.body.password, saltRounds);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.pinVerified = undefined; 
      await user.save();

      res.status(200).json({
        status: 'Success',
        message: 'Password reset successfully'
      });
    } catch (err) {
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
      });
    }
  },

  async logout(req, res) {
    try {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      res.status(200).json({
        status: 'Success',
        message: 'User logged out successfully'
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

export default authController
