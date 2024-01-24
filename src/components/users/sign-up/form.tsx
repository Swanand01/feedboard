"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { UserFormInputs, formSchema } from "@/lib/users/sign-up/constants";
import { createUser } from "@/lib/users/sign-up/actions";

export default function SignUpForm() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<UserFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(values: UserFormInputs) {
        setIsSubmitting(true);
        const { success, errors } = await createUser(values);
        setIsSubmitting(false);

        errors?.username &&
            form.setError("username", {
                message: errors.username as string,
            });

        errors?.email &&
            form.setError("email", { message: errors.email as string });

        if (success) {
            toast({
                title: "Account created successfully.",
                description: " Please login to continue.",
            });
            router.push("/users/login");
        } else {
            toast({ title: "Failed to create your account." });
        }
    }

    return (
        <Card className="w-full md:w-96 mx-auto">
            <CardHeader>
                <CardTitle>Create an Account</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm Password"
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
                                Sign Up
                            </Button>
                            <p className="ml-4">or</p>
                            <Button
                                type="button"
                                variant={"link"}
                                onClick={() => {
                                    router.push("/login");
                                }}
                            >
                                Login
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
