const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ikaaya_products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    quality: "auto", // Auto quality optimization
    eager: [
      { width: 500, height: 500, crop: "fill", quality: "auto" },
      { width: 1000, height: 1000, crop: "fill", quality: "auto" }
    ]
  },
});

const upload = multer({ storage });

module.exports = upload;
