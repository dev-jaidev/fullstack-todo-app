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
//mongoose user model
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userSchema = new mongoose_1.default.Schema({
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
        index: true,
    },
    avatar: {
        type: String,
        default: ''
    },
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, 10);
        next();
    });
});
userSchema.methods.isPasswordValid = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const isValid = yield bcrypt_1.default.compare(password, this.password);
        return isValid ? true : false;
    });
};
userSchema.methods.generateAccessToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const jwtSecret = process.env.JWT_SECRET;
        const accessTokenExpiry = process.env.JWT_EXPITY;
        if (!jwtSecret)
            throw new Error("jwtSecret is not defined");
        if (!accessTokenExpiry)
            throw new Error("accessTokenExpiry is not defined");
        const accessToken = jsonwebtoken_1.default.sign({
            _id: this._id,
            name: this.name,
            email: this.email,
        }, jwtSecret, {
            expiresIn: accessTokenExpiry,
        });
        return accessToken;
    });
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
