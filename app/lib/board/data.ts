import prisma from "../prisma.server";

export async function getCategory(categorySlug: string) {
  const category = await prisma.category.findUnique({
    where: {
      slug: categorySlug,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      projectId: true,
      statuses: { orderBy: { isDefault: "desc" } },
      project: { select: { slug: true } },
    },
  });
  return category;
}
