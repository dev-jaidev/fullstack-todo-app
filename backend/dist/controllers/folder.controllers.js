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
exports.deleteFolder = exports.updateFolder = exports.getFolders = exports.createFolder = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const folder_model_1 = __importDefault(require("../db/models/folder.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const apiResponse_1 = require("../utils/apiResponse");
const todo_model_1 = __importDefault(require("../db/models/todo.model"));
// create new folder
const createFolder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, parent } = req.body;
    if (parent) {
        const isParentIdValid = mongoose_1.default.Types.ObjectId.isValid(parent);
        if (!isParentIdValid) {
            res
                .status(400)
                .send(new apiResponse_1.ApiResponse(400, {}, "Parent folder does not exists"));
            return;
        }
        const isFolderExists = yield folder_model_1.default.findOne({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            _id: parent,
        });
        if (!isFolderExists) {
            res
                .status(400)
                .send(new apiResponse_1.ApiResponse(400, {}, "Parent folder does not exists"));
            return;
        }
    }
    const newFolder = yield folder_model_1.default.create({
        user: new mongoose_1.default.Types.ObjectId((_b = req.user) === null || _b === void 0 ? void 0 : _b._id),
        parent: parent ? parent : null,
        name: name ? name : "Untitled Folder"
    });
    if (!newFolder) {
        res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Something went wrong"));
        return;
    }
    res
        .status(200)
        .send(new apiResponse_1.ApiResponse(200, { folder: newFolder }, "Folder created successfully"));
    return;
}));
exports.createFolder = createFolder;
// get folders
const getFolders = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    let parent = req.query.parent;
    let folders = [];
    if (parent) {
        const isParentIdValid = mongoose_1.default.Types.ObjectId.isValid(parent);
        if (isParentIdValid) {
            folders = yield folder_model_1.default.find({
                user: new mongoose_1.default.Types.ObjectId((_c = req.user) === null || _c === void 0 ? void 0 : _c._id),
                parent: new mongoose_1.default.Types.ObjectId(parent)
            });
        }
    }
    else {
        folders = yield folder_model_1.default.find({
            user: new mongoose_1.default.Types.ObjectId((_d = req.user) === null || _d === void 0 ? void 0 : _d._id)
        });
    }
    if (!folders.length) {
        res
            .status(404)
            .send(new apiResponse_1.ApiResponse(404, {}, "Folders not found"));
        return;
    }
    res.status(200).send(new apiResponse_1.ApiResponse(200, { folders }, "Folders fetched successfully"));
    return;
}));
exports.getFolders = getFolders;
// update folder
const updateFolder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    const { id, name, parent } = req.body;
    const isIdValid = mongoose_1.default.Types.ObjectId.isValid(id);
    if (!isIdValid) {
        res
            .status(400)
            .send(new apiResponse_1.ApiResponse(400, {}, "Folder does not exists"));
        return;
    }
    const isFolderExists = yield folder_model_1.default.findOne({
        user: new mongoose_1.default.Types.ObjectId((_e = req.user) === null || _e === void 0 ? void 0 : _e._id),
        _id: new mongoose_1.default.Types.ObjectId(id),
    });
    if (!isFolderExists) {
        res
            .status(400)
            .send(new apiResponse_1.ApiResponse(400, {}, "Folder does not exists"));
        return;
    }
    if (parent) {
        const isParentIdValid = mongoose_1.default.Types.ObjectId.isValid(parent);
        if (!isParentIdValid) {
            res
                .status(400)
                .send(new apiResponse_1.ApiResponse(400, {}, "Parent folder does not exists"));
            return;
        }
        const isParentFolderExists = yield folder_model_1.default.findOne({
            user: new mongoose_1.default.Types.ObjectId((_f = req.user) === null || _f === void 0 ? void 0 : _f._id),
            _id: new mongoose_1.default.Types.ObjectId(parent),
        });
        if (!isParentFolderExists) {
            res
                .status(400)
                .send(new apiResponse_1.ApiResponse(400, {}, "Parent folder does not exists"));
            return;
        }
    }
    if (parent == id) {
        res
            .status(400)
            .send(new apiResponse_1.ApiResponse(400, {}, "Parent folder cannot be same as folder"));
        return;
    }
    const updatedFolder = yield folder_model_1.default.findOneAndUpdate({ user: new mongoose_1.default.Types.ObjectId((_g = req.user) === null || _g === void 0 ? void 0 : _g._id), _id: new mongoose_1.default.Types.ObjectId(id) }, { name: name ? name : "Untitled Folder", parent: parent ? parent : null }, { new: true });
    if (!updatedFolder) {
        res
            .status(500)
            .send(new apiResponse_1.ApiResponse(500, {}, "Something went wrong"));
        return;
    }
    res
        .status(200)
        .send(new apiResponse_1.ApiResponse(200, { folder: updatedFolder }, "Folder updated successfully"));
    return;
}));
exports.updateFolder = updateFolder;
// delete folder
const deleteFolder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k;
    // create mongoose session
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    const id = req.query.id;
    const isIdValid = mongoose_1.default.Types.ObjectId.isValid(id);
    if (!isIdValid) {
        res
            .status(400)
            .send(new apiResponse_1.ApiResponse(400, {}, "Folder does not exists"));
        return;
    }
    const isFolderExists = yield folder_model_1.default.findOne({
        user: new mongoose_1.default.Types.ObjectId((_h = req.user) === null || _h === void 0 ? void 0 : _h._id),
        _id: new mongoose_1.default.Types.ObjectId(id),
    });
    if (!isFolderExists) {
        res
            .status(400)
            .send(new apiResponse_1.ApiResponse(400, {}, "Folder does not exists"));
        return;
    }
    const deletedFolder = yield folder_model_1.default.deleteMany({ user: new mongoose_1.default.Types.ObjectId((_j = req.user) === null || _j === void 0 ? void 0 : _j._id), $or: [{ _id: new mongoose_1.default.Types.ObjectId(id) }, { parent: new mongoose_1.default.Types.ObjectId(id) }] });
    const delteTodos = yield todo_model_1.default.deleteMany({ user: new mongoose_1.default.Types.ObjectId((_k = req.user) === null || _k === void 0 ? void 0 : _k._id), parent: new mongoose_1.default.Types.ObjectId(id) });
    if (!(deletedFolder && delteTodos)) {
        res
            .status(500)
            .send(new apiResponse_1.ApiResponse(500, {}, "Something went wrong"));
        session.abortTransaction();
        return;
    }
    res
        .status(200)
        .send(new apiResponse_1.ApiResponse(200, {}, "Folder deleted successfully"));
    session.commitTransaction();
    return;
}));
exports.deleteFolder = deleteFolder;
