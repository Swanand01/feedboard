"use server";

import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "../utils";
import { statusesData } from "../project/constants";
import { isProjectAdmin, isProjectOwner, isSuperuser } from "../permissions";
import { revalidatePath } from "next/cache";

export async function createCategory(
    projectId: string,
    title: string,
    useDefaultStatuses: boolean,
) {
    if (
        !(
            (await isSuperuser()) ||
            (await isProjectOwner(projectId)) ||
            (await isProjectAdmin(projectId))
        )
    ) {
        return {
            success: false,
            message: "Access denied.",
        };
    }

    const uniqueSlug = await generateUniqueSlug("category", title);
    try {
        const createdCategory = await prisma.category.create({
            data: {
                title,
                slug: uniqueSlug,
                projectId,
            },
        });

        if (useDefaultStatuses) {
            const { success, message } = await createDefaultStatuses(
                createdCategory.id,
            );

            if (!success) {
                return {
                    success: false,
                    message,
                };
            }
        }
        revalidatePath("/project/[slug]/[boardSlug]", "page");
        return {
            success: true,
            message: "Category created successfully.",
            category: createdCategory,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create Category.",
        };
    }
}

export async function updateCategory(categoryId: string, title: string) {
    try {
        const existingCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
            select: {
                title: true,
                projectId: true,
            },
        });

        if (!existingCategory) {
            return {
                success: false,
                message: "Category not found.",
            };
        }

        if (
            !(
                (await isSuperuser()) ||
                (await isProjectOwner(existingCategory.projectId)) ||
                (await isProjectAdmin(existingCategory.projectId))
            )
        ) {
            return {
                success: false,
                message: "Access denied.",
            };
        }

        const titleChanged = existingCategory.title !== title;
        const data = {
            title,
            slug: titleChanged
                ? await generateUniqueSlug("category", title)
                : undefined,
        };

        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId,
            },
            data,
        });
        revalidatePath("/project/[slug]/[boardSlug]", "page");
        return {
            success: true,
            message: "Category updated successfully.",
            category: updatedCategory,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update category.",
        };
    }
}

export async function deleteCategory(categoryId: string) {
    const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { projectId: true },
    });
    if (!existingCategory) {
        return {
            success: false,
            message: "Category not found.",
        };
    }

    if (
        !(
            (await isSuperuser()) ||
            (await isProjectOwner(existingCategory.projectId))
        )
    ) {
        return {
            success: false,
            message: "Access denied.",
        };
    }

    try {
        const deletedCategory = await prisma.category.delete({
            where: {
                id: categoryId,
            },
        });
        return {
            success: true,
            message: "Category deleted successfully.",
            category: deletedCategory,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Failed to delete Category.",
        };
    }
}

export async function createDefaultStatuses(categoryId: string) {
    try {
        const createdStatuses = [];
        for (const { title, colour, isDefault } of statusesData) {
            const uniqueSlug = await generateUniqueSlug("status", title);
            const status = await prisma.status.create({
                data: {
                    title,
                    colour,
                    categoryId,
                    isDefault,
                    slug: uniqueSlug,
                },
            });
            createdStatuses.push(status);
        }

        return {
            success: true,
            message: "Default statuses created successfully.",
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create default statuses.",
        };
    }
}
