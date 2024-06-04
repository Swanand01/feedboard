import slugify from "slugify";
import prisma from "./prisma.server";

export async function generateUniqueSlug(
  modelName: string,
  title: string,
): Promise<string> {
  const baseSlug = slugify(title, { lower: true });

  // Query existing slugs to check for uniqueness
  // @ts-ignore
  const existingSlugs = await prisma[modelName].findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { slug: true },
  });

  // If the baseSlug is unique, return it
  // @ts-ignore
  if (!existingSlugs.find((existingSlug) => existingSlug.slug === baseSlug)) {
    return baseSlug;
  }

  // If the baseSlug already exists, append a random string
  const randomString = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomString}`;
}
