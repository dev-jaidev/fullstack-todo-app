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
exports.getAllTags = exports.toggleIsPinned = exports.deleteTodo = exports.getTodos = exports.toggleIsCompleted = exports.updateTodo = exports.createTodo = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const todo_model_1 = __importDefault(require("../db/models/todo.model"));
const apiResponse_1 = require("../utils/apiResponse");
const zod_1 = __importDefault(require("zod"));
const mongoose_1 = __importDefault(require("mongoose"));
const folder_model_1 = __importDefault(require("../db/models/folder.model"));
// create new todo
const createTodo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const todoSchema = zod_1.default.object({
        parent: zod_1.default.string().optional(),
        title: zod_1.default.string().min(3).trim(),
        description: zod_1.default.string().min(3).trim(),
        priority: zod_1.default.number().min(1).max(3),
        tags: zod_1.default.array(zod_1.default.string().trim()).optional(),
        dueDate: zod_1.default
            .string()
            .superRefine((str, ctx) => {
            try {
                const date = new Date(str);
                return date.toISOString();
            }
            catch (error) {
                return ctx.addIssue({
                    code: zod_1.default.ZodIssueCode.custom,
                    message: "Invalid date format",
                });
            }
        })
            .optional(),
    });
    const parsedSchema = todoSchema.safeParse({
        parent: req.body.parent,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        tags: req.body.tags,
        dueDate: req.body.dueDate,
    });
    if (!parsedSchema.success) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, parsedSchema.error.errors[0].path +
            ": " +
            parsedSchema.error.errors[0].message));
        return;
    }
    // if parent exists with this user or not
    if (parsedSchema.data.parent) {
        const isParentIdValid = mongoose_1.default.Types.ObjectId.isValid(parsedSchema.data.parent);
        if (!isParentIdValid) {
            res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "Parent folder does not exists"));
            return;
        }
        const isFolderExists = yield folder_model_1.default.findOne({
            user: new mongoose_1.default.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
            _id: new mongoose_1.default.Types.ObjectId(parsedSchema.data.parent),
        });
        if (!isFolderExists) {
            res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "Parent folder does not exists"));
            return;
        }
    }
    const newTodo = yield todo_model_1.default.create({
        user: new mongoose_1.default.Types.ObjectId((_b = req.user) === null || _b === void 0 ? void 0 : _b._id),
        parent: parsedSchema.data.parent
            ? new mongoose_1.default.Types.ObjectId(parsedSchema.data.parent)
            : null,
        title: parsedSchema.data.title,
        description: parsedSchema.data.description,
        priority: parsedSchema.data.priority,
        tags: parsedSchema.data.tags,
        dueDate: parsedSchema.data.dueDate,
        isCompleted: false,
    });
    if (!newTodo) {
        res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Something went wrong"));
        return;
    }
    res.status(200).send(new apiResponse_1.ApiResponse(200, { todo: newTodo }, "Todo created successfully"));
}));
exports.createTodo = createTodo;
// update todo
const updateTodo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const todoSchema = zod_1.default.object({
        id: zod_1.default.string(),
        parent: zod_1.default.string().optional(),
        title: zod_1.default.string().min(3).trim(),
        description: zod_1.default.string().min(3).trim(),
        priority: zod_1.default.number().min(1).max(3),
        tags: zod_1.default.array(zod_1.default.string().trim()),
        dueDate: zod_1.default
            .string()
            .superRefine((str, ctx) => {
            try {
                const date = new Date(str);
                return date.toISOString();
            }
            catch (error) {
                return ctx.addIssue({
                    code: zod_1.default.ZodIssueCode.custom,
                    message: "Invalid date format",
                });
            }
        })
            .optional(),
    });
    const parsedSchema = todoSchema.safeParse({
        id: req.body.id,
        parent: req.body.parent,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        tags: req.body.tags,
        dueDate: req.body.dueDate,
    });
    if (!parsedSchema.success) {
        res.status(400).send(new apiResponse_1.ApiResponse(400, {}, parsedSchema.error.errors[0].path +
            ": " +
            parsedSchema.error.errors[0].message));
        return;
    }
    if (parsedSchema.data.parent) {
        const isParentIdValid = mongoose_1.default.Types.ObjectId.isValid(parsedSchema.data.parent);
        if (!isParentIdValid) {
            res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "Parent folder does not exists"));
            return;
        }
        const isFolderExists = yield folder_model_1.default.findOne({
            user: new mongoose_1.default.Types.ObjectId((_c = req.user) === null || _c === void 0 ? void 0 : _c._id),
            _id: new mongoose_1.default.Types.ObjectId(parsedSchema.data.parent),
        });
        if (!isFolderExists) {
            res.status(400).send(new apiResponse_1.ApiResponse(400, {}, "Parent folder does not exists"));
            return;
        }
    }
    const updatedTodo = yield todo_model_1.default.findOneAndUpdate({ user: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id, _id: parsedSchema.data.id }, {
        parent: parsedSchema.data.parent
            ? new mongoose_1.default.Types.ObjectId(parsedSchema.data.parent)
            : null,
        title: parsedSchema.data.title,
        description: parsedSchema.data.description,
        priority: parsedSchema.data.priority,
        tags: parsedSchema.data.tags,
        dueDate: parsedSchema.data.dueDate,
        isCompleted: false,
    }, { new: true });
    if (!updatedTodo) {
        res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Todo not found"));
        return;
    }
    res.status(200).send(new apiResponse_1.ApiResponse(200, { todo: updatedTodo }, "Todo updated successfully"));
}));
exports.updateTodo = updateTodo;
// delete todo
const deleteTodo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const todo = yield todo_model_1.default.findOne({
        user: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
        _id: req.query.id,
    });
    if (!todo) {
        res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Todo not found"));
        return;
    }
    const todoDeleted = yield todo.deleteOne();
    if (!todoDeleted) {
        res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Something went wrong"));
        return;
    }
    res.status(200).send(new apiResponse_1.ApiResponse(200, {}, "Todo deleted successfully"));
    return;
}));
exports.deleteTodo = deleteTodo;
// toggle isCompleted status
const toggleIsCompleted = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const todo = yield todo_model_1.default.findOne({
        user: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id,
        _id: req.query.id,
    });
    if (!todo) {
        res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Todo not found"));
        return;
    }
    todo.isCompleted = !todo.isCompleted;
    const todoUpadated = yield todo.save();
    if (!todoUpadated) {
        res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Something went wrong"));
        return;
    }
    res.status(200).send(new apiResponse_1.ApiResponse(200, {}, `Todo marked as ${todo.isCompleted ? "completed" : "uncompleted"} successfully`));
    return;
}));
exports.toggleIsCompleted = toggleIsCompleted;
// toggle isPinned
const toggleIsPinned = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const todo = yield todo_model_1.default.findOne({
        user: (_g = req.user) === null || _g === void 0 ? void 0 : _g._id,
        _id: req.query.id,
    });
    if (!todo) {
        res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Todo not found"));
        return;
    }
    todo.isPinned = !todo.isPinned;
    const savedTodo = yield todo.save();
    if (!savedTodo) {
        res.status(500).send(new apiResponse_1.ApiResponse(500, {}, "Something went wrong"));
    }
    res.status(200).send(new apiResponse_1.ApiResponse(200, {}, `Todo ${savedTodo.isPinned ? "pinned" : "unpinned"} successfully`));
}));
exports.toggleIsPinned = toggleIsPinned;
// get all todos
const getTodos = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const { sortbytime, tags, sortbypriority, sortbyduedate, parent, iscompeleted, } = req.query;
    let sortBy = {};
    if (sortbytime === "older") {
        sortBy.createdAt = 1;
    }
    else if (sortbypriority === "high") {
        sortBy.priority = -1;
    }
    else if (sortbypriority === "low") {
        sortBy.priority = 1;
    }
    else if (sortbyduedate === "later") {
        sortBy.dueDateSort = -1;
    }
    else if (sortbyduedate === "earlier") {
        sortBy.dueDateSort = 1;
    }
    else {
        sortBy.createdAt = -1;
    }
    let filter = {
        user: new mongoose_1.default.Types.ObjectId((_h = req.user) === null || _h === void 0 ? void 0 : _h._id),
    };
    if (tags) {
        const tagsArray = tags
            .split(",")
            .map((tag) => tag.trim());
        filter.$or = tagsArray.map((tag) => ({
            tags: { $regex: new RegExp(tag, "i") },
        }));
    }
    if (parent) {
        filter.parent = new mongoose_1.default.Types.ObjectId(parent);
    }
    if (iscompeleted === "true" || iscompeleted === "false") {
        filter.isCompleted = iscompeleted === "true";
    }
    const todos = yield todo_model_1.default.aggregate([
        { $match: filter },
        {
            $addFields: {
                dueDateSort: {
                    $cond: {
                        if: {
                            $or: [
                                { $eq: ["$dueDate", null] },
                                {
                                    $eq: [
                                        { $ifNull: ["$dueDate", null] },
                                        null,
                                    ],
                                },
                            ],
                        },
                        then: new Date("9999-12-31T23:59:59.999Z"),
                        else: "$dueDate",
                    },
                },
            },
        },
        {
            $sort: Object.assign({}, sortBy),
        },
        {
            $project: {
                dueDateSort: 0,
            },
        },
    ]);
    if (!todos.length) {
        res.status(404).send(new apiResponse_1.ApiResponse(404, {}, "No todos found"));
        return;
    }
    res.status(200).send(new apiResponse_1.ApiResponse(200, { todos }, "Todos fetched successfully"));
    return;
}));
exports.getTodos = getTodos;
// get all available tags with their todo count
const getAllTags = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const tags = yield todo_model_1.default.aggregate([
        { $match: { user: new mongoose_1.default.Types.ObjectId((_j = req.user) === null || _j === void 0 ? void 0 : _j._id) } },
        {
            $unwind: "$tags",
        },
        {
            $group: {
                _id: "$tags",
                todoCount: { $sum: 1 },
            },
        },
    ]);
    if (!tags.length) {
        res.status(404).send(new apiResponse_1.ApiResponse(404, {}, "No tags found"));
        return;
    }
    res.status(200).send(new apiResponse_1.ApiResponse(200, { tags }, "tags fetched successfully"));
}));
exports.getAllTags = getAllTags;
