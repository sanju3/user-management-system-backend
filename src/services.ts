import { tempRandomData, UserModel } from "./models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface UserJ {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  status: boolean;
}

interface UserJWT {
  username: string;
  firstname: string;
  lastname: string;
}

interface TempDataJ {
  username: string;
  random: string;
}

export interface User extends mongoose.Document {
  _id?: string;
  username: string;
  firstname: string;
  lastname: string;
  status: boolean;
  password: string;
}

export interface TempData extends mongoose.Document {
  _id: string;
  username: string;
  random: string;
}

export const getSingleUser = async (username: string) => {
  const user = await UserModel.findOne({ username });
  return user;
};

export const getUserTemporyData = async (username: string) => {
  const tempData = await tempRandomData.findOne({
    username,
  });
  return {
    username: tempData?.username,
    random: tempData?.random,
  };
};

export const compairPassword = async (password: string, hash: string) => {
  const compair = await bcrypt.compare(password, hash);
  if (compair) {
    return true;
  }
  return false;
};

export const hashPassword = async (password: string, salt: number) => {
  return await bcrypt.hash(password, salt);
};

export const createToken = (payload: UserJWT, key: string, options = {}) => {
  return jwt.sign(payload, key, options);
};

export const saveUser = async (user: User) => {
  return await user.save();
};

export const deleteTempData = async (username: string) => {
  return await tempRandomData.deleteOne({ username });
};

export const createUser = async (user: UserJ) => {
  const newUser = new UserModel(user);
  return await newUser.save();
};

export const createTempRandom = async (random: TempDataJ) => {
  const randomData = new tempRandomData(random);
  return await randomData.save();
};
