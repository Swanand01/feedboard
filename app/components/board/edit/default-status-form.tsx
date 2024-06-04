import { z } from "zod";
import { cn } from "~/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form as FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { useFetcher } from "@remix-run/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { StatusFormField } from "~/lib/board/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "~/components/ui/use-toast";

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
  const fetcher = useFetcher<{ success: boolean; message: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultStatus = statuses.find((status) => status.isDefault);
  const form = useForm<DefaultStatusFormInputs>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: defaultStatus?.statusId,
    },
  });

  useEffect(() => {
    setIsSubmitting(fetcher.state === "submitting");
    if (fetcher.state === "idle" && fetcher.data) {
      const { message } = fetcher.data;
      toast({ title: message });
    }
  }, [fetcher.state, fetcher.data, toast]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Select Default Status</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <fetcher.Form
            action="/status/change-default/"
            method="POST"
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
                    }}
                    defaultValue={field.value}
                    name="statusId"
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
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isSubmitting}
            >
              Save Changes
            </Button>
          </fetcher.Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
