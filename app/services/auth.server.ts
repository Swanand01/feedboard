import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import prisma from "~/lib/prisma.server";
import { sessionStorage } from "./session.server";
import { User } from "~/lib/types";

const googleStrategy = new GoogleStrategy(
  {
    clientID: String(process.env.GOOGLE_CLIENT_ID),
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: "http://localhost:5173/auth/google/callback",
  },
  async ({ profile }) => {
    const user = await prisma.user.findUnique({
      where: {
        email: profile.emails[0].value,
      },
    });

    if (!user) {
      const user = await prisma.user.create({
        data: {
          username: profile.displayName,
          email: profile.emails[0].value,
        },
        select: {
          id: true,
          username: true,
          email: true,
          isSuperuser: true,
        },
      });
      return user;
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isSuperuser: user.isSuperuser,
    };
  },
);

export const authenticator = new Authenticator<User>(sessionStorage);
authenticator.use(googleStrategy);
