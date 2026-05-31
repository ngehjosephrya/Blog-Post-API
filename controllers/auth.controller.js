import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

// ← defined once at module level, available to all functions
const cookieOptions = {
  httpOnly: true,
  secure:   true,
  sameSite: "none",
  maxAge:   7 * 24 * 60 * 60 * 1000,
};

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already in use",
      });
    }

    const salt          = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.users.create({
      data: { name, email, password: hashedPassword },
      select: {
        id:        true,
        name:      true,
        email:     true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User created successfully",
      data: { user: newUser, token },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const existingToken =
      req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (existingToken) {
      return res.status(400).json({
        success: false,
        message: "You are already logged in, please sign out first",
      });
    }

    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id:        true,
        name:      true,
        email:     true,
        avatarUrl: true,
        password:  true,  // needed for bcrypt.compare
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password", // ← same message, prevents email enumeration
      });
    }

    // strip password before sending
    const { password: _, ...safeUser } = user;

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("token", token, cookieOptions); // ← now in scope ✅

    return res.status(200).json({
      message: "User signed in successfully",
      data: { user: safeUser, token }, // ← key is "user" not "safeUser" ✅
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure:   true,
      sameSite: "none",
    });
    return res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id:        true,
        name:      true,
        email:     true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};