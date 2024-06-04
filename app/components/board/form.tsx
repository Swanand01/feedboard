import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useToast } from "~/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form as FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  CategoryFormInputs,
  StatusFormField,
  formSchema,
} from "~/lib/board/constants";
import StatusFormFields from "./status-form-fields";
import { Form, useFetcher } from "@remix-run/react";

interface Category {
  id: string;
  title: string;
}

export default function BoardForm({
  edit = false,
  category,
  initialStatuses,
  className,
}: {
  edit?: boolean;
  category?: Category;
  initialStatuses?: Array<StatusFormField>;
  className?: string;
}) {
  const { toast } = useToast();
  const fetcher = useFetcher<{ success: boolean; message: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const EMPTY_STATUS: StatusFormField = {
    statusId: "",
    title: "",
    colour: "#000000",
    isDefault: false,
  };

  const formDefaultValues = {
    title: edit && category?.title ? category.title : "",
    statuses: edit && initialStatuses ? initialStatuses : [EMPTY_STATUS],
  };
  const form = useForm<CategoryFormInputs>({
    resolver: zodResolver(formSchema),
    values: formDefaultValues,
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
      fetcher.submit(
        { statusId: id },
        {
          action: "/status/delete/",
          method: "DELETE",
          encType: "application/json",
        },
      );
    } else {
      remove(indexToRemove);
    }
  };

  function updateCategory(
    categoryId: string,
    title: string,
    statuses: StatusFormField[],
  ) {
    if (!edit) {
      statuses[0].isDefault = true;
    }
    fetcher.submit(
      { categoryId, title, statuses },
      {
        action: "/category/update/",
        method: "PUT",
        encType: "application/json",
      },
    );
  }

  function onSubmit(values: CategoryFormInputs) {
    const { title, statuses } = values;
    if (edit && category?.id) {
      updateCategory(category.id, title, statuses);
    }
  }

  useEffect(() => {
    setIsSubmitting(fetcher.state === "submitting");
    if (fetcher.state === "idle" && fetcher.data) {
      const { message } = fetcher.data;
      toast({ title: message });
    }
  }, [fetcher.state, fetcher.data, toast]);

  return (
    <Card className={cn("w-full lg:w-1/2", className)}>
      <CardHeader>
        <CardTitle>{edit ? "Edit Board" : "Create Board"}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The name of the Board." {...field} />
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
                disabled={!form.formState.isDirty || isSubmitting}
                name="__action"
                value="update_category"
              >
                {edit ? "Save Changes" : "Create Board"}
              </Button>
            </div>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
