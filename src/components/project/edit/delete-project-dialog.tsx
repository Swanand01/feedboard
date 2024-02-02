"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { deleteProject } from "@/lib/project/actions";
import ActionDialog from "@/components/ui/action-dialog";
import { Button } from "@/components/ui/button";

export default function DeleteProjectDialog({
    projectId,
}: {
    projectId: string;
}) {
    const { toast } = useToast();
    const router = useRouter();

    async function removeProject() {
        const { success, message } = await deleteProject(projectId);
        if (success) {
            router.replace("/home");
        } else {
            toast({ title: message });
        }
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
