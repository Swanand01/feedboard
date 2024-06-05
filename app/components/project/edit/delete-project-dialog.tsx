import ActionDialog from "~/components/ui/action-dialog";
import { Button } from "~/components/ui/button";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useToast } from "~/components/ui/use-toast";

export default function DeleteProjectDialog({
  projectId,
}: {
  projectId: string;
}) {
  const { toast } = useToast();
  const fetcher = useFetcher<{ success: boolean; message: string }>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { message } = fetcher.data;
      toast({ title: message });
    }
  }, [fetcher.state, fetcher.data, toast]);

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
