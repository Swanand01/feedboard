import slugify from "slugify";
import prisma from "./prisma.server";
import { Post, User } from "./types";

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

export function mapPost(post: Post, user: User | null) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    upvotes: post._count?.upvotes || 0,
    slug: String(post.slug),
    hasUpvoted: user
      ? post.upvotes?.some((obj) => obj.userId === user.id)
      : false,
    status: {
      title: post.status?.title,
      colour: post.status?.colour,
    },
    creator: post.creator?.username,
    createdAt: post.createdAt.toString(),
  };
}
