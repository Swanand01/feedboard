import * as z from "zod";

export const formSchema = z.object({
    email: z
        .string()
        .email(),
    password: z.string().min(5, "Password must be at least 6 characters"),
});

export interface LoginFormInputs {
    email: string;
    password: string;
}
