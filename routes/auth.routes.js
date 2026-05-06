import { Router } from "express";
import { signIn, signOut, signUp, me } from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { signUpSchema, signInSchema } from "../validations/auth.validations.js";

const authRouter = Router();

authRouter.post('/sign-up',validate(signUpSchema), signUp);

authRouter.post('/sign-in', validate(signInSchema), signIn);

authRouter.post('/sign-out', authorize, signOut);

authRouter.get('/me', authorize, me);

export default authRouter;