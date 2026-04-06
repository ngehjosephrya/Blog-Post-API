import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { deleteUser, getUserById, getUsers, updateUser } from "../controllers/users.controller.js";

const userRoutes = Router();

userRoutes.get('/',getUsers);

userRoutes.get('/:id',authorize, getUserById);

userRoutes.put('/:id', authorize, updateUser);

userRoutes.delete('/:id', authorize, deleteUser);

export default userRoutes;