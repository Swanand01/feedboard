import prisma from "../prisma.server";

export async function getUsersLikeUsername(username: string) {
  const users = await prisma.user.findMany({
    where: {
      username: {
        startsWith: username,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      username: true,
    },
    take: 5,
  });
  return users;
}
