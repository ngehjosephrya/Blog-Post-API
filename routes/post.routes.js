import { Router } from "express";
import { createPost, deletePost, getPostByUserId, getPosts, getPostsById, updatePost } from "../controllers/posts.controllers.js";
import { authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { createPostSchema, updatePostSchema } from "../validations/post.validatoins.js";

const postRoutes = Router();

postRoutes.get('/', getPosts);

postRoutes.get('/:id', authorize, getPostsById);

postRoutes.post('/',validate(createPostSchema), authorize, createPost);

postRoutes.put('/:id', validate(updatePostSchema), authorize, updatePost);

postRoutes.delete('/:id', authorize, deletePost);

postRoutes.get('/users/:id', authorize, getPostByUserId);

export default postRoutes;