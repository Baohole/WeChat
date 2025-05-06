import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';


const streamUpload = (file: any, buffer: any) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRECT // Click 'View Credentials' below to copy your API secret
    });

    return new Promise((resolve, reject) => {
        const format = file.name.split('.').pop(); // Get the file extension
        const rawname = file.name.slice(0, file.name.lastIndexOf('.')) || file.name; // Get the file name without extension

        let stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                format: format,
                public_id: rawname, // Set the public ID to the file name without extension
                use_filename: true,
                unique_filename: false
            },
            (error: any, result: any) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}

const Cloudinary = async (fileData: any) => {
    const base64String = fileData.data.split(',')[1];
    const buffer = Buffer.from(base64String, 'base64');
    const result = await streamUpload(fileData, buffer);
    return (result as any).secure_url;
    // return ""
}

export default Cloudinary;