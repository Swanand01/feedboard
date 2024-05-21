"use server";

import prisma from "@/lib/prisma";
import { getUserSession } from "@/auth";
import { revalidatePath } from "next/cache";
import { ProjectFormInputs } from "@/lib/project/constants";
import { CategoryFormField, formSchema as CreateProject } from "./constants";
import { generateUniqueSlug } from "@/lib/utils";
import { createCategory, updateCategory } from "../board/actions";
import { isProjectOwner, isSuperuser } from "../permissions";

async function createOrUpdateProjectCategory(
    projectId: string,
    category: CategoryFormField,
) {
    if (category.categoryId === "") {
        return createCategory(projectId, category.title, true);
    }
    return updateCategory(category.categoryId, category.title);
}

export async function createProject(values: ProjectFormInputs) {
    const session = await getUserSession();
    if (!(session?.user && (await isSuperuser()))) {
        return {
            success: false,
            message: "Access denied. You are not a superuser.",
        };
    }

    const validatedFields = CreateProject.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Fields are missing.",
        };
    }

    const { title, description, categories } = validatedFields.data;
    const uniqueSlug = await generateUniqueSlug("project", title);
    try {
        const project = await prisma.project.create({
            data: {
                title,
                description,
                slug: uniqueSlug,
                userId: session.user.id,
            },
        });

        const categoryResults = [];
        for (const category of categories) {
            const { success, message } = await createOrUpdateProjectCategory(
                project.id,
                category,
            );
            categoryResults.push({ success, message });

            if (!success) {
                return {
                    success: false,
                    message: `Failed to create category: ${message}`,
                };
            }
        }

        return {
            success: true,
            message: "Project created successfully.",
            project: project,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create project.",
        };
    }
}

export async function updateProject(
    projectId: string,
    values: ProjectFormInputs,
) {
    if (!((await isSuperuser()) || (await isProjectOwner(projectId)))) {
        return {
            success: false,
            message: "Access denied. You are not a superuser.",
        };
    }

    const validatedFields = CreateProject.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Fields are missing.",
        };
    }

    const { title, description, categories } = validatedFields.data;
    try {
        const existingProject = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            select: {
                title: true,
            },
        });

        if (!existingProject) {
            return {
                success: false,
                message: "Project not found.",
            };
        }

        const titleChanged = existingProject?.title !== title;

        const project = await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                title,
                description,
                slug: titleChanged
                    ? await generateUniqueSlug("project", title)
                    : undefined,
            },
        });

        const categoryResults = [];
        for (const category of categories) {
            const { success, message } = await createOrUpdateProjectCategory(
                project.id,
                category,
            );
            categoryResults.push({ success, message });

            if (!success) {
                return {
                    success: false,
                    message: `Failed to update category: ${message}`,
                };
            }
        }

        revalidatePath(`/project/${project.slug}/edit`);

        return {
            success: true,
            message: "Project updated successfully.",
            project: project,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update project.",
        };
    }
}

export async function createProjectAdmin(userId: string, projectId: string) {
    if (!((await isSuperuser()) || (await isProjectOwner(projectId)))) {
        return {
            success: false,
            message: "Access denied. You are not a superuser.",
        };
    }

    try {
        const createdProjectAdmin = await prisma.projectAdmin.create({
            data: {
                projectId: projectId,
                userId: userId,
            },
        });
        revalidatePath("/project/[slug]/edit/", "page");
        return {
            success: true,
            message: "ProjectAdmin created successfully.",
            projectAdmin: createdProjectAdmin,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create the ProjectAdmin.",
        };
    }
}

export async function deleteProjectAdmin(projectAdminId: string) {
    const existingProjectAdmin = await prisma.projectAdmin.findUnique({
        where: { id: projectAdminId },
    });
    if (!existingProjectAdmin) {
        return {
            success: false,
            message: "ProjectAdmin not found.",
        };
    }

    if (
        !(
            (await isSuperuser()) ||
            (await isProjectOwner(existingProjectAdmin.projectId))
        )
    ) {
        return {
            success: false,
            message: "Access denied. You are not a superuser.",
        };
    }

    try {
        const deletedProjectAdmin = await prisma.projectAdmin.delete({
            where: { id: projectAdminId },
        });
        revalidatePath("/project/[slug]/edit/", "page");
        return {
            success: true,
            message: "ProjectAdmin deleted successfully.",
            projectAdmin: deletedProjectAdmin,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete the ProjectAdmin.",
        };
    }
}

export async function deleteProject(projectId: string) {
    if (!((await isSuperuser()) || (await isProjectOwner(projectId)))) {
        return {
            success: false,
            message: "Access denied. You are not a superuser.",
        };
    }
    try {
        const deletedProject = await prisma.project.delete({
            where: { id: projectId },
        });
        revalidatePath("/home");
        return {
            success: true,
            message: "Project deleted successfully.",
            deletedProject: deletedProject,
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Failed to delete the Project.",
        };
    }
}
