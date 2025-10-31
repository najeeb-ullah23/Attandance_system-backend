import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CloudinaryStorageConfig = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'users/profile-images', // ✅ folder path in Cloudinary
      format: file.mimetype.split('/')[1], // e.g. 'jpeg', 'png'
      public_id: Date.now().toString(), // unique name
      transformation: [{ width: 500, height: 500, crop: 'fill' }],
    };
  },
});
