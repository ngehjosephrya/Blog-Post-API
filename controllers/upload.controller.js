import cloudinary from "../lib/cloudinary.js";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    const result = await new Promise((resolve, reject) => {
        const stream =  cloudinary.uploader.upload_stream({
            folder: "vibely",
            transformation: [
                { width: 1200, crop: "limit" },
                {quality: "auto"},
                {fetch_format: "auto"}
            ],  
        },
        (error, result) => {
            if (error) reject(error);
            else resolve(result);
        }
    );
    stream.end(req.file.buffer);
    });

    res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        },
    });
} catch (error) {
    next(error);
}
};

