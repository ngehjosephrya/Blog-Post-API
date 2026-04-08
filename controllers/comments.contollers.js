import {prisma} from "../config/prisma.config.js"

export const getComment = async(req, res, next) => {
    try {
        const comment = await prisma.comments.findMany({
            where: {postId: req.params.id},
            select: {
                id: true,
                content: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        res.status(200).json({success:true, message:"Comments retrieved successfully", data: comment});
    } catch (error) {
        next(error)
    }
};

export const createComment = async(req, res, next) => {
    try {
        const {} = req.body;

    } catch (error) {
        next(error)
    }
}

export const updateComment = async(req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
}
export const deleteComment = async(req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
}