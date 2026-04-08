import e from "express";
import { prisma } from "../lib/prisma.js"

export const getUsers = async(req, res, next) => {
    try {
        const user = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        });
        res.status(200).json({
             success: true,
             data: user
            })
    } catch (error) {
       next(error) 
    }
}

export const getUserById = async(req, res, next) => {

    const user = await prisma.users.findUnique(
        {
            where: {id: req.params.id},
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        },
    );

    if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this resource"
            });
        }

    if(!user){
        return res.status(404).json({success: false, message: "User not found"})
    }

    res.status(200).json({success: true, data: user })
}

export const updateUser = async (req, res, next) => {
    try {
        // Check if the logged in user is updating their own data
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this user"
            });
        }

        const { name, email, password } = req.body;

        let updatedData = { name, email, password };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(password, salt);
        }

        const user = await prisma.users.update({
            where: { id: req.params.id },
            data: updatedData
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        // Check if the logged in user is updating their own data
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this user"
            });
        }

        const user = await prisma.users.delete({
            where: { id: req.params.id }
        })

        //Check if User exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
}