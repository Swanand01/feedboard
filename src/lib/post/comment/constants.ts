import { z } from "zod";

export const formSchema = z.object({
    text: z
        .string()
        .min(3, {
            message: "Text must be at least 3 characters long",
        })
        .max(140, {
            message: "Text must be at most 140 characters long",
        }),
});

export type CommentFormInputs = z.infer<typeof formSchema>;
