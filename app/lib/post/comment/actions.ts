import prisma from "~/lib/prisma.server";
import { CommentFormInputs, formSchema as CreateComment } from "./constants";
import {
  isProjectAdmin,
  isProjectOwner,
  isSuperuser,
} from "~/lib/permissions.server";
import { authenticator } from "~/services/auth.server";

export async function createComment(
  request: Request,
  values: CommentFormInputs,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const validatedFields = CreateComment.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid payload.",
    };
  }

  const { text, postId, replyToId } = validatedFields.data;

  try {
    const post = await prisma.comment.create({
      data: {
        text,
        postId,
        userId: user.id,
        replyToId: replyToId,
      },
    });

    return {
      success: true,
      message: "Comment created successfully.",
      post: post,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create comment.",
    };
  }
}

export async function deleteComment(request: Request, commentId: string) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: {
        select: {
          status: {
            select: {
              category: {
                select: { projectId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!existingComment) {
    return {
      success: false,
      message: "Comment not found.",
    };
  }

  const projectId = existingComment.post.status.category.projectId;

  const isAuthorized =
    (await isSuperuser(user)) ||
    (await isProjectOwner(user, projectId)) ||
    (await isProjectAdmin(user, projectId)) ||
    user.id === existingComment.userId;

  if (!isAuthorized) {
    return {
      success: false,
      message: "Access denied.",
    };
  }

  try {
    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      success: true,
      message: "Comment deleted successfully.",
      comment: deletedComment,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to delete Comment.",
    };
  }
}
