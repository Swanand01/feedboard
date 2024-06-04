import * as z from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  statuses: z
    .array(
      z.object({
        statusId: z.string(),
        title: z.string().min(3, {
          message: "Status must be at least 3 characters long",
        }),
        colour: z.string().min(4).max(9).regex(/^#/),
        isDefault: z.boolean(),
      }),
    )
    .max(5),
});

export type CategoryFormInputs = z.infer<typeof formSchema>;

export interface StatusFormField {
  statusId: string;
  title: string;
  colour: string;
  isDefault: boolean;
}
