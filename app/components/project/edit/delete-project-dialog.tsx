import ActionDialog from "~/components/ui/action-dialog";
import { Button } from "~/components/ui/button";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export default function DeleteProjectDialog({
  projectId,
}: {
  projectId: string;
}) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { success, message } = fetcher.data;
    }
  }, [fetcher.state, fetcher.data]);

  function removeProject() {
    fetcher.submit(
      { projectId },
      {
        action: "/project/delete/",
        method: "DELETE",
        encType: "application/json",
      },
    );
  }
  return (
    <ActionDialog
      trigger={<Button variant={"destructive"}>Delete Project</Button>}
      title="Are you absolutely sure?"
      description="This will delete the entire project, along with its boards and posts."
      onClickContinue={removeProject}
    />
  );
}
