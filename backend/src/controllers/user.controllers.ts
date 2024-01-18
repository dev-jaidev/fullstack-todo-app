import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import uploadOnCloudinary from "../utils/uploadOnCloudinary";
import User, { UserI } from "../db/models/user.model";
import zod from "zod";
import { HydratedDocument } from "mongoose";
import fs from "fs";

// sign up controller
const signUp = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // deleting temp avatar file after 2 mins
    const avatar = req.file?.path;
    if (avatar) {
      setTimeout(() => {
        fs.unlinkSync(avatar);
      }, 2 * 60 * 1000); // 2 mins in ms
    }

    // validation
    const userSchema = zod.object({
      name: zod.string().min(3).trim(),
      email: zod.string().email(),
      password: zod.string().min(6),
    });

    const { name, email, password } = req.body;

    const checkSchema = userSchema.safeParse({
      name,
      email,
      password,
    });

    if (!checkSchema.success) {
      res
        .status(400)
        .send(
          new ApiResponse(
            400,
            {},
            checkSchema.error.errors[0].path +
              ": " +
              checkSchema.error.errors[0].message
          )
        );
      return;
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      res.status(409).send(new ApiResponse(409, {}, "User already exist"));
      return;
    }

    let avatarUrl: string = "";

    if (avatar) {
      const cloudRes = await uploadOnCloudinary(avatar);
      if (!cloudRes) {
        res
          .status(500)
          .send(new ApiResponse(500, {}, "error while uploading avatar"));
        return;
      }
      avatarUrl = cloudRes.url;
    }

    // Create a new user
    const newUser: HydratedDocument<UserI> = await User.create({
      name: checkSchema.data.name,
      email: checkSchema.data.email,
      password: checkSchema.data.password,
      avatar: avatarUrl,
    });

    const createdUser = await User.findById(newUser._id).select(
      "-password -__v"
    );
    if (!createdUser) {
      res
        .status(500)
        .send(new ApiResponse(500, {}, "error while creating user"));
      return;
    }

    res
      .status(201)
      .send(new ApiResponse(201, createdUser, "User created successfully"));
  }
);

// login controller
const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {

    // check if user already logged in
    if (req.user) {
      res.status(400).send(new ApiResponse(400, {}, "User already logged in"));
    }

    const password:string = req.body.password;
    const email:string = req.body.email?.toLowerCase();

    if (!(email && password)) {
      res.status(400).send(new ApiResponse(400, {}, "All input is required"));
      return
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send(new ApiResponse(400, {}, "User not found"));
      return
    }

  const isPasswordValid = await user.isPasswordValid(password)

  if (!isPasswordValid) {
    res.status(400).send(new ApiResponse(400, {}, "Invalid Credentials"));
    return
  }

  const accessToken =  await user.generateAccessToken()

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
  })

  .status(200).send(new ApiResponse(200, {accessToken}, "Login Successful"))
  return
  }
);

// update user details controller
const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {name} = req.body;
    if (!name) {
      res.status(400).send(new ApiResponse(400, {}, "Name is required"));
      return
    }
    const userId = req.user?._id;
    const updatedUser = await User.findByIdAndUpdate(userId, {name}, {new: true}).select("-password -__v");
    if (!updatedUser) {
      res.status(500).send(new ApiResponse(500, {}, "error while updating user"));
      return
    }
    res.status(200).send(new ApiResponse(200, updatedUser, "User updated successfully"));
    return
  }
)

// update avatar controller
const updateAvatar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {

    const avatar = req.file?.path;
    if (!avatar) {
      res.status(400).send(new ApiResponse(400, {}, "Avatar is required"));
      return
    }
    const userId = req.user?._id;
    const cloudRes = await uploadOnCloudinary(avatar);
    if (!cloudRes) {
      res
        .status(500)
        .send(new ApiResponse(500, {}, "error while uploading avatar"));
      return
    }
    const avatarUrl = cloudRes.url;
    const updatedUser = await User.findByIdAndUpdate(userId, {avatar: avatarUrl}, {new: true}).select("-password -__v");
    if (!updatedUser) {
      res.status(500).send(new ApiResponse(500, {}, "error while updating user"));
      return
    }
    res.status(200).send(new ApiResponse(200, updatedUser, "User updated successfully"));
    return
  })

// change password controller
const changePassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {

    const passwordSchema = zod.string().min(6);

    const {oldPassword, newPassword} = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send(new ApiResponse(400, {}, "All input is required"));
      return
    }
    const isNewPasswordValid = passwordSchema.safeParse(newPassword);
    if (!isNewPasswordValid.success) {
      res.status(400).send(new ApiResponse(400, {}, "Password must be 6 characters long"));
      return
    }

    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).send(new ApiResponse(400, {}, "User not found"));
      return
    }

      const isOldPasswordValid = await user.isPasswordValid(oldPassword);
      if (!isOldPasswordValid) {  
        res.status(400).send(new ApiResponse(400, {}, "Invalid old password"));
        return
      }
      user.password = newPassword;
      const updatedUser = await user.save();

      if (!updatedUser) {
        res.status(500).send(new ApiResponse(500, {}, "error while updating user"));
        return
      }

      res.status(200).send(new ApiResponse(200, updatedUser, "User updated successfully"));
      return
  

  })




export { signUp,
  login,
  updateUser,
  updateAvatar,
  changePassword,
 };
