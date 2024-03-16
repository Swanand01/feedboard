"use server";

import prisma from "@/lib/prisma";

export async function getCategory(categorySlug: string) {
    const category = await prisma.category.findUnique({
        where: {
            slug: categorySlug,
        },
        include: {
            statuses: { orderBy: { isDefault: "desc" } },
            project: { select: { slug: true } },
        },
    });
    return category;
}
