import prisma from "~/lib/prisma.server";

export async function getComments(postId: string, replyToId?: string) {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      replyToId,
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
