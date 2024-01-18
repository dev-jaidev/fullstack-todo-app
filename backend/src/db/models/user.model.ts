//mongoose user model
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export interface UserI {
  name: string;
  password: string;
  email: string;
  avatar?: string;
}

interface UserMethods {
  isPasswordValid(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
}

type UserModel = mongoose.Model<UserI, {}, UserMethods>;

const userSchema = new mongoose.Schema<UserI, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);

userSchema.pre(
  "save",
  async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
);

userSchema.methods.isPasswordValid = async function (password: string): Promise<boolean>   {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid ? true : false;
};

userSchema.methods.generateAccessToken = async function (): Promise<string> {
  const jwtSecret = process.env.JWT_SECRET;
  const accessTokenExpiry = process.env.JWT_EXPITY;
  if (!jwtSecret) throw new Error("jwtSecret is not defined");
  if (!accessTokenExpiry) throw new Error("accessTokenExpiry is not defined");

  const accessToken = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    jwtSecret,
    {
        expiresIn: accessTokenExpiry,
    }
  );

  return accessToken;
};

const User = mongoose.model<UserI, UserModel>("User", userSchema);

export default User;
