"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import {
    CategoryFormField,
    ProjectFormInputs,
    formSchema,
} from "@/lib/project/constants";
import CategoryFormFields from "./category-form-fields";
import { createProject, updateProject } from "@/lib/project/actions";
import { deleteCategory } from "@/lib/board/actions";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function ProjectForm({
    edit = false,
    project,
    initialCategories,
    className,
}: {
    edit?: Boolean;
    project?: Project;
    initialCategories?: Array<CategoryFormField>;
    className?: string;
}) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formDefaultValues = {
        title: edit && project?.title ? project.title : "",
        description: edit && project?.description ? project.description : "",
        categories:
            edit && initialCategories
                ? initialCategories
                : [{ categoryId: "", title: "" }],
    };
    const form = useForm<ProjectFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: formDefaultValues,
    });

    const {
        fields: categories,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "categories",
    });

    const handleAddCategory = () => {
        if (categories.length < 5) {
            append({ categoryId: "", title: "" });
        } else {
            toast({
                title: "Maximum limit reached.",
            });
        }
    };

    const handleRemoveCategory = async (indexToRemove: number) => {
        if (categories.length <= 1) {
            toast({
                title: "Cannot remove category",
                description: "There should be at least one category.",
            });
            return;
        }

        const categoryIdToRemove = categories[indexToRemove].categoryId;
        if (edit && categoryIdToRemove !== "") {
            const { success, message } =
                await deleteCategory(categoryIdToRemove);
            if (success) {
                remove(indexToRemove);
            }
            toast({ title: message });
        } else {
            remove(indexToRemove);
        }
    };

    const onSubmit = async (values: ProjectFormInputs) => {
        let result;
        setIsSubmitting(true);
        if (edit && project?.id) {
            result = await updateProject(project.id, values);
        } else {
            result = await createProject(values);
        }
        if (result.success) {
            router.replace(`/project/${result.project?.slug}/`);
        }
        setIsSubmitting(false);
        toast({ title: result.message });
    };

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle>
                    {edit ? "Edit Project" : "Create Project"}
                </CardTitle>
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
                                            placeholder="The name of the project."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about this project."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <CategoryFormFields
                            categories={categories}
                            control={form.control}
                            register={form.register}
                            handleRemoveCategory={handleRemoveCategory}
                        />
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant={"secondary"}
                                onClick={handleAddCategory}
                            >
                                Add Category
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    !form.formState.isDirty || isSubmitting
                                }
                            >
                                {edit ? "Save Changes" : "Create Project"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
