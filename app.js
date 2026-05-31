import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import {CLIENT_URL} from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRouter from "./routes/comments.routes.js";
import likeRoutes from "./routes/likes.routes.js";
import errorMiddleware from "./middlewares/error.middlewares.js";
import uploadRouter from "./routes/upload.routes.js";


const app = express();

app.set("trust proxy", 1);

// CORS Middleware
app.use(
  cors({
    origin: CLIENT_URL, // your frontend URL
    credentials: true, // allows cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parsers and security middlewares
app.use(helmet()); // for security headers
app.use(express.json()); // parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // parses form data
app.use(cookieParser());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes",
  },
  validate: {
    xForwardedForHeader: false,
    trustProxy: false,
  },
});

app.use("/api",limiter); // Apply rate limiting to all requests

// Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to my BlogPost API Feel free to Share");
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/upload", uploadRouter);
 
// Error handling middleware
app.use(errorMiddleware);

export default app;
