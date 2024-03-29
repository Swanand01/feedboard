"use server";

import prisma from "@/lib/prisma";
import { getUserSession } from "@/auth";
import { redirect } from "next/navigation";
import { CommentFormInputs, formSchema as CreateComment } from "./constants";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, values: CommentFormInputs) {
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
