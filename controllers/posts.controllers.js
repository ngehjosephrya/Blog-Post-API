import { prisma } from "../lib/prisma.js";

const POST_LIST_INCLUDE = {
  author: {
    select: { id: true, name: true, email: true, avatarUrl: true },
  },
  tags: true,
  categories: true,
  _count: {
    select: { likes: true, comments: true },
  },
};

const POST_DETAIL_INCLUDE = {
  author: {
    select: { id: true, name: true, email: true, avatarUrl: true },
  },
  tags: true,
  categories: true,
  comments: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, name: true, avatarUrl: true} },
    },
    orderBy: { createdAt: "desc" },
  },
  _count: {
    select: { likes: true, comments: true },
  },
};

export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      published: true, 
      p_title: {
        contains: search,
        mode: "insensitive",
      },
    };

    const [totalPosts, posts] = await Promise.all([
      prisma.posts.count({ where }),
      prisma.posts.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: POST_LIST_INCLUDE,
      }),
    ]);

    const totalPages = Math.ceil(totalPosts / Number(limit));

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalPosts,
        limit: Number(limit),
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsById = async (req, res, next) => {
  try {
    const post = await prisma.posts.findUnique({
      where: { id: req.params.id },
      include: POST_DETAIL_INCLUDE,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
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

    const posts = await prisma.posts.findMany({
      where: { authorId: req.params.id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: { select: { name: true } },
        tags: { select: { name: true } },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { p_title, p_body, imageUrl, published, categories, tags } = req.body;
    const authorId = req.user.id;

    const post = await prisma.posts.create({
      data: {
        p_title,
        p_body,
        imageUrl:  imageUrl  ?? null,
        published: published ?? false,
        authorId,
        categories: {
          connectOrCreate:
            categories?.map((name) => ({
              where:  { name },
              create: { name },
            })) ?? [],
        },
        tags: {
          connectOrCreate:
            tags?.map((name) => ({
              where:  { name },
              create: { name },
            })) ?? [],
        },
      },
      include: POST_DETAIL_INCLUDE,
    });

    return res.status(201).json({
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
    const existingPost = await prisma.posts.findUnique({
      where: { id: req.params.id },
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this post",
      });
    }

    const { p_title, p_body, imageUrl, published, categories, tags } = req.body;

    const data = {};
    if (p_title    !== undefined) data.p_title   = p_title;
    if (p_body     !== undefined) data.p_body    = p_body;
    if (imageUrl   !== undefined) data.imageUrl  = imageUrl;
    if (published  !== undefined) data.published = published;

    if (categories !== undefined) {
      data.categories = {
        set: [],   
        connectOrCreate: categories.map((name) => ({
          where:  { name },
          create: { name },
        })),
      };
    }

    if (tags !== undefined) {
      data.tags = {
        set: [], 
        connectOrCreate: tags.map((name) => ({
          where:  { name },
          create: { name },
        })),
      };
    }

    const post = await prisma.posts.update({
      where: { id: req.params.id },
      data,
      include: POST_DETAIL_INCLUDE,
    });

    return res.status(200).json({
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

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    await prisma.posts.delete({
      where: { id: req.params.id },
    });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};