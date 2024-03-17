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
import { Category } from "@/lib/types";
import {
    CategoryFormInputs,
    StatusFormField,
    formSchema,
} from "@/lib/board/constants";
import StatusFormFields from "./status-form-fields";
import { createCategory, updateCategory } from "@/lib/board/actions";
import { createOrUpdateStatus, deleteStatus } from "@/lib/board/status/actions";
import { useRouter } from "next/navigation";

export default function BoardForm({
    edit = false,
    category,
    initialStatuses,
    projectId,
    className,
}: {
    edit?: Boolean;
    category?: Category;
    initialStatuses?: Array<StatusFormField>;
    projectId?: string;
    className?: string;
}) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const EMPTY_STATUS: StatusFormField = {
        statusId: "",
        title: "",
        colour: "#000000",
        isDefault: false,
    };

    const formDefaultValues = {
        title: (edit && category?.title) || "",
        statuses: (edit && initialStatuses) || [EMPTY_STATUS],
    };
    const form = useForm<CategoryFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: formDefaultValues,
    });

    const {
        fields: statuses,
        append,
        remove,
    } = useFieldArray({ control: form.control, name: "statuses" });

    const handleAddStatus = () => {
        if (statuses.length < 5) {
            append(EMPTY_STATUS);
        } else {
            toast({ title: "Maximum limit reached." });
        }
    };

    const handleRemoveStatus = async (indexToRemove: number) => {
        if (statuses.length <= 1) {
            toast({
                title: "Cannot remove status",
                description: "There should be at least one status.",
            });
            return;
        }

        const id = statuses[indexToRemove].statusId;
        if (edit && id !== "") {
            const { success, message } = await deleteStatus(id);
            if (success) {
                remove(indexToRemove);
            }
            toast({ title: message });
        } else {
            remove(indexToRemove);
        }
    };

    const handleStatusUpdates = async (
        statuses: Array<StatusFormField>,
        categoryId: string,
    ) => {
        if (!edit) {
            statuses[0].isDefault = true;
        }
        const results = await Promise.all(
            statuses.map(async (status) => {
                const { success, message } = await createOrUpdateStatus(
                    status,
                    categoryId,
                );
                if (!success) {
                    return { success: false, message };
                }
            }),
        );
        return results;
    };

    const onSubmit = async (values: CategoryFormInputs) => {
        let result;
        setIsSubmitting(true);

        if (edit && category?.id) {
            result = await updateCategory(category.id, values.title);
        } else {
            if (!projectId) return;
            result = await createCategory(projectId, values.title, false);
        }

        if (result.success && result.category?.id) {
            const statusResults = await handleStatusUpdates(
                values.statuses,
                result.category.id,
            );
            const failedStatus = statusResults.find(
                (result) => !result?.success,
            );
            if (failedStatus) {
                return {
                    success: false,
                    message: "One or more status creation failed.",
                };
            }
        }

        setIsSubmitting(false);
        toast({ title: result.message });
        router.replace(
            `/project/${category?.project?.slug}/${result.category?.slug}`,
        );
    };

    return (
        <Card className={cn("w-full lg:w-1/2", className)}>
            <CardHeader>
                <CardTitle>{edit ? "Edit Board" : "Create Board"}</CardTitle>
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
                                            placeholder="The name of the Board."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <StatusFormFields
                            statuses={statuses}
                            control={form.control}
                            register={form.register}
                            handleRemoveStatus={handleRemoveStatus}
                        />
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant={"secondary"}
                                onClick={handleAddStatus}
                            >
                                Add Status
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    !form.formState.isDirty || isSubmitting
                                }
                            >
                                {edit ? "Save Changes" : "Create Board"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
