import zod from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import Folder, { FolderI } from "../db/models/folder.model";
import mongoose, { HydratedDocument } from "mongoose";
import { ApiResponse } from "../utils/apiResponse";

// create new folder
const createFolder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {name, parent } = req.body;
    if (parent) {
        const isFolderExists = await Folder.findOne({
            user: new mongoose.Types.ObjectId(req.user?._id),
            _id: new mongoose.Types.ObjectId(parent),
        });
        
        if (!isFolderExists) {
            res
            .status(400)
            .send(new ApiResponse(400, {}, "Parent folder does not exists"));
            return
        }
    }

    const newFolder = await Folder.create({
        user: new mongoose.Types.ObjectId(req.user?._id),
        parent: new mongoose.Types.ObjectId(parent),
        name: name? name : "Untitled Folder"
    })

    if(!newFolder){
        res.status(500).send(new ApiResponse(500, {}, "Something went wrong"));
        return;
    }
})

// get folders
const getFolders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {parent} = req.body;
    let folders: HydratedDocument<FolderI>[] = []
    
    if(parent){
        folders = await Folder.find({
            user: new mongoose.Types.ObjectId(req.user?._id),
            parent: new mongoose.Types.ObjectId(parent)
        })
    }
    else{
        folders = await Folder.find({
            user: new mongoose.Types.ObjectId(req.user?._id)
        })
    }
    
    if (!folders) {
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
    const {id, name} = req.body
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
    const updatedFolder = await Folder.findOneAndUpdate(
        {user: new mongoose.Types.ObjectId(req.user?._id), _id: new mongoose.Types.ObjectId(id)},
        {name: name? name : "Untitled Folder"}, {new: true}
        )

    if(!updatedFolder){
        res
        .status(500)
        .send(new ApiResponse(500, {}, "Something went wrong"));
        return
    }

    res
    .status(200)
    .send(new ApiResponse(200, { folder: updatedFolder }, "Folder updated successfully"));
})

// delete folder
const deleteFolder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {id} = req.body
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
    const deletedFolder = await Folder.findOneAndDelete({user: new mongoose.Types.ObjectId(req.user?._id), _id: new mongoose.Types.ObjectId(id)})

    if(!deletedFolder){
        res
        .status(500)
        .send(new ApiResponse(500, {}, "Something went wrong"));
        return
    }

    res
    .status(200)
    .send(new ApiResponse(200, {}, "Folder deleted successfully"));
})


export{
    createFolder,
    getFolders,
    updateFolder,
    deleteFolder
}