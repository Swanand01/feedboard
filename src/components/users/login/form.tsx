"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginFormInputs, formSchema } from "@/lib/users/login/constants";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    const router = useRouter();
    const form = useForm<LoginFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(values: LoginFormInputs) {
        setIsSubmitting(true);
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: "/home",
            // Make dynamic
        });
        setIsSubmitting(false);
    }

    return (
        <Card className="w-full md:w-96 mx-auto">
            <CardHeader>
                <CardTitle>Login to Feedboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center">
                            <Button
                                type="submit"
                                disabled={
                                    !form.formState.isDirty || isSubmitting
                                }
                            >
                                Login
                            </Button>
                            <p className="ml-4">or</p>
                            <Button
                                type="button"
                                variant={"link"}
                                onClick={() => {
                                    router.push("/sign-up");
                                }}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
