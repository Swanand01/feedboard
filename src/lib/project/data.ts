'use server';

import prisma from "@/lib/prisma";

export async function getProject(slug: string) {
    const project = await prisma.project.findUnique({
        where: {
            slug: slug
        },
        include: {
            categories: {
                include: {
                    statuses: true
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        },
    })
    return project;
}

export async function getPostsByStatus(statusId: string) {
    const posts = await prisma.post.findMany({
        where: {
            statusId: statusId
        },
        include: {
            _count: {
                select: {
                    upvotes: true
                }
            }
        }
    })
    return posts;
}

export async function getProjectAdmins(projectId: string) {
    const projectAdmins = await prisma.projectAdmin.findMany({
        where: {
            projectId: projectId
        },
        select: {
            id: true,
            user: {
                select: {
                    username: true
                }
            }
        }
    });
    return projectAdmins;
}