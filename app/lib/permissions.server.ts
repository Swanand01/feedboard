import prisma from "./prisma.server";
import { User } from "./types";

export async function isSuperuser(user: User) {
  return !!user && user.isSuperuser;
}

export async function isProjectAdmin(user: User, projectId: string) {
  if (user) {
    const projectAdminExists = await prisma.projectAdmin.findFirst({
      where: {
        userId: user.id,
        projectId,
      },
    });
    return !!projectAdminExists;
  }
  return false;
}

export async function isProjectOwner(user: User, projectId: string) {
  if (user) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        owner: { select: { id: true } },
      },
    });
    const isOwner = user.id === project?.owner.id;
    return !!isOwner;
  }
  return false;
}
