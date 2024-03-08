'use server';

import prisma from "@/lib/prisma";
import { getUserSession } from "@/auth";
import { redirect } from "next/navigation";
import { PostFormInputs } from "./constants";
import { formSchema as CreatePost } from "./constants";
import { generateUniqueSlug } from "../utils";
import { revalidatePath } from "next/cache";

export async function createPost(categoryId: string, values: PostFormInputs) {
    const session = await getUserSession();
    if (!session?.user) {
        redirect("/users/login");
    }

    const validatedFields = CreatePost.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Fields are missing.'
        };
    }

    const { title, content } = validatedFields.data;
    const uniqueSlug = await generateUniqueSlug('post', title);

    const defaultStatus = await prisma.status.findFirst({
        where: {
            categoryId: categoryId,
            isDefault: true,
        }
    });

    if (!defaultStatus) {
        return {
            success: false,
            message: 'Default status not found'
        };
    }

    try {
        const post = await prisma.post.create({
            data: {
                title: title,
                content: content,
                slug: uniqueSlug,
                userId: session.user.id,
                statusId: defaultStatus.id
            }
        });

        revalidatePath('/project/[slug]/[boardSlug]/', 'page');

        return {
            success: true,
            message: 'Post created successfully.',
            post: post,
        };

    } catch (error) {
        return {
            success: false,
            message: 'Failed to create post.',
        };
    }
}