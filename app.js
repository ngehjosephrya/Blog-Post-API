import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRouter from "./routes/comments.routes.js";
import likeRoutes from "./routes/likes.routes.js";
import errorMiddleware from "./middlewares/error.middlewares.js";


const app = express();

app.use(express.json()); // parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // parses form data 
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Welcome to my BlogPost API Feel free to Share')
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRoutes);

app.use(errorMiddleware)

app.listen(PORT, async () => {
  console.log(`Blog Post API successfully running on http://localhost:${PORT}`)
});
export default app