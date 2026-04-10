import { prisma } from "../lib/prisma.js";

export const getPostLikes = async(req, res, next) => {
    try {
        const likes = await prisma.likes.findMany({
            where: {postId: req.params.id},
            select: {
                id: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                post: {
                    select: {
                        id: true,
                        p_title: true,
                    }
                }
            }
        })
        if(likes.length === 0){
            return res.status(404).json({success:false, message:"No likes found for this post"})
        }
        res.status(200).json({success:true, message:"Likes retrieved successfully", data: likes});
    } catch (error) {
        next(error)
    }
}
export const likePost = async(req, res, next) => {
    try {
        const postId = req.params.id;
        const existingLike = await prisma.likes.findFirst({
            where: {
                postId: postId,
                userId: req.user.id,
            }
        })
        if(existingLike){
            return res.status(400).json({success:false, message:"You have already liked this post"})
        }
        const like = await prisma.likes.create({
            data: {
                post: {connect: {id: postId}},
                user: {connect: {id: req.user.id}},
            }
        })
        
        res.status(201).json({success:true, message:"Post liked successfully", data: like});
    } catch (error) {
        next(error)
    }
}
export const deleteLike = async(req, res, next) => {
    try {
        const postId = req.params.id;
        const like = await prisma.likes.findFirst({
            where: {
                postId: postId,
                userId: req.user.id,
            }
        })
        if(!like){
            return res.status(404).json({success:false, message:"Like not found"})
        }
        await prisma.likes.delete({
            where: {id: like.id}
        })
        res.status(200).json({success:true, message:"Like removed successfully"});
    } catch (error) {
        next(error)
    }
}