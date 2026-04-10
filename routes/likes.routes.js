import {Router} from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { getPostLikes, likePost, deleteLike} from "../controllers/likes.controller.js";

const likesRouter = Router();

likesRouter.get('/posts/:id',authorize, getPostLikes);
likesRouter.post('/posts/:id',authorize, likePost);
likesRouter.delete('/posts/:id',authorize, deleteLike);

export default likesRouter;