import prisma from "../prisma.server";
import { generateUniqueSlug } from "../utils.server";
import { statusesData } from "../project/constants";
import {
  isProjectAdmin,
  isProjectOwner,
  isSuperuser,
} from "../permissions.server";
import { authenticator } from "~/services/auth.server";

export async function createCategory(
  request: Request,
  projectId: string,
  title: string,
  useDefaultStatuses: boolean,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const hasPermissions =
    (await isSuperuser(user)) ||
    (await isProjectOwner(user, projectId)) ||
    (await isProjectAdmin(user, projectId));

  if (!hasPermissions) {
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

export async function updateCategory(
  request: Request,
  categoryId: string,
  title: string,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
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

    const hasPermissions =
      (await isSuperuser(user)) ||
      (await isProjectOwner(user, existingCategory.projectId)) ||
      (await isProjectAdmin(user, existingCategory.projectId));
    if (!hasPermissions) {
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
      include: {
        project: {
          select: {
            slug: true,
          },
        },
      },
      data,
    });
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

export async function deleteCategory(request: Request, categoryId: string) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

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

  const hasPermissions =
    (await isSuperuser(user)) ||
    (await isProjectOwner(user, existingCategory.projectId));
  if (!hasPermissions) {
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
      select: {
        project: {
          select: {
            slug: true,
          },
        },
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
