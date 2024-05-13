"use server";

import prisma from "@/lib/prisma";
import { getUserSession } from "@/auth";
import { redirect } from "next/navigation";
import { PostFormInputs } from "./constants";
import { formSchema as CreatePost } from "./constants";
import { generateUniqueSlug } from "../utils";
import { revalidatePath } from "next/cache";
import { isProjectAdmin, isProjectOwner, isSuperuser } from "../permissions";

export async function createPost(categoryId: string, values: PostFormInputs) {
    const session = await getUserSession();
    if (!session?.user) {
        redirect("/users/login");
    }

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
            categoryId: categoryId,
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
                title: title,
                content: content,
                slug: uniqueSlug,
                userId: session.user.id,
                statusId: defaultStatus.id,
            },
        });

        revalidatePath("/project/[slug]/[boardSlug]/", "page");

        return {
            success: true,
            message: "Post created successfully.",
            post: post,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create post.",
        };
    }
}

export async function updatePost(postId: string, values: PostFormInputs) {
    const session = await getUserSession();
    if (!session?.user) return redirect("/users/login");

    const validatedFields = CreatePost.safeParse(values);
    if (!validatedFields.success) {
        return { success: false, message: "Invalid payload." };
    }

    const { title, content } = validatedFields.data;
    try {
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
            return { success: false, message: "Post not found." };
        }

        const { projectId } = existingPost.status.category;

        const isAuthorized =
            (await isSuperuser()) ||
            (await isProjectOwner(projectId)) ||
            (await isProjectAdmin(projectId)) ||
            existingPost.userId === session.user.id;

        if (!isAuthorized) {
            return { success: false, message: "Access denied." };
        }

        const titleChanged = existingPost.title !== title;
        const data = {
            title,
            content,
            slug: titleChanged
                ? await generateUniqueSlug("post", title)
                : undefined,
        };

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data,
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

export async function deletePost(postId: string) {
    const session = await getUserSession();
    if (!session?.user) return redirect("/users/login");

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
        (await isSuperuser()) ||
        (await isProjectOwner(projectId)) ||
        (await isProjectAdmin(projectId)) ||
        existingPost.userId === session.user.id;

    if (!isAuthorized) {
        return { success: false, message: "Access denied." };
    }

    try {
        const deletedPost = await prisma.post.delete({
            where: {
                id: postId,
            },
        });
        return {
            success: true,
            message: "Post deleted successfully.",
            category: deletedPost,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete Post.",
        };
    }
}

export async function votePost(postId: string) {
    const session = await getUserSession();
    if (!session?.user) {
        redirect("/users/login");
    }

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
                    userId: session.user.id,
                },
            },
        });

        if (upvote) {
            // Upvote exists, delete it (unvote)
            await prisma.upvote.delete({
                where: {
                    userId_postId: {
                        postId: postId,
                        userId: session.user.id,
                    },
                },
            });
            return {
                success: true,
                message: "Post unvoted",
            };
        } else {
            // Upvote does not exist, create it (vote)
            await prisma.upvote.create({
                data: {
                    userId: session.user.id,
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
