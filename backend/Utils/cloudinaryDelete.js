const cloudinary = require('cloudinary');

const deleteFromCloudinary = async (publicId) =>{
    return await cloudinary.uploader.destroy(publicId);
};

module.exports = {deleteFromCloudinary};