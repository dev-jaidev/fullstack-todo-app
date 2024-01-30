import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Todo, { TodoI } from "../db/models/todo.model";
import { ApiResponse } from "../utils/apiResponse";
import zod from "zod";
import exp from "constants";
import mongoose, { HydratedDocument } from "mongoose";
import Folder from "../db/models/folder.model";

// create new todo
const createTodo = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
    const todoSchema = zod.object({
        parent: zod.string().optional(),
        title: zod.string().min(3).trim(),
        description: zod.string().min(3).trim(),
        priority: zod.number().min(1).max(3),
        tags: zod.array(zod.string()),
        dueDate: zod.date(),
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
    res
        .status(400)
        .send(
        new ApiResponse(
            400,
            {},
            parsedSchema.error.errors[0].path +
            ": " +
            parsedSchema.error.errors[0].message
        )
        );
    return;
    }

    // if parent exists with this user or not
    if (parsedSchema.data.parent) {
        const isFolderExists = await Folder.findOne({
            user: new mongoose.Types.ObjectId(req.user?._id),
            _id: new mongoose.Types.ObjectId(parsedSchema.data.parent),
        });

        if (!isFolderExists) {
            res
            .status(400)
            .send(new ApiResponse(400, {}, "Parent folder does not exists"));
            return
        }
    }

    const newTodo:HydratedDocument<TodoI> = await Todo.create({
        user: new mongoose.Types.ObjectId(req.user?._id),
        parent: new mongoose.Types.ObjectId(parsedSchema.data.parent),
        title: parsedSchema.data.title,
        description: parsedSchema.data.description,
        priority: parsedSchema.data.priority,
        tags: parsedSchema.data.tags,
        dueDate: parsedSchema.data.dueDate,
        isCompleted: false,
    })

    if(!newTodo){
        res.status(500).send(new ApiResponse(500, {}, "Something went wrong"));
        return;
    }
    
    res.status(200).send(new ApiResponse(200, { todo: newTodo }, "Todo created successfully"));

    }
);

// update todo
const updateTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const todoSchema = zod.object({
        parent: zod.string().optional(),
        title: zod.string().min(3).trim(),
        description: zod.string().min(3).trim(),
        priority: zod.number().min(1).max(3),
        tags: zod.array(zod.string()),
        dueDate: zod.date(),
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
    res
        .status(400)
        .send(
        new ApiResponse(
            400,
            {},
            parsedSchema.error.errors[0].path +
            ": " +
            parsedSchema.error.errors[0].message
        )
        );
    return;
    }

    const newTodo = await Todo.findOneAndUpdate({ user: req.user?._id, _id: req.query.id }, parsedSchema.data, { new: true })

    if(!newTodo){
        res.status(500).send(new ApiResponse(500, {}, "Todo not found"));
        return;
    }
    
    res.status(200).send(new ApiResponse(200, { todo: newTodo }, "Todo updated successfully"));
    
})

// toggle isCompleted status
const toggleIsCompleted = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const todo = await Todo.findOne({ user: req.user?._id, _id: req.query.id })

        if(!todo){
            res.status(500).send(new ApiResponse(500, {}, "Todo not found"));
            return;
        }

        todo.isCompleted = !todo.isCompleted;

        const todoUpadated = await todo.save()

        if(!todoUpadated){
            res.status(500).send(new ApiResponse(500, {}, "Something went wrong"));
            return;
        }

        res.status(200).send(new ApiResponse(200, { todo }, "Todo updated successfully"));
        return;

    }
)

// get all todos
const getTodos = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const sortByTime = req.query.sortbytime
    const tagsString = req.query.tags;
    const sortByPriority = req.query.sortbypriority
    const sortByDueDate = req.query.sortbyduedate

    interface SortBy {
        createdAt: 1 | -1;
        priority?: 1 | -1;
        dueDate?: 1 | -1;
    }

    let sortBy:SortBy = {
        createdAt: -1
    }

    if(sortByTime === "older"){
        sortBy.createdAt = 1
    }

    if (sortByPriority === "high") {
        sortBy.priority = -1
    }
    else if (sortByPriority === "low") {
        sortBy.priority = 1
    }

    if (sortByDueDate === "later") {
        sortBy.dueDate = -1
    }
    else if (sortByDueDate === "earlier") {
        sortBy.dueDate = 1
    }
    
    let todos: HydratedDocument<TodoI>[] = [];

    if (tagsString) {
        const tags: string[] = JSON.stringify(tagsString).split(',')
        todos = await Todo.find({ user: req.user?._id, tags: {$in: tags}  }).sort({...sortBy});
    }

    todos = await Todo.find({ user: req.user?._id, }).sort({...sortBy});

    if (!todos) {
        res.status(404).send(new ApiResponse(404, {}, "No todos found"));
        return
    }

    res
    .status(200)
    .send(new ApiResponse(200, { todos }, "Todos fetched successfully"));
    return

});

export { 
    createTodo, updateTodo, toggleIsCompleted, getTodos
}