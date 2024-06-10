import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, CommentFormInputs } from "~/lib/post/comment/constants";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export default function CommentForm({
  postId,
  replyToId,
  className,
}: {
  postId: string;
  replyToId?: string;
  className?: string;
}) {
  const fetcher = useFetcher<{ success: boolean; message: string }>();
  const { toast } = useToast();
  const formDefaultValues = {
    postId,
    replyToId,
    text: "",
  };
  const form = useForm<CommentFormInputs>({
    resolver: zodResolver(formSchema),
    values: formDefaultValues,
  });

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { message } = fetcher.data;
      toast({ title: message });
    }
  }, [fetcher.state, fetcher.data, toast]);

  return (
    <FormProvider {...form}>
      <fetcher.Form
        action="/comment/create/"
        method="POST"
        className={cn("flex gap-x-3", className)}
      >
        <FormField
          control={form.control}
          name="postId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} type="hidden" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {replyToId && (
          <FormField
            control={form.control}
            name="replyToId"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  maxLength={140}
                  placeholder="Have something to say?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isDirty}>
          <PaperPlaneIcon height={28} />
        </Button>
      </fetcher.Form>
    </FormProvider>
  );
}
