import { useToast } from "~/components/ui/use-toast";
import ActionDialog from "~/components/ui/action-dialog";
import { Button } from "~/components/ui/button";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export default function DeleteBoardDialog({
  categoryId,
}: {
  categoryId: string;
}) {
  const { toast } = useToast();
  const fetcher = useFetcher<{ success: boolean; message: string }>();

  function removeBoard() {
    fetcher.submit(
      { categoryId },
      {
        action: "/category/delete/",
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
    <ActionDialog
      trigger={<Button variant={"destructive"}>Delete Board</Button>}
      title="Are you absolutely sure?"
      description="This will delete the board, along with its posts."
      onClickContinue={removeBoard}
    />
  );
}
