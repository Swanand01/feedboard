'use server';

import prisma from "@/lib/prisma";
import { getUserSession } from "@/auth";
import { revalidatePath } from "next/cache";
import { ProjectFormInputs } from "@/lib/project/constants";
import { CategoryFormField, formSchema as CreateProject, statusesData } from "./constants";
import { generateUniqueSlug } from "@/lib/utils";

async function createProjectCategory(projectId: string, title: string) {
    const uniqueSlug = await generateUniqueSlug('category', title);
    try {
        const createdCategory = await prisma.category.create({
            data: {
                title,
                slug: uniqueSlug,
                projectId,
            }
        });
        const { success, message } = await createDefaultStatuses(createdCategory.id);

        if (!success) {
            return {
                success: false,
                message,
            };
        }

        return {
            success: true,
            message: 'Category created successfully.',
            category: createdCategory
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to create Category.',
        };
    }
}

async function updateProjectCategory(categoryId: string, title: string) {
    try {
        const existingCategory = await prisma.category.findUnique({
            where: {
                id: categoryId
            },
            select: {
                title: true
            }
        });

        if (!existingCategory) {
            return {
                success: false,
                message: 'Category not found.',
            }
        }

        const titleChanged = existingCategory.title !== title;
        const data = {
            title,
            slug: titleChanged ? await generateUniqueSlug('category', title) : undefined
        };

        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId
            },
            data,
        });

        return {
            success: true,
            message: 'Category updated successfully.',
            category: updatedCategory,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to update category.',
        };
    }
}


async function createOrUpdateProjectCategory(projectId: string, category: CategoryFormField) {
    if (category.categoryId === "") {
        return createProjectCategory(projectId, category.title);
    } else {
        return updateProjectCategory(category.categoryId, category.title);
    }
}

export async function createProject(values: ProjectFormInputs) {
    const session = await getUserSession();
    if (!session?.user?.isSuperuser) {
        return {
            success: false,
            message: 'Access denied. You are not a superuser.'
        };
    }

    const validatedFields = CreateProject.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Fields are missing.'
        };
    }

    const { title, description, categories } = validatedFields.data;
    const uniqueSlug = await generateUniqueSlug('project', title);
    try {
        const project = await prisma.project.create({
            data: {
                title,
                description,
                slug: uniqueSlug,
                userId: session?.user.id,
            }
        });

        const categoryResults = await Promise.all(categories.map(async (category) => {
            const { success, message } = await createOrUpdateProjectCategory(project.id, category);
            if (!success) {
                return {
                    success: false,
                    message
                }
            }
        }));

        const failedCategory = categoryResults.find(result => !result?.success);
        if (failedCategory) {
            return {
                success: false,
                message: 'One or more category creation failed.',
            };
        }

        return {
            success: true,
            message: 'Project created successfully.',
            project: project,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to create project.',
        };
    }
}

export async function updateProject(projectId: string, values: ProjectFormInputs) {
    const session = await getUserSession();
    if (!session?.user?.isSuperuser) {
        return {
            success: false,
            message: 'Access denied. You are not a superuser.'
        };
    }

    const validatedFields = CreateProject.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Fields are missing.'
        };
    }

    const { title, description, categories } = validatedFields.data;
    try {
        const existingProject = await prisma.project.findUnique({
            where: {
                id: projectId
            },
            select: {
                title: true,
            }
        });

        if (!existingProject) {
            return {
                success: false,
                message: 'Project not found.',
            }
        }

        const titleChanged = existingProject?.title !== title;

        const project = await prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                title,
                description,
                slug: titleChanged ? await generateUniqueSlug('project', title) : undefined
            },
        });

        const categoryResults = await Promise.all(categories.map(async (category) => {
            const { success, message } = await createOrUpdateProjectCategory(project.id, category);
            if (!success) {
                return {
                    success: false,
                    message
                }
            }
        }));

        const failedCategory = categoryResults.find(result => !result?.success);
        if (failedCategory) {
            return {
                success: false,
                message: 'One or more category updates failed.',
            };
        }

        revalidatePath(`/project/${project.slug}/edit`);

        return {
            success: true,
            message: 'Project updated successfully.',
            project: project,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to update project.',
        };
    }
}

export async function deleteCategory(categoryId: string) {
    try {
        const createdCategory = await prisma.category.delete({
            where: {
                id: categoryId
            },
        })
        return {
            success: true,
            message: 'Category deleted successfully.',
            category: createdCategory
        }
    } catch (error) {
        return {
            success: false,
            message: 'Failed to delete Category.',
        }
    }
}

export async function createDefaultStatuses(categoryId: string) {
    try {
        await Promise.all(
            statusesData.map(async ({ title, colour }) => {
                return prisma.status.create({
                    data: {
                        title,
                        colour,
                        categoryId
                    }
                });
            })
        );
        return {
            success: true,
            message: 'Default statuses created successfully.',
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to create default statuses.`,
        };
    }
}
