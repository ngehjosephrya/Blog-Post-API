import { Router } from "express";
import { createPost, deletePost, getPostByUserId, getPosts, getPostsById, updatePost } from "../controllers/posts.controllers.js";
import { authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { createPostSchema, updatePostSchema } from "../validations/post.validatoins.js";
import upload from "../middlewares/upload.middlewares.js";

const postRoutes = Router();

postRoutes.get('/', getPosts);
postRoutes.get('/users/:id', authorize, getPostByUserId);
postRoutes.get('/:id', authorize, getPostsById);

postRoutes.post('/',authorize, validate(createPostSchema), createPost);

postRoutes.put('/:id',authorize, validate(updatePostSchema), updatePost);
postRoutes.delete('/:id', authorize, deletePost);


export default postRoutes;