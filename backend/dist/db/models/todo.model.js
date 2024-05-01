"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const todoSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    parent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Folder',
    },
    title: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    priority: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        default: null
    },
    tags: {
        type: [String],
    }
}, { timestamps: true });
const Todo = mongoose_1.default.model('Todo', todoSchema);
exports.default = Todo;
