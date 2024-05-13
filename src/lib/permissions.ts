"use server";

import { getUserSession } from "@/auth";
import prisma from "./prisma";

export async function isSuperuser() {
    const session = await getUserSession();
    return session?.user.isSuperuser;
}

export async function isProjectAdmin(projectId: string) {
    const session = await getUserSession();
    if (session?.user) {
        const projectAdminExists = await prisma.projectAdmin.findFirst({
            where: {
                userId: session.user.id,
                projectId,
            },
        });
        return !!projectAdminExists;
    }
    return false;
}

export async function isProjectOwner(projectId: string) {
    const session = await getUserSession();
    if (session?.user) {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: {
                owner: { select: { id: true } },
            },
        });
        const isOwner = session.user.id === project?.owner.id;
        return !!isOwner;
    }
    return false;
}
