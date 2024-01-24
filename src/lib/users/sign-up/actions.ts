'use server';

import bcrypt from 'bcrypt';
import prisma from "@/lib/prisma";
import { formSchema as CreateUser, UserFormInputs } from "./constants";

export async function createUser(values: UserFormInputs) {
    const validatedFields = CreateUser.safeParse(values);
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    }

    const { username, email, password } = validatedFields.data;

    const existingUserByUsername = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    const existingUserByEmail = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    const errors: Record<string, string> = {};
    if (existingUserByUsername) {
        errors.username = 'Username is already taken.';
    }
    if (existingUserByEmail) {
        errors.email = 'Email is already registered.';
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        return {
            success: true,
            message: "User created successfully.",
            errors,
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to create User.",
            errors,
        }
    }
}