import mongoose from "mongoose";

export interface FolderI {
    user: mongoose.Types.ObjectId;
    parent?: mongoose.Types.ObjectId;
    name: string;
}

const folderSchema = new mongoose.Schema<FolderI>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        index: true,
    },
    name: {
        type: String,
        index: true,
        default: "New Folder"
    },

})

const Folder = mongoose.model<FolderI>("Folder", folderSchema)

export default Folder