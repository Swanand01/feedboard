"use client";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusFormField } from "@/lib/board/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeDefaultStatus } from "@/lib/board/status/actions";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
    status: z.string({
        required_error: "Please select a status.",
    }),
});

type DefaultStatusFormInputs = z.infer<typeof FormSchema>;

export default function DefaultStatusForm({
    statuses,
    className,
}: {
    statuses: Array<StatusFormField>;
    className?: string;
}) {
    const { toast } = useToast();

    const defaultStatus = statuses.find((status) => status.isDefault);
    const form = useForm<DefaultStatusFormInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            status: defaultStatus?.statusId,
        },
    });

    const onSubmit = async (values: DefaultStatusFormInputs) => {
        const { success } = await changeDefaultStatus(values.status);
        if (success) {
            toast({ title: "Default Status updated." });
        }
    };

    return (
        <Card className={cn("h-fit w-full md:w-96", className)}>
            <CardHeader>
                <CardTitle>Select Default Status</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={cn("space-y-6", className)}
                    >
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            form.handleSubmit(onSubmit)();
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a default Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem
                                                    key={status.statusId}
                                                    value={status.statusId}
                                                >
                                                    {status.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
