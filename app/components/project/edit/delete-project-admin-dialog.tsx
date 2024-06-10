import { useFetcher } from "@remix-run/react";
import ActionDialog from "~/components/ui/action-dialog";
import { Button } from "~/components/ui/button";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

export default function DeleteProjectAdminDialog({
  projectAdminId,
}: {
  projectAdminId: string;
}) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { success, message } = fetcher.data;
    }
  }, [fetcher.state, fetcher.data]);

  function removeProjectAdmin() {
    fetcher.submit(
      { projectAdminId },
      {
        action: "/project/admins/remove",
        method: "DELETE",
        encType: "application/json",
      },
    );
  }

  return (
    <ActionDialog
      trigger={
        <Button type="button" variant={"destructive"}>
          <MinusCircledIcon width={16} height={16} />
        </Button>
      }
      title={"Are you absolutely sure?"}
      description={"This will remove the user from the Project Admins."}
      onClickContinue={removeProjectAdmin}
    />
  );
}
