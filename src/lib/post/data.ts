'use server';

import prisma from "@/lib/prisma";
import { POSTS_PER_PAGE, POSTS_PER_ROADMAP } from "./constants";

export async function getFilteredPosts(categoryId: string, statusSlug: string, title: string, currentPage: number) {
    let statusFilter = {};
    if (statusSlug === 'all') {
        statusFilter = {
            categoryId: categoryId,
        };
    } else {
        statusFilter = {
            slug: statusSlug,
        };
    }

    const postsCount = await prisma.post.count({
        where: {
            status: statusFilter,
            title: {
                contains: title,
                mode: "insensitive"
            },
        },
    });

    const posts = await prisma.post.findMany({
        where: {
            status: statusFilter,
            title: {
                contains: title,
                mode: "insensitive"
            },
        },
        include: { status: true },
        skip: (currentPage - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
        orderBy: {
            createdAt: "desc"
        }
    });

    return { posts, postsCount };
}

export async function getPostsByStatus(statusId: string) {
    const posts = await prisma.post.findMany({
        where: {
            statusId: statusId
        },
        include: {
            _count: {
                select: {
                    upvotes: true
                }
            }
        },
        orderBy: {
            upvotes: {
                _count: "desc"
            },
        },
        take: POSTS_PER_ROADMAP,
    })
    return posts;
}