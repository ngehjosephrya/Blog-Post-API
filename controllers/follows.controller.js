import { prisma } from "../lib/prisma.js";

const USER_SELECT = {
  id:        true,
  name:      true,
  avatarUrl: true,
};

export const followUser = async (req, res, next) => {
  try {
    const followerId  = req.user.id;
    const followingId = req.params.userId;

    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const existing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user",
      });
    }

    const follow = await prisma.follows.create({
      data: { followerId, followingId },
    });
 
    return res.status(201).json({
      success: true,
      message: "User followed successfully",
      data:    follow,
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const followerId  = req.user.id;
    const followingId = req.params.userId;

    const existing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "You are not following this user",
      });
    }

    await prisma.follows.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const follows = await prisma.follows.findMany({
      where: { followingId: req.params.userId },
      include: {
        follower: { select: USER_SELECT },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data:    follows.map((f) => f.follower),
      count:   follows.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const follows = await prisma.follows.findMany({
      where: { followerId: req.params.userId },
      include: {
        following: { select: USER_SELECT },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data:    follows.map((f) => f.following),
      count:   follows.length,
    });
  } catch (error) {
    next(error);
  }
};

export const checkFollowing = async (req, res, next) => {
  try {
    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId:  req.user.id,
          followingId: req.params.userId,
        },
      },
    });

    return res.status(200).json({
      success:     true,
      isFollowing: !!follow,
    });
  } catch (error) {
    next(error);
  }
};