import {
  CategoryFormField,
  formSchema as CreateProject,
  ProjectFormInputs,
} from "./constants";
import { generateUniqueSlug } from "~/lib/utils.server";
import { createCategory, updateCategory } from "../board/actions";
import { isProjectOwner, isSuperuser } from "../permissions.server";
import prisma from "../prisma.server";
import { authenticator } from "~/services/auth.server";

async function createOrUpdateProjectCategory(
  request: Request,
  projectId: string,
  category: CategoryFormField,
) {
  if (category.categoryId === "") {
    return createCategory(request, projectId, category.title, true);
  }
  return updateCategory(request, category.categoryId, category.title);
}

export async function createProject(request: Request) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (!(await isSuperuser(user))) {
    return {
      success: false,
      message: "Access denied. You are not a superuser.",
    };
  }
  const values: ProjectFormInputs = await request.json();
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
        userId: user.id,
      },
    });

    const categoryResults = [];
    for (const category of categories) {
      const { success, message } = await createOrUpdateProjectCategory(
        request,
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
    console.log(error);
    return {
      success: false,
      message: "Failed to create project.",
    };
  }
}

export async function updateProject(
  request: Request,
  projectId: string,
  values: ProjectFormInputs,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const hasPermissions =
    (await isSuperuser(user)) || (await isProjectOwner(user, projectId));
  if (!hasPermissions) {
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
        request,
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

export async function createProjectAdmin(
  request: Request,
  userId: string,
  projectId: string,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const hasPermissions =
    (await isSuperuser(user)) || (await isProjectOwner(user, projectId));
  if (!hasPermissions) {
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

export async function deleteProjectAdmin(
  request: Request,
  projectAdminId: string,
) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const existingProjectAdmin = await prisma.projectAdmin.findUnique({
    where: { id: projectAdminId },
  });
  if (!existingProjectAdmin) {
    return {
      success: false,
      message: "ProjectAdmin not found.",
    };
  }

  const hasPermissions =
    (await isSuperuser(user)) ||
    (await isProjectOwner(user, existingProjectAdmin.projectId));
  if (!hasPermissions) {
    return {
      success: false,
      message: "Access denied. You are not a superuser.",
    };
  }

  try {
    const deletedProjectAdmin = await prisma.projectAdmin.delete({
      where: { id: projectAdminId },
    });
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

export async function deleteProject(request: Request, projectId: string) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const hasPermissions =
    (await isSuperuser(user)) || (await isProjectOwner(user, projectId));
  if (!hasPermissions) {
    return {
      success: false,
      message: "Access denied. You are not a superuser.",
    };
  }
  try {
    const deletedProject = await prisma.project.delete({
      where: { id: projectId },
    });
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
