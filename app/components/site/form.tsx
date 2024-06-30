import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFormSchema,
  updateFormSchema,
  CreateSiteFormInputs,
  UpdateSiteFormInputs,
} from "~/lib/site/constants";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form as FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface SiteOptions {
  title: string;
  logo: string;
}

interface SiteFormProps {
  edit?: boolean;
  siteOptions?: SiteOptions;
  className?: string;
}

export default function SiteForm({
  edit,
  siteOptions,
  className,
}: SiteFormProps) {
  const submit = useSubmit();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageURL, setSelectedImageURL] = useState<string | null>(null);

  const isSubmitting =
    useNavigation().formData?.get("__action") === "create_site";

  const formDefaultValues = {
    title: edit && siteOptions?.title ? siteOptions.title : "",
    logo: undefined,
  };

  const form = useForm<CreateSiteFormInputs | UpdateSiteFormInputs>({
    resolver: zodResolver(edit ? updateFormSchema : createFormSchema),
    values: formDefaultValues,
  });

  function onSubmit({ title }: CreateSiteFormInputs | UpdateSiteFormInputs) {
    const formData = new FormData();
    formData.append("title", title);
    if (selectedImage) {
      formData.append("file", selectedImage);
    }
    submit(formData, { method: "POST", encType: "multipart/form-data" });
  }

  useEffect(() => {
    if (!siteOptions?.logo) return;
    setSelectedImageURL(siteOptions.logo);
  }, [siteOptions]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="prose dark:prose-invert">
        <CardTitle>{edit ? "Edit Site" : "Create Site"}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <Form
            className="space-y-4 prose dark:prose-invert"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The name of the site." {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be shown in the header.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      name="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (!file) return;
                        field.onChange(file);
                        setSelectedImage(file);
                        setSelectedImageURL(URL.createObjectURL(file));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be shown beside the site title in the header.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedImageURL && (
              <div>
                <FormLabel>{edit ? "Current Logo" : "Preview"}</FormLabel>
                <img
                  src={selectedImageURL}
                  alt="Selected"
                  className="my-2 w-28 h-28 object-cover"
                />
              </div>
            )}

            <Button
              type="submit"
              name="__action"
              value="create_site"
              disabled={!form.formState.isDirty || isSubmitting}
            >
              {edit ? "Save Changes" : "Create Site"}
            </Button>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
