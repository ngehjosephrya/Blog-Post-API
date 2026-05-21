import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limit: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Only allow images
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP and GIF images are allowed"), false);
    }
  },
});

export default upload;