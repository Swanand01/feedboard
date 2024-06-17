import prisma from "~/lib/prisma.server";

export async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  return projects;
}
