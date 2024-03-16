"use server";

import prisma from "@/lib/prisma";
import { StatusFormInputs, formSchema as CreateStatus } from "./constants";
import { generateUniqueSlug } from "@/lib/utils";
import { StatusFormField } from "../constants";
import { isProjectAdmin, isSuperuser } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function createStatus(
    values: StatusFormInputs,
    categoryId: string,
) {
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { projectId: true },
    });

    if (!category) {
        return {
            success: false,
            message: "Category not found.",
        };
    }

    if (
        !((await isSuperuser()) || (await isProjectAdmin(category.projectId)))
    ) {
        return {
            success: false,
            message: "Access denied.",
        };
    }

    const validatedFields = CreateStatus.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Fields are missing.",
        };
    }

    const { title, colour, isDefault } = validatedFields.data;
    try {
        const slug = await generateUniqueSlug("status", title);
        const status = await prisma.status.create({
            data: { title, colour, isDefault, slug, categoryId },
        });
        return {
            success: true,
            status: status,
            message: "Status created successfully.",
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create status.",
        };
    }
}

export async function updateStatus(values: StatusFormInputs, statusId: string) {
    const existingStatus = await prisma.status.findUnique({
        where: { id: statusId },
        select: { title: true, category: { select: { projectId: true } } },
    });

    if (!existingStatus) {
        return {
            success: false,
            message: "Status not found.",
        };
    }

    if (
        !(
            (await isSuperuser()) ||
            (await isProjectAdmin(existingStatus.category.projectId))
        )
    ) {
        return {
            success: false,
            message: "Access denied.",
        };
    }

    const validatedFields = CreateStatus.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Fields are missing.",
        };
    }

    const { title, colour, isDefault } = validatedFields.data;
    const titleChanged = existingStatus.title !== title;
    try {
        const updatedStatus = await prisma.status.update({
            where: {
                id: statusId,
            },
            data: {
                title,
                slug: titleChanged
                    ? await generateUniqueSlug("project", title)
                    : undefined,
                colour,
                isDefault,
            },
        });
        return {
            success: true,
            status: updatedStatus,
            message: "Status updated successfully.",
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update status.",
        };
    }
}

export async function deleteStatus(statusId: string) {
    const existingStatus = await prisma.status.findUnique({
        where: { id: statusId },
        select: {
            title: true,
            isDefault: true,
            categoryId: true,
            category: { select: { projectId: true } },
        },
    });

    if (!existingStatus) {
        return {
            success: false,
            message: "Status not found.",
        };
    }

    if (
        !(
            (await isSuperuser()) ||
            (await isProjectAdmin(existingStatus.category.projectId))
        )
    ) {
        return {
            success: false,
            message: "Access denied.",
        };
    }

    if (existingStatus.isDefault) {
        return {
            success: false,
            message: "Cannot delete default Status.",
        };
    }

    const defaultStatus = await prisma.status.findFirst({
        where: { isDefault: true, categoryId: existingStatus.categoryId },
        select: { id: true },
    });

    if (!defaultStatus) {
        return {
            success: false,
            message:
                "Status cannot be deleted, since a default status to reassign the posts was not found.",
        };
    }

    await prisma.post.updateMany({
        where: { statusId },
        data: { statusId: defaultStatus.id },
    });

    try {
        const deletedStatus = await prisma.status.delete({
            where: { id: statusId },
        });
        return {
            success: true,
            message: "Status deleted successfully.",
            category: deletedStatus,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete Status.",
        };
    }
}

export async function createOrUpdateStatus(
    status: StatusFormField,
    categoryId: string,
) {
    if (status.statusId === "") {
        return await createStatus(status, categoryId);
    }
    return await updateStatus(status, status.statusId);
}

export async function changeDefaultStatus(statusId: string) {
    try {
        await prisma.status.updateMany({
            where: { isDefault: true },
            data: { isDefault: false },
        });
        const defaultStatus = await prisma.status.update({
            where: { id: statusId },
            data: { isDefault: true },
        });

        return {
            success: true,
            message: "Default Status changed successfully.",
            status: defaultStatus,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to change default Status.",
        };
    }
}
