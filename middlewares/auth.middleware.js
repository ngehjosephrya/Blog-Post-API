import { supabase } from "../lib/supabase.js";
import { prisma }   from "../lib/prisma.js";

export const authorize = async (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — no token provided",
      });
    }

    // Verify token with Supabase Auth
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — invalid or expired token",
      });
    }

    // Find user profile in your DB
    let dbUser = await prisma.users.findUnique({
      where: { id: supabaseUser.id },
      select: {
        id:        true,
        name:      true,
        email:     true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    // Auto-create profile on first OAuth login
    // (Google/Apple users never explicitly "signed up" in your DB)
    if (!dbUser) {
      dbUser = await prisma.users.create({
        data: {
          id:        supabaseUser.id,
          name:
            supabaseUser.user_metadata?.full_name  ||
            supabaseUser.user_metadata?.name       ||
            supabaseUser.email?.split("@")[0]      ||
            "User",
          email:     supabaseUser.email ?? "",
          avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
        },
        select: {
          id:        true,
          name:      true,
          email:     true,
          avatarUrl: true,
          createdAt: true,
        },
      });
    }

    // Attach user to request for controllers to use
    req.user = dbUser;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};