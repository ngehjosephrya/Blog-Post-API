import {Router} from "express"
import { authorize } from "../middlewares/auth.middleware.js";
import { getComment, createComment, updateComment, deleteComment} from "../controllers/comments.contollers.js";

const commentRouter =  Router();

commentRouter.get('/posts/:id',getComment)
commentRouter.post('/posts/:id',authorize, createComment)
commentRouter.put('/:id',authorize, updateComment)
commentRouter.delete('/:id',authorize, deleteComment) 

export default commentRouter;