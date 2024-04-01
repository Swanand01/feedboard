import {
    Prisma,
    Category as PrismaCategory,
    Post as PrismaPost,
    Comment as PrismaComment,
} from "@prisma/client";

export type Category = PrismaCategory &
    Partial<
        Prisma.CategoryGetPayload<{
            include: {
                statuses: true;
                project: { select: { slug: true } };
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

export type Comment = PrismaComment &
    Partial<
        Prisma.CommentGetPayload<{
            include: {
                creator: true;
                _count: {
                    select: { replies: true };
                };
            };
        }>
    >;
