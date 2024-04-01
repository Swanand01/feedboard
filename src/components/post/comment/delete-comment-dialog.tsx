"use client";

import { useToast } from "@/components/ui/use-toast";
import ActionDialog from "@/components/ui/action-dialog";
import { TrashIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteComment } from "@/lib/post/comment/actions";

export default function DeleteCommentDialog({
    commentId,
}: {
    commentId: string;
}) {
    const { toast } = useToast();

    async function removePost() {
        const res = await deleteComment(commentId);

        if (!res) return;
        if (res.success) {
            toast({ title: "The comment was deleted." });
        } else {
            toast({ title: res.message });
        }
    }

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
                onClickContinue={removePost}
            />
        </DropdownMenuItem>
    );
}
