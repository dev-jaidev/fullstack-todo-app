import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (path: string): Promise<UploadApiResponse | null> => {
  try {
    if (!path) {
        return null
    }

    const res = await cloudinary.uploader.upload(path, {
      folder: "todo-app",
      resource_type: "auto",
    });

    if (!res.url) {
        console.error(res)
        return null
    }
    return res
  } catch (error) {
    console.error(error);
    return null
  }

};

export default uploadOnCloudinary;
