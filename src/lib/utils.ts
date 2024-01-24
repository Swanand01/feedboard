import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from 'slugify';
import prisma from "@/lib/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateUniqueSlug(modelName: string, title: string): Promise<string> {
  const baseSlug = slugify(title, { lower: true });

  // Query existing slugs to check for uniqueness
  const existingSlugs = await prisma[modelName].findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { slug: true },
  });

  // If the baseSlug is unique, return it
  if (!existingSlugs.find((existingSlug) => existingSlug.slug === baseSlug)) {
    return baseSlug;
  }

  // If the baseSlug already exists, append a random string
  const randomString = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomString}`;
}
