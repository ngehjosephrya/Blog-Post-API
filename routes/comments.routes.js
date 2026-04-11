import {Router} from "express"
import { authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { getComment, createComment, updateComment, deleteComment} from "../controllers/comments.contollers.js";
import { commentsSchema, updateCommentsSchema } from "../validations/comments.validation.js";

const commentRouter =  Router();

commentRouter.get('/posts/:id',getComment)
commentRouter.post('/posts/:id',validate(commentsSchema),authorize, createComment)
commentRouter.put('/:id',validate(updateCommentsSchema),authorize, updateComment)
commentRouter.delete('/:id',authorize, deleteComment) 

export default commentRouter;