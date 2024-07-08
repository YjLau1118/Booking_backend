import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatarImage: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    passwordResetPin: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    pinVerified: {
      type: Boolean
    }
  },
  { timestamps: true }
);

const userModel = model("users", userSchema);

export default userModel;
