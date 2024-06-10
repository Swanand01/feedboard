import * as z from "zod";

export const formSchema = z.object({
  title: z.string().min(3, {
    message: "Status must be at least 3 characters long",
  }),
  colour: z.string().min(4).max(9).regex(/^#/),
  isDefault: z.boolean(),
});

export type StatusFormInputs = z.infer<typeof formSchema>;
