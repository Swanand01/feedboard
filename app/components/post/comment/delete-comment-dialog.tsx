import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { useToast } from "~/components/ui/use-toast";
import { TrashIcon } from "@radix-ui/react-icons";
import ActionDialog from "~/components/ui/action-dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

export default function DeleteCommentDialog({
  commentId,
}: {
  commentId: string;
}) {
  const { toast } = useToast();
  const fetcher = useFetcher<{ success: boolean; message: string }>();

  function removeComment() {
    fetcher.submit(
      { commentId },
      {
        action: "/comment/delete/",
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
            <p>Delete Comment</p>
          </div>
        }
        title="Are you absolutely sure?"
        description="This will delete the comment."
        onClickContinue={removeComment}
      />
    </DropdownMenuItem>
  );
}
