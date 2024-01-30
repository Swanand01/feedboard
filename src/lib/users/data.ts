'use server';

import prisma from "@/lib/prisma";

export async function getUsersLikeUsername(username: string) {
    const users = await prisma.user.findMany({
        where: {
            username: {
                startsWith: username,
            },
        },
        select: {
            id: true,
            username: true,
        },
        take: 5,
    });
    return users;
}
