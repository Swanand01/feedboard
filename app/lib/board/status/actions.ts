import prisma from "~/lib/prisma.server";
import { StatusFormInputs, formSchema as CreateStatus } from "./constants";
import { generateUniqueSlug } from "~/lib/utils.server";
import { StatusFormField } from "../constants";
import {
  isProjectAdmin,
  isProjectOwner,
  isSuperuser,
} from "~/lib/permissions.server";
import { authenticator } from "~/services/auth.server";

export async function createStatus(
  request: Request,
  status: StatusFormInputs,
  categoryId: string,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
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
    !(
      (await isSuperuser(user)) ||
      (await isProjectAdmin(user, category.projectId)) ||
      (await isProjectOwner(user, category.projectId))
    )
  ) {
    return {
      success: false,
      message: "Access denied.",
    };
  }

  const validatedFields = CreateStatus.safeParse(status);
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

export async function updateStatus(
  request: Request,
  status: StatusFormInputs,
  statusId: string,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
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
      (await isSuperuser(user)) ||
      (await isProjectOwner(user, existingStatus.category.projectId)) ||
      (await isProjectAdmin(user, existingStatus.category.projectId))
    )
  ) {
    return {
      success: false,
      message: "Access denied.",
    };
  }

  const validatedFields = CreateStatus.safeParse(status);
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
          ? await generateUniqueSlug("status", title)
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
    console.log(error);
    return {
      success: false,
      message: "Failed to update status.",
    };
  }
}

export async function deleteStatus(request: Request, statusId: string) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

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
      (await isSuperuser(user)) ||
      (await isProjectOwner(user, existingStatus.category.projectId)) ||
      (await isProjectAdmin(user, existingStatus.category.projectId))
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
      select: {
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
      message: "Status deleted successfully.",
      status: deletedStatus,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete Status.",
    };
  }
}

export async function createOrUpdateStatus(
  request: Request,
  status: StatusFormField,
  categoryId: string,
) {
  console.log(status);
  if (status.statusId === "") {
    return await createStatus(request, status, categoryId);
  }
  return await updateStatus(request, status, status.statusId);
}

export async function changeDefaultStatus(request: Request, statusId: string) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const existingStatus = await prisma.status.findUnique({
    where: { id: statusId },
    select: {
      category: {
        select: {
          id: true,
          projectId: true,
        },
      },
    },
  });

  if (!existingStatus) {
    return {
      success: false,
      message: "Status not found.",
    };
  }

  const hasPermissions =
    (await isSuperuser(user)) ||
    (await isProjectOwner(user, existingStatus.category.projectId)) ||
    (await isProjectAdmin(user, existingStatus.category.projectId));

  if (!hasPermissions) {
    return {
      success: false,
      message: "Access denied.",
    };
  }

  try {
    await prisma.status.updateMany({
      where: {
        isDefault: true,
        categoryId: existingStatus.category.id,
      },
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
