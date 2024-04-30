import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import Folder, { FolderI } from "../db/models/folder.model";
import mongoose, { HydratedDocument } from "mongoose";
import { ApiResponse } from "../utils/apiResponse";
import Todo from "../db/models/todo.model";

// create new folder
const createFolder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {name, parent } = req.body;
    
    if (parent) {

        const isParentIdValid = mongoose.Types.ObjectId.isValid(parent);

        if (!isParentIdValid) {
            res
            .status(400)
            .send(new ApiResponse(400, {}, "Parent folder does not exists"));
            return
        }

        const isFolderExists = await Folder.findOne({
            user: req.user?._id,
            _id: parent,
        });
        
        if (!isFolderExists) {
            res
            .status(400)
            .send(new ApiResponse(400, {}, "Parent folder does not exists"));
            return
        }
    }

    const newFolder = await Folder.create<FolderI>({
        user: new mongoose.Types.ObjectId(req.user?._id),
        parent: parent? parent : null,
        name: name? name : "Untitled Folder"
    })

    if(!newFolder){
        res.status(500).send(new ApiResponse(500, {}, "Something went wrong"));
        return;
    }

    res
    .status(200)
    .send(new ApiResponse(200, { folder: newFolder }, "Folder created successfully"));
    return;
})

// get folders
const getFolders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let parent = req.query.parent as string

    let folders: HydratedDocument<FolderI>[] = []

    if (parent) {
        const isParentIdValid = mongoose.Types.ObjectId.isValid(parent);

        if(isParentIdValid){
            folders = await Folder.find({
                user: new mongoose.Types.ObjectId(req.user?._id),
                parent: new mongoose.Types.ObjectId(parent)
            })
        }
    }
    else{
        folders = await Folder.find({
            user: new mongoose.Types.ObjectId(req.user?._id)
        })
    }

    if (!folders.length) {
        res
        .status(404)
        .send(new ApiResponse(404, {}, "Folders not found"));
        return
    }

    res.status(200).send(new ApiResponse(200, { folders }, "Folders fetched successfully"));
    return;
})

// update folder
const updateFolder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {id, name, parent} = req.body

    const isIdValid = mongoose.Types.ObjectId.isValid(id);

    if (!isIdValid) {
        res
        .status(400)
        .send(new ApiResponse(400, {}, "Folder does not exists"));
        return
    }

    const isFolderExists = await Folder.findOne({
        user: new mongoose.Types.ObjectId(req.user?._id),
        _id: new mongoose.Types.ObjectId(id),
    })
 

    if (!isFolderExists) {
        res
        .status(400)
        .send(new ApiResponse(400, {}, "Folder does not exists"));
        return
    }


    if (parent) {
        const isParentIdValid = mongoose.Types.ObjectId.isValid(parent);

        if (!isParentIdValid) {
            res
            .status(400)
            .send(new ApiResponse(400, {}, "Parent folder does not exists"));
            return
        }

        const isParentFolderExists = await Folder.findOne({
            user: new mongoose.Types.ObjectId(req.user?._id),
            _id: new mongoose.Types.ObjectId(parent),
        });
        
        if (!isParentFolderExists) {
            res
            .status(400)
            .send(new ApiResponse(400, {}, "Parent folder does not exists"));
            return
        }

    }
    
    if (parent == id) {
        res
        .status(400)
        .send(new ApiResponse(400, {}, "Parent folder cannot be same as folder"));
        return
    }

    const updatedFolder = await Folder.findOneAndUpdate(
        {user: new mongoose.Types.ObjectId(req.user?._id), _id: new mongoose.Types.ObjectId(id)},
        {name: name? name : "Untitled Folder", parent: parent? parent : null}, {new: true})

    if(!updatedFolder){
        res
        .status(500)
        .send(new ApiResponse(500, {}, "Something went wrong"));
        return
    }

    res
    .status(200)
    .send(new ApiResponse(200, { folder: updatedFolder }, "Folder updated successfully"));
    return
})

// delete folder
const deleteFolder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // create mongoose session
    const session = await mongoose.startSession()
    session.startTransaction()

    const id = req.query.id as string
    
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    
    if (!isIdValid) {
        res
        .status(400)
        .send(new ApiResponse(400, {}, "Folder does not exists"));
        return
    }

    const isFolderExists = await Folder.findOne({
        user: new mongoose.Types.ObjectId(req.user?._id),
        _id: new mongoose.Types.ObjectId(id),
    })

    if (!isFolderExists) {
        res
        .status(400)
        .send(new ApiResponse(400, {}, "Folder does not exists"));
        return
    }

    const deletedFolder = await Folder.deleteMany({user: new mongoose.Types.ObjectId(req.user?._id), $or: [{_id: new mongoose.Types.ObjectId(id)}, {parent: new mongoose.Types.ObjectId(id)}]})
    const delteTodos = await Todo.deleteMany({user: new mongoose.Types.ObjectId(req.user?._id), parent: new mongoose.Types.ObjectId(id)})

    if(!(deletedFolder && delteTodos)){
        res
        .status(500)
        .send(new ApiResponse(500, {}, "Something went wrong"));
        session.abortTransaction()
        return
    }

    res
    .status(200)
    .send(new ApiResponse(200, {}, "Folder deleted successfully"));
    session.commitTransaction()
    return
})


export{
    createFolder,
    getFolders,
    updateFolder,
    deleteFolder
}