import prisma from "./prisma.server";

async function getUser(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

async function createSuperuser(email: string) {
  await prisma.user.create({
    data: {
      email,
      username: email,
      isSuperuser: true,
    },
  });
}

async function updateSuperuser(email: string) {
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      isSuperuser: true,
    },
  });
}

async function main() {
  if (!process.env.SUPERUSER_EMAIL) {
    console.log("No SUPERUSER_EMAIL found in .env.");
    return;
  }

  const email = process.env.SUPERUSER_EMAIL;

  try {
    const existingUser = await getUser(email);

    if (!existingUser) {
      await createSuperuser(email);
      console.log("Superuser created with the given credentials.");
    } else if (!existingUser.isSuperuser) {
      await updateSuperuser(email);
      console.log("The user's superuser status has been updated to true.");
    } else {
      console.log("The user is already a Superuser.");
    }
  } catch (error) {
    console.error("Error creating or updating superuser:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
