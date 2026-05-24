import { z } from "zod";

export const createPostSchema = z.object({
  p_title: z.string().min(5, "Title must be at least 5 characters long"),
  p_body:  z.string().min(10, "Content must be at least 10 characters long"),
  imageUrl: z.string().optional().nullable(),
  published: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === "true" || val === true)
    .optional(),
  categories: z
    .union([z.array(z.string()), z.string().transform((val) => [val])])
    .optional(),
  tags: z
    .union([z.array(z.string()), z.string().transform((val) => [val])])
    .optional(),
});

export const updatePostSchema = z.object({
  p_title: z.string().min(5, "Title must be at least 5 characters long").optional(),
  p_body:  z.string().min(10, "Content must be at least 10 characters long").optional(),
  imageUrl: z.string().optional().nullable(), 
  published: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === "true" || val === true)
    .optional(),
  categories: z
    .union([z.array(z.string()), z.string().transform((val) => [val])])
    .optional(),
  tags: z
    .union([z.array(z.string()), z.string().transform((val) => [val])])
    .optional(),
});