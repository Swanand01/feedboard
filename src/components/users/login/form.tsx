"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    async function login() {
        await signIn("google", { redirect: true, callbackUrl: "/home" });
    }

    return (
        <Card className="w-full md:w-96 mx-auto">
            <CardHeader>
                <CardTitle>Login to Feedboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Button variant="default" onClick={login}>
                    Sign In with Google
                </Button>
            </CardContent>
        </Card>
    );
}
