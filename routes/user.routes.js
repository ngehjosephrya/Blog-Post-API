import { Router } from "express";
import { deleteUser, getUserById, getUsers, updateUser } from "../controllers/users.controller.js";

const userRoutes = Router();

userRoutes.get('/', (req, res) => getUsers);

userRoutes.get('/:id', (req, res) => getUserById);

userRoutes.put('/:id', (req, res) => updateUser);

userRoutes.delete('/:id',(req, res) => deleteUser);

export default userRoutes;