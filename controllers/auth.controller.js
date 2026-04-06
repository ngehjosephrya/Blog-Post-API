import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../config/env.js";

export const signUp = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        console.log("1. Request received", req.body);

        const existingUser = await prisma.users.findUnique({where: {email}});
        console.log("2. DB check done");

        if (existingUser) {
            return res.status(404).json({message: "This Email is already in use"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("3. Password hashed");

        const newUser = await prisma.users.create({
            data: { name, email, password: hashedPassword }
        });
        console.log("4. User created");

        const token = jwt.sign(
            {userId: newUser.id},
            JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
            );
        console.log("5. JWT token generated");

        res.cookie("token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User created successfully", 
            data: {
                user: newUser,
                token
            }
        });
    } catch (error) {
        console.log("Error:", error);
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const existingToken = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        if (existingToken) {
            return res.status(400).json({
                success: false,
                message: "You are already logged in, please sign out first"
            });
        }

        const {email, password} = req.body;

        const user = await prisma.users.findUnique({where: {email}});

        if(!user){
            return res.status(404).json({message: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(404).json({message: "Invalid Password"});
        }

        const token = jwt.sign(
            {userId: user.id},
            JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User signed in successfully",
            data: {
                user,
                token
            }
        })
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req,res, next) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "User signed out successfully"
        });
    } catch (error) {
        next(error);
    }
}