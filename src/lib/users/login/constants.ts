import * as z from "zod";

export const formSchema = z.object({
    email: z
        .string()
        .email(),
    password: z.string().min(5, "Password must be at least 6 characters"),
});

export type LoginFormInputs = z.infer<typeof formSchema>;