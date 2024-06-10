import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, useSearchParams } from "@remix-run/react";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const form = useForm<FilterByStatusFormInputs>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: selectedStatus,
    },
  });

  function onChange(values: FilterByStatusFormInputs) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("status", values.status);
    setSearchParams(params);
  }

  return (
    <FormProvider {...form}>
      <Form className={cn("space-y-6 prose dark:prose-invert", className)}>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onChange(form.getValues());
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
                    <SelectItem key={status.id} value={status?.slug || ""}>
                      {status.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </FormProvider>
  );
}
