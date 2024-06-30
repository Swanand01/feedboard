import { z } from "zod";

export const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const titleSchema = z
  .string()
  .min(3, { message: "Title must be at least 3 characters long" });

const logoSchema = z
  .any()
  .refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    "Max image size is 5MB.",
  )
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported.",
  );

export const createFormSchema = z.object({
  title: titleSchema,
  logo: logoSchema,
});

export const updateFormSchema = z.object({
  title: titleSchema,
  logo: logoSchema.optional(),
});

export type CreateSiteFormInputs = z.infer<typeof createFormSchema>;
export type UpdateSiteFormInputs = z.infer<typeof updateFormSchema>;
