import { request } from "express";
import { prisma } from "../lib/prisma.js";

export const getComment = async(req, res, next) => {
    try {
        const comment = await prisma.comments.findMany({
            where: {postId: req.params.id},
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        if(comment.length === 0){
            return res.status(404).json({success:false, message:"No comments found for this post"})
        }
        res.status(200).json({success:true, message:"Comments retrieved successfully", data: comment});
    } catch (error) {
        next(error)
    }
};

export const createComment = async(req, res, next) => {
    try {
        const {content} = req.body;
        const postId = req.params.id;
        const comment = await prisma.comments.create({
            data: {
                content,
                post: {connect: {id: postId}},
                author: {connect: {id: req.user.id}},
            }
        })
        res.status(201).json({success:true, message:"Comment created successfully", data: comment});
    } catch (error) {
        next(error)
    }
}

export const updateComment = async(req, res, next) => {
    try {
        const {content} = req.body;
        const commentId = req.params.id;
        const comment = await prisma.comments.update({
            where: {id: commentId },
            data: {
                content,
            }
        })
        if(!commentId){
            return res.status(404).json({success:false, message:"Comment not found"})
        }
        res.status(200).json({success:true, message:"Comment updated successfully", data: comment});
    } catch (error) {
        next(error)
    }
}
export const deleteComment = async(req, res, next) => {
    try {
        const comment = await prisma.comments.delete({
            where: {id: req.params.id }
        })
        if(comment.length === 0){
            return res.status(404).json({success:false, message:"Comment not found"})
        }
        res.status(200).json({success:true, message:"Comment deleted successfully", data: comment});
    } catch (error) {
        next(error)
    }
}