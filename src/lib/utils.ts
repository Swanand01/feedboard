import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import prisma from "@/lib/prisma";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function generateUniqueSlug(
    modelName: string,
    title: string,
): Promise<string> {
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

export function getReadableTime(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
        return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
}
