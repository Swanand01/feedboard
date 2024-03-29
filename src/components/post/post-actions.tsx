import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import DeletePostDialog from "./delete-post-dialog";

export default function PostActions({
    postId,
    postUrl,
    boardUrl,
}: {
    postId: string;
    postUrl: string;
    boardUrl: string;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <DotsVerticalIcon height={28} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link href={`${postUrl}/edit`}>
                            <div className="flex items-center gap-4">
                                <Pencil1Icon height={28} />
                                <p>Edit Post</p>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                    <DeletePostDialog postId={postId} boardUrl={boardUrl} />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
