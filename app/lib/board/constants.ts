import * as z from "zod";
import { formSchema as StatusFormSchema } from "./status/constants";

export const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(50, { message: "Title can at most be 50 characters long" }),
  statuses: z
    .array(
      StatusFormSchema.extend({
        statusId: z.string(),
      }),
    )
    .max(5, {
      message: "You can have at most 5 statuses",
    }),
});

export type CategoryFormInputs = z.infer<typeof formSchema>;

export interface StatusFormField {
  statusId: string;
  title: string;
  colour: string;
  isDefault: boolean;
}
