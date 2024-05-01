"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const folderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    parent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Folder",
        index: true,
    },
    name: {
        type: String,
        index: true,
        default: "New Folder",
        trim: true
    },
}, { timestamps: true });
const Folder = mongoose_1.default.model("Folder", folderSchema);
exports.default = Folder;
