import {z} from "zod";

export const createPostSchema = z.object({
    p_titlle: z.string().min(5, "Title must be at least 5 characters long"),
    p_body: z.string().min(10, "Content must be at least 10 characters long"),
    tags: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
    p_titlle: z.string().min(5, "Title must be at least 5 characters long").optional(),
    p_body: z.string().min(10, "Content must be at least 10 characters long").optional(),
    tags: z.array(z.string()).optional(),
});