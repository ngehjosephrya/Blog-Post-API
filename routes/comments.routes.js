import {Router} from "express"

const commentRouter =  Router();

commentRouter.get('/posts/:id',getComment)
commentRouter.post('/posts/:id',createComment)
commentRouter.put('/posts/:id',updateComment)
commentRouter.delete('/posts/:id',deleteComment)