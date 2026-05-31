import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middlewares.js";
import { uploadImage } from "../controllers/upload.controller.js";

const uploadRouter = Router();

uploadRouter.post("/image",  authorize, upload.single("image"), uploadImage);
uploadRouter.post("/avatar", authorize, upload.single("image"), uploadImage); // ← add this

export default uploadRouter;