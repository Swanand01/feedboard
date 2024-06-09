import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useEffect, useState } from "react";
import { PostFormInputs, formSchema } from "~/lib/post/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { useFetcher } from "@remix-run/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import Editor from "../ui/editor/editor";

interface Status {
  statusId: string;
  title: string;
}

interface PostFormProps {
  categoryId?: string;
  edit?: boolean;
  post?: {
    id: string;
    title: string;
    content: string;
    status: Status;
  };
  statuses?: Status[];
  hasStatusChangePermissions?: boolean;
  className?: string;
  boardUrl: string;
}

export default function PostForm({
  categoryId,
  edit = false,
  post,
  statuses,
  hasStatusChangePermissions = false,
  className,
  boardUrl,
}: PostFormProps) {
  const { toast } = useToast();
  const fetcher = useFetcher<{ success: boolean; message: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formDefaultValues = {
    title: edit && post?.title ? post.title : "",
    content: edit && post?.content ? post.content : "",
    status: edit && post?.status ? post.status.statusId : "",
  };
  const form = useForm<PostFormInputs>({
    resolver: zodResolver(formSchema),
    values: formDefaultValues,
  });

  const onSubmit = async (values: PostFormInputs) => {
    if (edit && post) {
      fetcher.submit(
        { postId: post.id, values },
        {
          action: "/post/update",
          encType: "application/json",
          method: "PUT",
        },
      );
    } else {
      if (!categoryId) return;
      fetcher.submit(
        { categoryId, values, boardUrl },
        {
          action: "/post/create",
          encType: "application/json",
          method: "POST",
        },
      );
    }
  };

  useEffect(() => {
    setIsSubmitting(fetcher.state === "submitting");
    if (fetcher.state === "idle" && fetcher.data) {
      const { message } = fetcher.data;
      toast({ title: message });
    }
  }, [fetcher.state, fetcher.data, toast]);

  return (
    <Card className={cn("h-fit w-full", !edit && "lg:max-w-96", className)}>
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <fetcher.Form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 prose"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The title of the post." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Editor
                      placeholder="Tell us a little bit about this post."
                      content={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {hasStatusChangePermissions && statuses && (
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
                      value={field.value}
                      name="statusId"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a Status" />
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
            )}
            <div className="flex justify-between">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isSubmitting}
              >
                {edit ? "Save Post" : "Create Post"}
              </Button>
            </div>
          </fetcher.Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
