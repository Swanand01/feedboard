"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import ActionDialog from "@/components/ui/action-dialog";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/board/actions";

export default function DeleteBoardDialog({
    categoryId,
    projectSlug,
}: {
    categoryId: string;
    projectSlug: string;
}) {
    const { toast } = useToast();
    const router = useRouter();

    async function removeProject() {
        const { success, message } = await deleteCategory(categoryId);
        if (success) {
            router.replace(`/project/${projectSlug}/`);
        } else {
            toast({ title: message });
        }
    }

    return (
        <ActionDialog
            trigger={<Button variant={"destructive"}>Delete Board</Button>}
            title="Are you absolutely sure?"
            description="This will delete the board, along with its posts."
            onClickContinue={removeProject}
        />
    );
}
