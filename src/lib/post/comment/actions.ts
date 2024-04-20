"use server";

import prisma from "@/lib/prisma";
import { getUserSession } from "@/auth";
import { redirect } from "next/navigation";
import { CommentFormInputs, formSchema as CreateComment } from "./constants";
import { revalidatePath } from "next/cache";
import { isProjectAdmin, isProjectOwner, isSuperuser } from "@/lib/permissions";

export async function createComment(
    postId: string,
    replyToId: string | undefined,
    values: CommentFormInputs,
) {
    const session = await getUserSession();
    if (!session?.user) {
        redirect("/users/login");
    }

    const validatedFields = CreateComment.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid payload.",
        };
    }

    const { text } = validatedFields.data;

    try {
        const post = await prisma.comment.create({
            data: {
                text,
                postId,
                userId: session.user.id,
                replyToId: replyToId,
            },
        });

        revalidatePath("/project/[slug]/[boardSlug]/[postSlug]", "page");

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

export async function deleteComment(commentId: string) {
    const session = await getUserSession();
    if (!session?.user) {
        redirect("/users/login");
    }

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
        (await isSuperuser()) ||
        (await isProjectOwner(projectId)) ||
        (await isProjectAdmin(projectId)) ||
        session.user.id === existingComment.userId;

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

        revalidatePath("/project/[slug]/[boardSlug]/[postSlug]", "page");

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
