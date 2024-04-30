import mongoose from "mongoose";

export interface TodoI {
    user: mongoose.Types.ObjectId;
    parent?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    isCompleted?: boolean;
    priority: 1 | 2 | 3;
    dueDate?: Date;
    tags?: mongoose.Types.Array<string>;
    isPinned: boolean
}

const todoSchema = new mongoose.Schema<TodoI>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',       
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    },
    title:{
        type: String,
        required: true,
        index: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    isCompleted:{
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    priority:{
        type: Number,
        required: true
    },
    dueDate:{
        type: Date,
        default: null
    },
    tags: {
        type: [String],
    }
}, {timestamps: true})


const Todo = mongoose.model<TodoI>('Todo', todoSchema)

export default Todo
