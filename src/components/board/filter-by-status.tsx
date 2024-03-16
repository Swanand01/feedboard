"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Status = {
    id: string;
    title: string;
    slug: string | null;
};

const FormSchema = z.object({
    status: z.string({
        required_error: "Please select a status.",
    }),
});

type FilterByStatusFormInputs = z.infer<typeof FormSchema>;

export default function FilterByStatus({
    statuses,
    selectedStatus,
    className,
}: {
    statuses: Array<Status>;
    selectedStatus: string;
    className?: string;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const form = useForm<FilterByStatusFormInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            status: selectedStatus,
        },
    });

    function onSubmit(values: FilterByStatusFormInputs) {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        params.set("status", values.status);
        replace(`${pathname}?${params.toString()}`);
    }

    return (
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
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {statuses.map((status) => (
                                        <SelectItem
                                            key={status.id}
                                            value={status?.slug || ""}
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
    );
}
