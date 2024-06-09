import { useToast } from "~/components/ui/use-toast";
import ActionDialog from "~/components/ui/action-dialog";
import { TrashIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export default function DeletePostDialog({ postId }: { postId: string }) {
  const { toast } = useToast();

  const fetcher = useFetcher<{ success: boolean; message: string }>();

  function removePost() {
    fetcher.submit(
      { postId },
      {
        action: "/post/delete/",
        method: "DELETE",
        encType: "application/json",
      },
    );
  }

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { message } = fetcher.data;
      toast({ title: message });
    }
  }, [fetcher.state, fetcher.data, toast]);

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <ActionDialog
        trigger={
          <div className="flex cursor-pointer items-center gap-4">
            <TrashIcon height={28} />
            <p>Delete Post</p>
          </div>
        }
        title="Are you absolutely sure?"
        description="This will delete the post, along with its votes and comments."
        onClickContinue={removePost}
      />
    </DropdownMenuItem>
  );
}
