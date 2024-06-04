import * as z from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters long",
  }),
});

export type PostFormInputs = z.infer<typeof formSchema>;

export const POSTS_PER_PAGE = 5;
