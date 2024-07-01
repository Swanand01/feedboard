import { z } from "zod";

export const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const titleValidation = z
  .string()
  .min(3, { message: "Title must be at least 3 characters long" });

const logoValidation = z
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
  title: titleValidation,
  logo: z
    .any()
    .refine((file) => file != null, "Logo is required")
    .and(logoValidation),
});

export const updateFormSchema = z.object({
  title: titleValidation,
  logo: logoValidation.optional(),
});

export type SiteFormInputs = z.infer<typeof createFormSchema>;
