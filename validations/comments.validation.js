import { z } from "zod";

export const commentsSchema = z.object({
    content: z.string().min(1, "Content cannot be empty"),
});

export const updateCommentsSchema = z.object({
    content: z.string().min(1, "Content cannot be empty").optional(),
});