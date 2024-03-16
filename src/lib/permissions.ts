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
