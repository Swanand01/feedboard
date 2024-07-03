import * as z from "zod";

export const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(50, { message: "Title can at most be 50 characters long" }),
  content: z.string().refine(
    (value) => {
      const strippedContent = stripHtml(value);
      return strippedContent.length >= 10 && strippedContent.length <= 5000;
    },
    {
      message: "Content must be between 10 and 5000 characters long",
    },
  ),
  status: z
    .string({
      required_error: "Please select a status.",
    })
    .optional(),
});

export type PostFormInputs = z.infer<typeof formSchema>;

export const POSTS_PER_PAGE = 20;
