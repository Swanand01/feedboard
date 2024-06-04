import { cn } from "~/lib/utils";
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
import { Textarea } from "../ui/textarea";
import {
  CategoryFormField,
  ProjectFormInputs,
  formSchema,
} from "~/lib/project/constants";
import { Form, useFetcher, useNavigation, useSubmit } from "@remix-run/react";
import CategoryFormFields from "./category-form-fields";
import { useEffect } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
}

export default function ProjectForm({
  edit = false,
  project,
  initialCategories,
  className,
}: {
  edit?: boolean;
  project?: Project;
  initialCategories?: Array<CategoryFormField>;
  className?: string;
}) {
  const fetcher = useFetcher<{ success: boolean; message: string }>();
  const { toast } = useToast();
  const submit = useSubmit();
  const isSubmitting =
    useNavigation().formData?.get("__action") === "create_project";

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
    values: formDefaultValues,
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

  const handleRemoveCategory = (indexToRemove: number) => {
    if (categories.length <= 1) {
      toast({
        title: "Cannot remove category",
        description: "There should be at least one category.",
      });
      return;
    }

    const categoryIdToRemove = categories[indexToRemove].categoryId;
    if (edit && categoryIdToRemove !== "") {
      fetcher.submit(
        { categoryId: categoryIdToRemove },
        {
          action: "/category/delete",
          method: "DELETE",
          encType: "application/json",
        },
      );
    } else {
      remove(indexToRemove);
    }
  };

  const onSubmit = (values: ProjectFormInputs) => {
    if (edit && project) {
      fetcher.submit(
        { projectId: project.id, values },
        {
          action: "/project/update/",
          method: "PUT",
          encType: "application/json",
        },
      );
    } else {
      submit(values, {
        action: "/project/create",
        method: "POST",
        encType: "application/json",
      });
    }
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { message } = fetcher.data;
      toast({ title: message });
    }
  }, [fetcher.state, fetcher.data, toast]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{edit ? "Edit Project" : "Create Project"}</CardTitle>
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
                    <Input placeholder="The name of the project." {...field} />
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
                name="__action"
                value="create_project"
                disabled={!form.formState.isDirty || isSubmitting}
              >
                {edit ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
