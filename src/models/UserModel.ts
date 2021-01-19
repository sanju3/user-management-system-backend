import mongoose from "mongoose";
import { TempData, User } from "../services";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<User>("User", userSchema);

export const tempRandomData = mongoose.model<TempData>(
  "Authenticate",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
    },
    random: {
      type: String,
    },
  })
);
