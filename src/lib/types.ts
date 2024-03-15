import {
    Prisma,
    Category as PrismaCategory,
    Post as PrismaPost,
} from "@prisma/client";

export type Category = PrismaCategory &
    Partial<
        Prisma.CategoryGetPayload<{
            include: {
                statuses: true;
            };
        }>
    >;
export type Post = PrismaPost &
    Partial<
        Prisma.PostGetPayload<{
            include: {
                _count: {
                    select: {
                        upvotes: true;
                    };
                };
                status: true;
            };
            select: {
                upvotes: {
                    select: {
                        userId: true;
                    };
                };
            };
        }>
    >;
