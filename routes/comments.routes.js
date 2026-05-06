import {Router} from "express"
import { authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { getComment, createComment, updateComment, deleteComment} from "../controllers/comments.contollers.js";
import { commentsSchema, updateCommentsSchema } from "../validations/comments.validation.js";

const commentRouter =  Router();

commentRouter.get('/posts/:id',getComment)
commentRouter.post('/posts/:id',authorize ,validate(commentsSchema), createComment)
commentRouter.put('/:id',authorize, validate(updateCommentsSchema), updateComment)
commentRouter.delete('/:id',authorize, deleteComment) 

export default commentRouter;