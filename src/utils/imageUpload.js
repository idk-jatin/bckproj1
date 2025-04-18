const cloudinary = require("../config/cloudinary")
const fs = require("fs");

const uploadToCloudinary = async(filePath)=>{
try {

    const result = await cloudinary.uploader.upload(filePath,{
      folder: "profilePics"
    });
    return {
        url: result.secure_url,
        publicId: result.public_id,
    };

} catch (e) {
     fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting upload file:", err);
          } else {
            console.log("Upload file deleted:", filePath);
          }
        });
    console.error("Error while uploading to cloudinary", e);
    throw new Error('Error while uploading to cloudinary')
}
}

module.exports = {uploadToCloudinary};