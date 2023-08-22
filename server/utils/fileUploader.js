const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async (file , folder , height , width , quality ) => {
    const options = {
        folder,
        timeout:120000,
        maxVideoFileSize:15,

    };
    if(height){
        options.height = height;
    };
    if(width){
        options.width = width;
    };
    if(quality){
        options.quality = quality;
    };
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath , options);

};

module.exports = uploadToCloudinary;