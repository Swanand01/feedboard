import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from "next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            httpOptions: {
                timeout: 10000,
            },
            async profile(profile) {
                // @ts-ignore
                const user: User = await prisma.user.findUnique({
                    where: {
                        email: profile.email,
                    },
                });
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    dateJoined: user.dateJoined,
                    isSuperuser: user.isSuperuser,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                if (!profile?.name || !profile.email) return false;

                const existingUserByEmail = await prisma.user.findUnique({
                    where: {
                        email: profile?.email,
                    },
                });
                if (!existingUserByEmail) {
                    await prisma.user.create({
                        data: {
                            username: profile.name,
                            email: profile.email,
                        },
                    });
                }
            }
            return true;
        },
        jwt: ({ token, user }) => {
            if (user) {
                return { ...token, ...user };
            }
            return token;
        },
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    id: token.id,
                    username: token.username,
                    email: token.email,
                    dateJoined: token.dateJoined,
                    isSuperuser: token.isSuperuser,
                },
            };
        },
    },
    pages: {
        signIn: "/users/login",
    },
};

export function getUserSession(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions);
}
