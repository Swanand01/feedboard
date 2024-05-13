import prisma from "./prisma";

function main() {
    if (!process.env.SUPERUSER_EMAIL) {
        console.log("No SUPERUSER_EMAIL found in .env.");
        return;
    }

    const email = process.env.SUPERUSER_EMAIL;

    prisma.user
        .findFirst({
            where: {
                isSuperuser: true,
            },
        })
        .then((existingSuperuser) => {
            if (existingSuperuser) {
                console.log("A Superuser already exists.");
                return;
            } else {
                return prisma.user.create({
                    data: {
                        email,
                        username: email,
                        isSuperuser: true,
                    },
                });
            }
        })
        .then((createdSuperuser) => {
            if (createdSuperuser) {
                console.log("Superuser created with the given credentials");
            }
        })
        .catch((error) => {
            console.error("Error creating superuser:", error);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

main();
