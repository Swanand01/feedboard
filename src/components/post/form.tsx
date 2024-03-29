"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { PostFormInputs, formSchema } from "@/lib/post/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "@prisma/client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { createPost, updatePost } from "@/lib/post/actions";
import { useRouter } from "next/navigation";

export default function PostForm({
    categoryId,
    edit = false,
    post,
    className,
    boardUrl,
}: {
    categoryId: string;
    edit?: Boolean;
    post?: Post;
    className?: string;
    boardUrl: string;
}) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formDefaultValues = {
        title: edit && post?.title ? post.title : "",
        content: edit && post?.content ? post.content : "",
    };
    const form = useForm<PostFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: formDefaultValues,
    });

    const onSubmit = async (values: PostFormInputs) => {
        setIsSubmitting(true);
        let res;
        if (edit && post) {
            res = await updatePost(post.id, values);
        } else {
            res = await createPost(categoryId, values);
        }

        if (!res) return;
        if (res.success) {
            toast({ title: edit ? "Post updated!" : "Post created!" });
            router.replace(`${boardUrl}/${res.post?.slug}`);
            form.reset();
        } else {
            toast({ title: res.message });
        }

        setIsSubmitting(false);
    };

    return (
        <Card className={cn("h-fit w-full", !edit && "lg:max-w-96", className)}>
            <CardHeader>
                <CardTitle>Create a Post</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="The title of the post."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="h-[120px] lg:h-[200px]"
                                            placeholder="Tell us a little bit about this post."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between">
                            <Button
                                type="submit"
                                disabled={
                                    !form.formState.isDirty || isSubmitting
                                }
                            >
                                {edit ? "Save Post" : "Create Post"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
