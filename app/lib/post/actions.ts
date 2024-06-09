import prisma from "../prisma.server";
import { formSchema as CreatePost, PostFormInputs } from "./constants";
import { generateUniqueSlug } from "../utils.server";
import {
  isProjectAdmin,
  isProjectOwner,
  isSuperuser,
} from "../permissions.server";
import { authenticator } from "~/services/auth.server";

export async function createPost(
  request: Request,
  categoryId: string,
  values: PostFormInputs,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const validatedFields = CreatePost.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Fields are missing.",
    };
  }

  const { title, content } = validatedFields.data;
  const uniqueSlug = await generateUniqueSlug("post", title);

  const defaultStatus = await prisma.status.findFirst({
    where: {
      categoryId,
      isDefault: true,
    },
  });

  if (!defaultStatus) {
    return {
      success: false,
      message: "Default status not found",
    };
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        categoryId,
        slug: uniqueSlug,
        userId: user.id,
        statusId: defaultStatus.id,
      },
    });
    return {
      success: true,
      message: "Post created successfully.",
      post,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create post.",
    };
  }
}

export async function updatePost(
  request: Request,
  postId: string,
  values: PostFormInputs,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const validatedFields = CreatePost.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid payload." };
  }

  const { title, content, status } = validatedFields.data;
  try {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        category: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (!existingPost) {
      return { success: false, message: "Post not found." };
    }

    const { projectId } = existingPost.category;

    const isAuthorized =
      (await isSuperuser(user)) ||
      (await isProjectOwner(user, projectId)) ||
      (await isProjectAdmin(user, projectId)) ||
      existingPost.userId === user.id;

    if (!isAuthorized) {
      return { success: false, message: "Access denied." };
    }

    const titleChanged = existingPost.title !== title;
    const data = {
      title,
      content,
      slug: titleChanged ? await generateUniqueSlug("post", title) : undefined,
      statusId: status,
    };

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data,
      select: {
        slug: true,
        category: {
          select: {
            slug: true,
            project: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: "Post updated successfully.",
      post: updatedPost,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to update post.",
    };
  }
}

export async function deletePost(request: Request, postId: string) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      status: {
        select: {
          category: {
            select: {
              projectId: true,
            },
          },
        },
      },
    },
  });

  if (!existingPost) {
    return {
      success: false,
      message: "Post not found.",
    };
  }

  const { projectId } = existingPost.status.category;

  const isAuthorized =
    (await isSuperuser(user)) ||
    (await isProjectOwner(user, projectId)) ||
    (await isProjectAdmin(user, projectId)) ||
    existingPost.userId === user.id;

  if (!isAuthorized) {
    return { success: false, message: "Access denied." };
  }

  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
      select: {
        slug: true,
        category: {
          select: {
            slug: true,
            project: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });
    return {
      success: true,
      message: "Post deleted successfully.",
      post: deletedPost,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete Post.",
    };
  }
}

export async function votePost(request: Request, postId: string) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    const upvote = await prisma.upvote.findUnique({
      where: {
        userId_postId: {
          postId: postId,
          userId: user.id,
        },
      },
    });

    if (upvote) {
      await prisma.upvote.delete({
        where: {
          userId_postId: {
            postId: postId,
            userId: user.id,
          },
        },
      });
      return {
        success: true,
        message: "Post unvoted",
      };
    } else {
      await prisma.upvote.create({
        data: {
          userId: user.id,
          postId: postId,
        },
      });
      return {
        success: true,
        message: "Post upvoted",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to vote post.",
    };
  }
}
