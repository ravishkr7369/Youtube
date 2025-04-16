import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {

		try {
			if(!localFilePath) return null;
			const file=await cloudinary.uploader.upload(localFilePath,{
				resource_type: 'auto',
			});

			//console.log("file upload successfully",file.url);
			fs.unlinkSync(localFilePath);
			return file;
			
		} catch (error) {
			console.log("Error uploading file to Cloudinary", error);
			fs.unlinkSync(localFilePath); // Delete the local file after upload
			return null;
		}


	}


	export {uploadOnCloudinary}
	