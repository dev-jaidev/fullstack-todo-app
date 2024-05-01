"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.changePassword = exports.updateAvatar = exports.updateUser = exports.login = exports.signUp = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const uploadOnCloudinary_1 = __importDefault(require("../utils/uploadOnCloudinary"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
const zod_1 = __importDefault(require("zod"));
const fs_1 = __importDefault(require("fs"));
// sign up controller
const signUp = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // deleting temp avatar file after 2 mins
    const avatar = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (avatar) {
        setTimeout(() => {
            fs_1.default.unlinkSync(avatar);
        }, 2 * 60 * 1000); // 2 mins in ms
    }
    // validation
    const userSchema = zod_1.default.object({
        name: zod_1.default.string().min(3).trim(),
        email: zod_1.default.string().email(),
        password: zod_1.default.string().min(6),
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
            .send(new apiResponse_1.ApiResponse(400, {}, checkSchema.error.errors[0].path +
            ": " +
            checkSchema.error.errors[0].message));
        return;
    }
    const isUserExist = yield user_model_1.default.findOne({ email });
    if (isUserExist) {
        res.status(409).send(new apiResponse_1.ApiResponse(409, {}, "User already exist"));
        return;
    }
    let avatarUrl = "";
    if (avatar) {
        const cloudRes = yield (0, uploadOnCloudinary_1.default)(avatar);
        if (!cloudRes) {
            res
                .status(500)
                .send(new apiResponse_1.ApiResponse(500, {}, "error while uploading avatar"));
            return;
        }
        avatarUrl = cloudRes.url;
    }
    // Create a new user
    const newUser = yield user_model_1.default.create({
        name: checkSchema.data.name,
        email: checkSchema.data.email,
        password: checkSchema.data.password,
        avatar: avatarUrl,
    });
    const createdUser = yield user_model_1.default.findById(newUser._id).select("-password -__v");
    if (!createdUser) {
        res
            .status(500)
            .send(new apiResponse_1.ApiResponse(500, {}, "error while creating user"));
        return;
    }
    res
        .status(201)
        .send(new apiResponse_1.ApiResponse(201, { user: createdUser }, "User created successfully"));
}));
exports.signUp = signUp;
// login controller
const login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // check if user already logged in
    if ("user" in req) {
        if (req.user) {
            res
                .status(400)
                .send(new apiResponse_1.ApiResponse(400, {}, "User already logged in"));
        }
        return;
    }
    const password = req.body.password;
    const email = (_b = req.body.email) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    if (!(email && password)) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "All input is required"));
        return;
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "User not found"));
        return;
    }
    const isPasswordValid = yield user.isPasswordValid(password);
    if (!isPasswordValid) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "Invalid Credentials"));
        return;
    }
    const accessToken = yield user.generateAccessToken();
    res
        .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })
        .status(200)
        .send(new apiResponse_1.ApiResponse(200, { accessToken }, "Login Successful"));
    return;
}));
exports.login = login;
// update user details controller
const updateUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { name } = req.body;
    if (!name) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "Name is required"));
        return;
    }
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { name }, { new: true }).select("-password -__v");
    if (!updatedUser) {
        res
            .status(500)
            .send(new apiResponse_1.ApiResponse(500, {}, "error while updating user"));
        return;
    }
    res
        .status(200)
        .send(new apiResponse_1.ApiResponse(200, { user: updatedUser }, "User updated successfully"));
    return;
}));
exports.updateUser = updateUser;
// update avatar controller
const updateAvatar = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const avatar = (_d = req.file) === null || _d === void 0 ? void 0 : _d.path;
    if (!avatar) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "Avatar is required"));
        return;
    }
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
    const cloudRes = yield (0, uploadOnCloudinary_1.default)(avatar);
    if (!cloudRes) {
        res
            .status(500)
            .send(new apiResponse_1.ApiResponse(500, {}, "error while uploading avatar"));
        return;
    }
    const avatarUrl = cloudRes.url;
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select("-password -__v");
    if (!updatedUser) {
        res
            .status(500)
            .send(new apiResponse_1.ApiResponse(500, {}, "error while updating user"));
        return;
    }
    res
        .status(200)
        .send(new apiResponse_1.ApiResponse(200, { user: updatedUser }, "User avatar updated successfully"));
    return;
}));
exports.updateAvatar = updateAvatar;
// change password controller
const changePassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const passwordSchema = zod_1.default.string().min(6);
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "All input is required"));
        return;
    }
    const isNewPasswordValid = passwordSchema.safeParse(newPassword);
    if (!isNewPasswordValid.success) {
        res
            .status(400)
            .send(new apiResponse_1.ApiResponse(400, {}, "Password must be 6 characters long"));
        return;
    }
    const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f._id;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "User not found"));
        return;
    }
    const isOldPasswordValid = yield user.isPasswordValid(oldPassword);
    if (!isOldPasswordValid) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "Invalid old password"));
        return;
    }
    user.password = newPassword;
    const updatedUser = yield user.save();
    if (!updatedUser) {
        res
            .status(500)
            .send(new apiResponse_1.ApiResponse(500, {}, "error while updating password"));
        return;
    }
    res
        .status(200)
        .send(new apiResponse_1.ApiResponse(200, {}, "User password updated successfully"));
    return;
}));
exports.changePassword = changePassword;
// get current user controller
const getCurrentUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g._id;
    const user = yield user_model_1.default.findById(userId).select("-password -__v");
    if (!user) {
        res
            .status(400)
            .send(new apiResponse_1.ApiResponse(400, {}, "User not found"));
        return;
    }
    res
        .status(200)
        .send(new apiResponse_1.ApiResponse(200, { user: user }, "User fetched successfully"));
    return;
}));
exports.getCurrentUser = getCurrentUser;
