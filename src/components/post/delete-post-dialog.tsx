"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import ActionDialog from "@/components/ui/action-dialog";
import { TrashIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { deletePost } from "@/lib/post/actions";

export default function DeletePostDialog({
    postId,
    boardUrl,
}: {
    postId: string;
    boardUrl: string;
}) {
    const router = useRouter();
    const { toast } = useToast();

    async function removePost() {
        const res = await deletePost(postId);

        if (!res) return;
        if (res.success) {
            router.replace(boardUrl);
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
