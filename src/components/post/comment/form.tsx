"use client";
import { CommentFormInputs } from "@/lib/post/comment/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema } from "@/lib/post/comment/constants";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { createComment } from "@/lib/post/comment/actions";
import { useToast } from "@/components/ui/use-toast";

export default function CommentForm({ postId }: { postId: string }) {
    const { toast } = useToast();
    const formDefaultValues = {
        text: "",
    };
    const form = useForm<CommentFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: formDefaultValues,
    });

    const onSubmit = async (values: CommentFormInputs) => {
        const res = await createComment(postId, values);
        if (res && !res.success) {
            toast({ title: res.message });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-x-3"
            >
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input
                                    {...field}
                                    maxLength={140}
                                    placeholder="Have something to say?"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={!form.formState.isDirty}>
                    <PaperPlaneIcon height={28} />
                </Button>
            </form>
        </Form>
    );
}
