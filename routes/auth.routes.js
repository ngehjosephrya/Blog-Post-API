import { isAuthenticated } from "../middlewares/authtoken.middleware.js";
import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/sign-up',signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/sign-out', isAuthenticated, signOut);

export default authRouter;