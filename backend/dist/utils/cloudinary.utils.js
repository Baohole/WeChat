"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const streamUpload = (file, buffer) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRECT
    });
    return new Promise((resolve, reject) => {
        const format = file.name.split('.').pop();
        const rawname = file.name.slice(0, file.name.lastIndexOf('.')) || file.name;
        let stream = cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            format: format,
            public_id: rawname,
            use_filename: true,
            unique_filename: false
        }, (error, result) => {
            if (result) {
                resolve(result);
            }
            else {
                reject(error);
            }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
const Cloudinary = async (fileData) => {
    const base64String = fileData.data.split(',')[1];
    const buffer = Buffer.from(base64String, 'base64');
    const result = await streamUpload(fileData, buffer);
    return result.secure_url;
};
exports.default = Cloudinary;
//# sourceMappingURL=cloudinary.utils.js.map