import { Router } from "express";
import { createPost, deletePost, getPostByUserId, getPosts, getPostsById, updatePost } from "../controllers/posts.controllers.js";

const postRoutes = Router();

postRoutes.get('/', (req, res) => getPosts);

postRoutes.get('/:id', (req, res) => getPostsById);

postRoutes.post('/', (req, res) => createPost);

postRoutes.put('/:id', (req, res) => updatePost);

postRoutes.delete('/:id', (req, res) => deletePost);

postRoutes.get('/users/:id', (req, res) => getPostByUserId);

export default postRoutes;