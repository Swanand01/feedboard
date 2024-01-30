"use client";

import ActionDialog from "@/components/ui/action-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deleteProjectAdmin } from "@/lib/project/actions";
import { MinusCircledIcon } from "@radix-ui/react-icons";

export default function DeleteProjectAdminDialog({
    projectAdminId,
}: {
    projectAdminId: string;
}) {
    const { toast } = useToast();

    async function removeProjectAdmin() {
        const { success, message } = await deleteProjectAdmin(projectAdminId);
        if (success) {
            toast({
                title: "Project Admin removed successfully.",
            });
        } else {
            toast({
                title: message,
            });
        }
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
