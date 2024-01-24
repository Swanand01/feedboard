import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client'
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth"
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Sign In',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'hello@example.com'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    return null;
                }

                const passwordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!passwordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    dateJoined: user.dateJoined,
                    isSuperuser: user.isSuperuser
                };
            }
        })
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as User;
                return {
                    ...token,
                    id: u.id,
                    username: u.username,
                    email: u.email,
                    dateJoined: u.dateJoined,
                    isSuperuser: u.isSuperuser
                }
            }
            return token;
        },

        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    username: token.username,
                    email: token.email,
                    dateJoined: token.dateJoined,
                    isSuperuser: token.isSuperuser
                }
            }
        }
    },
    pages: {
        signIn: "/users/login"
    }
}

export function getUserSession(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, authOptions)
}