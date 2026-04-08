import { Router } from "express";
import { createPost, deletePost, getPostByUserId, getPosts, getPostsById, updatePost } from "../controllers/posts.controllers.js";
import { authorize } from "../middlewares/auth.middleware.js";

const postRoutes = Router();

postRoutes.get('/', getPosts);

postRoutes.get('/:id', authorize, getPostsById);

postRoutes.post('/', authorize, createPost);

postRoutes.put('/:id', authorize, updatePost);

postRoutes.delete('/:id', authorize, deletePost);

postRoutes.get('/users/:id', authorize, getPostByUserId);

export default postRoutes;