import * as z from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(50, { message: "Title can at most be 50 characters long" }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters long",
    })
    .max(300, { message: "Description can at most be 300 characters long" }),
  categories: z
    .array(
      z.object({
        categoryId: z.string(),
        title: z
          .string()
          .min(3, {
            message: "Category title must be at least 3 characters long",
          })
          .max(50, {
            message: "Category title can at most be 50 characters long",
          }),
      }),
    )
    .max(5),
});

export interface CategoryFormField {
  categoryId: string;
  title: string;
}

export type ProjectFormInputs = z.infer<typeof formSchema>;

export const statusesData = [
  { title: "Pending", colour: "#FFD700", isDefault: true },
  { title: "In progress", colour: "#00FF00", isDefault: false },
  { title: "Completed", colour: "#0000FF", isDefault: false },
];

export const POSTS_PER_ROADMAP = 5;
