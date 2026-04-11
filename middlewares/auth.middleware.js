import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

export const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        message: NODE_ENV === "production"
            ? "Unauthorized"
            : "Unauthorized ->No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user)
      return res.status(401).json({
        message: NODE_ENV === "production"
        ? "Unauthorized"
        : "Unauthorized -> User not found",
      });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: NODE_ENV === "production"
        ? "Unauthorized"
        : "Unauthorized -> Invalid or expired token",
      error: NODE_ENV === "production" ? undefined : error.message,
    }); 
  }
};
