import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { DotsVerticalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import DeletePostDialog from "./delete-post-dialog";
import { Link } from "@remix-run/react";

export default function PostActions({ postId }: { postId: string }) {
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
            <Link to={"edit"} className="flex items-center gap-4 flex-1">
              <Pencil1Icon height={28} />
              <p>Edit Post</p>
            </Link>
          </DropdownMenuItem>
          <DeletePostDialog postId={postId} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
