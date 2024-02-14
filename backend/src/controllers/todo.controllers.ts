import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Todo, { TodoI } from "../db/models/todo.model";
import { ApiResponse } from "../utils/apiResponse";
import zod from "zod";
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
        tags: zod.array(zod.string().trim()).optional(),
        dueDate: zod.string().datetime().optional(),
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

        const isParentIdValid = mongoose.Types.ObjectId.isValid(
            parsedSchema.data.parent
        )

        if (!isParentIdValid) {
            res
            .status(400)
            .send(new ApiResponse(400, {}, "Parent folder does not exists"));
            return
        }

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
        parent: parsedSchema.data.parent ? new mongoose.Types.ObjectId(parsedSchema.data.parent): null,
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
        id: zod.string(),
        parent: zod.string().optional(),
        title: zod.string().min(3).trim(),
        description: zod.string().min(3).trim(),
        priority: zod.number().min(1).max(3),
        tags: zod.array(zod.string().trim()),
        dueDate: zod.string().datetime().optional(),
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

    if (parsedSchema.data.parent) {
        const isParentIdValid = mongoose.Types.ObjectId.isValid(
            parsedSchema.data.parent
        )

        if (!isParentIdValid) {
            res
            .status(400)
            .send(new ApiResponse(400, {}, "Parent folder does not exists"));
            return
        }
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

    const updatedTodo = await Todo.findOneAndUpdate({ user: req.user?._id, _id: parsedSchema.data.id },{
        parent: parsedSchema.data.parent ? new mongoose.Types.ObjectId(parsedSchema.data.parent): null,
        title: parsedSchema.data.title,
        description: parsedSchema.data.description,
        priority: parsedSchema.data.priority,
        tags: parsedSchema.data.tags,
        dueDate: parsedSchema.data.dueDate,
        isCompleted: false,
    }, { new: true })

    if(!updatedTodo){
        res.status(500).send(new ApiResponse(500, {}, "Todo not found"));
        return;
    }
    
    res.status(200).send(new ApiResponse(200, { todo: updatedTodo }, "Todo updated successfully"));
    
})

// delete todo
const deleteTodo = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const todo = await Todo.findOne({ user: req.user?._id, _id: req.query.id })

        if(!todo){
            res.status(500).send(new ApiResponse(500, {}, "Todo not found"));
            return;
        }

        const todoDeleted = await todo.deleteOne()

        if(!todoDeleted){
            res.status(500).send(new ApiResponse(500, {}, "Something went wrong"));
            return;
        }

        res.status(200).send(new ApiResponse(200, {}, "Todo deleted successfully"));
        return;
    }
)

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

        res.status(200).send(new ApiResponse(200, {}, `Todo marked as ${todo.isCompleted? "completed": "uncompleted"} successfully`));
        return;

    }
)

// toggle isPinned
const toggleIsPinned = asyncHandler(async(req: Request, res: Response): Promise<void> =>{
const todo = await Todo.findOne({ user: req.user?._id, _id: req.query.id })
if (!todo) {
    res.status(500).send(new ApiResponse(500, {}, "Todo not found"));
    return;
}
todo.isPinned = !todo.isPinned;
const savedTodo = await todo.save();
if (!savedTodo) {
    res.status(500).send(new ApiResponse(500, {}, "Something went wrong"));
}    
res.status(200).send(new ApiResponse(200, { }, `Todo ${savedTodo.isPinned? "pinned": "unpinned"} successfully`));

})

// get all todos
const getTodos = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const sortByTime = req.query.sortbytime
    const tagsString = req.query.tags as string
    const sortByPriority = req.query.sortbypriority
    const sortByDueDate = req.query.sortbyduedate
    const parent = req.query.parent
    const isCompeleted = req.query.iscompeleted

    interface SortBy {
        createdAt?: 1 | -1;
        priority?: 1 | -1;
        dueDate?: 1 | -1;
    }

    let sortBy:SortBy = {}

    if(sortByTime === "older"){
        sortBy.createdAt = 1
    }
    else if (sortByPriority === "high") {
        sortBy.priority = -1
    }
    else if (sortByPriority === "low") {
        sortBy.priority = 1
    }
    else if (sortByDueDate === "later") {
        sortBy.dueDate = -1
    }
    else if (sortByDueDate === "earlier") {
        sortBy.dueDate = 1
    }
    else{
        sortBy.createdAt = -1
    }

    interface Filter {
        user: mongoose.Types.ObjectId,
        parent?: string,
        $or?: {tags: {$regex: RegExp}}[],
        isCompleted?: boolean,
    }

    let filter: Filter = {
        user: new mongoose.Types.ObjectId(req.user?._id),
    }
    if (tagsString) {
        const tags: string[] = tagsString.split(',').map(tag => tag.trim())
        filter.$or = tags.map(tag => ({ tags: { $regex: new RegExp(tag, 'i') } }))
    }
    if (parent) {
        filter.parent = parent as string
    }
    if (isCompeleted == "true") {
        filter.isCompleted = true
    }
    else if (isCompeleted == "false") {
        filter.isCompleted = false
    }
    
    console.log(filter)
    const todos = await Todo.find({...filter}).sort({...sortBy})

    if (!todos.length) {
        res.status(404).send(new ApiResponse(404, {}, "No todos found"));
        return
    }

    res
    .status(200)
    .send(new ApiResponse(200, { todos }, "Todos fetched successfully"));
    return

});

export { 
    createTodo, updateTodo, toggleIsCompleted, getTodos, deleteTodo, toggleIsPinned
}