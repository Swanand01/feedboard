"use server";

import prisma from "@/lib/prisma";

export async function getComments(postId: string) {
    const comments = await prisma.comment.findMany({
        where: {
            postId,
            replyToId: null,
        },
        include: {
            creator: true,
            _count: {
                select: { replies: true },
            },
        },
    });
    return comments;
}

export async function getReplies(commentId: string) {
    const replies = await prisma.comment.findMany({
        where: {
            replyToId: commentId,
        },
        include: {
            creator: true,
            _count: {
                select: { replies: true },
            },
        },
    });
    return replies;
}
