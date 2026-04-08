import { prisma } from "../lib/prisma.js";

export const getPosts = async (req, res, next) => {
  try {
    const posts = await prisma.posts.findMany({
      select: {
        id: true,
        p_title: true,
        p_body: true,
        author: { select: { name: true } },
        categories: { select: { name: true } },
        published: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostByUserId = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this resource",
      });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const posts = await prisma.posts.findMany({
      where: { authorId: req.params.id },
      select: {
        id: true,
        p_title: true,
        p_body: true,
        author: { select: { name: true } },
        categories: { select: { name: true } },
        published: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsById = async (req, res, next) => {
  try {
    const post = await prisma.posts.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        p_title: true,
        p_body: true,
        author: { select: { name: true } },
        categories: { select: { name: true } },
        published: true,
        createdAt: true,
      },
    });
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this resource",
      });
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { p_title, p_body, published, categories, tags } = req.body;
    const authorId = req.user.id;

    const post = await prisma.posts.create({
      data: {
        p_body,
        p_title,
        published: published || false,
        authorId,
        //Connects the post to the categories and tags if they exist, otherwise creates new ones
        categories: {
          connectOrCreate:
            categories?.map((name) => ({
              where: { name },
              create: { name },
            })) || [],
        },
        //Connects the post to the tags if they exist, otherwise creates new ones
        tags: {
          connectOrCreate:
            tags?.map((name) => ({
              where: { name },
              create: { name },
            })) || [],
        },
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: true,
        tags: true,
      },
    });
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { p_title, p_body, published, categories, tags } = req.body;
    const existingPost = await prisma.posts.findUnique({
      where: { id: req.params.id },
    });

    // Check if the post exists
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    //Find the post to update and check if the logged in user is the author of the post
    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this post",
      });
    }

    const updatedData = {};

    if (p_title) updatedData.p_title = p_title;
    if (p_body) updatedData.p_body = p_body;
    if (published !== undefined) updatedData.published = published;

    // Handle categories update
    if (categories) {
      updatedData.categories = {
        set: [], // Clear existing categories
        connectOrCreate:
          categories.map((name) => ({
            where: { name },
            create: { name },
          })) || [],
      };
    }
    // Handle tags update
    if (tags) {
      updatedData.tags = {
        set: [], // Clear existing tags
        connectOrCreate: tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      };
    }

    const post = await prisma.posts.update({
      where: { id: req.params.id },
      data: updatedData,
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: true,
        tags: true,
      },
    });
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const existingPost = await prisma.posts.findUnique({
      where: { id: req.params.id },
    });

    // Check if the post exists
    if (!existingPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    //Check if the logged in user is the author of the post
    if (existingPost.authorId !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not allowed to delete this post",
        });
    }

    await prisma.posts.delete({
      where: { id: req.params.id },
    });
    await prisma.posts.delete({ where: { id: req.params.id } });
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
