import {UploadApiResponse, v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config()

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (path: string): Promise<UploadApiResponse> => {
    if (!path)
        throw new Error("Path is not defined");

    const res = await cloudinary.uploader.upload(path, {
        folder: 'todo-app',
        resource_type: 'auto'
    });

    return res;
}
