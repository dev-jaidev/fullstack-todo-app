import mongoose from "mongoose";

export interface TodoI {
    user: mongoose.Types.ObjectId;
    parent?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    isCompleted: boolean;
    priority: 1 | 2 | 3;
    dueDate?: Date;
    tags?: mongoose.Types.Array<string>;
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
        index: true
    },
    description:{
        type: String,
        required: true,
    },
    isCompleted:{
        type: Boolean,
        required: true
    },
    priority:{
        type: Number,
        required: true
    },
    dueDate:{
        type: Date
    },
    tags: {
        type: [String],
    }
}, {timestamps: true})


const Todo = mongoose.model<TodoI>('Todo', todoSchema)

export default Todo
