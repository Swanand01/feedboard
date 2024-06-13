import {
  Prisma,
  Category as PrismaCategory,
  Post as PrismaPost,
  Comment as PrismaComment,
} from "@prisma/client";

export type User = {
  id: string;
  username: string;
  email: string;
  isSuperuser: boolean;
};

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
        upvotes: {
          select: {
            userId: true;
          };
        };
        status: {
          include: {
            category: {
              select: {
                title: true;
                projectId: true;
              };
            };
          };
        };
        creator: {
          select: {
            username: true;
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
