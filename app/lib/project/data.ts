import { POSTS_PER_ROADMAP } from "./constants";
import prisma from "../prisma.server";

export async function getProject(slug: string) {
  const project = await prisma.project.findUnique({
    where: {
      slug: slug,
    },
    include: {
      categories: {
        select: {
          id: true,
          title: true,
          slug: true,
          statuses: {
            select: {
              id: true,
              title: true,
              colour: true,
              posts: {
                select: {
                  id: true,
                  title: true,
                  content: true,
                  slug: true,
                  createdAt: true,
                  _count: {
                    select: {
                      upvotes: true,
                    },
                  },
                  upvotes: {
                    select: {
                      userId: true,
                    },
                  },
                  creator: {
                    select: {
                      username: true,
                    },
                  },
                },
                orderBy: {
                  upvotes: {
                    _count: "desc",
                  },
                },
                take: POSTS_PER_ROADMAP,
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  return project;
}

export async function getProjectAdmins(projectId: string) {
  const projectAdmins = await prisma.projectAdmin.findMany({
    where: {
      projectId: projectId,
    },
    select: {
      id: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  return projectAdmins;
}
