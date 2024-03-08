'use server';

import prisma from "@/lib/prisma";

export async function getCategory(categorySlug: string) {
    const category = await prisma.category.findUnique({
        where: {
            slug: categorySlug
        },
        include: {
            statuses: {
                select: {
                    id: true,
                    slug: true,
                    title: true
                }
            }
        }
    });
    return category;
}

