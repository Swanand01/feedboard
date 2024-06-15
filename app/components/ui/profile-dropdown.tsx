import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import ActionDialog from "./action-dialog";
import { ExitIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import UserAvatar from "./user-avatar";

export function ProfileDropdown({ initials }: { initials: string }) {
  const submit = useSubmit();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <UserAvatar initials={initials} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ActionDialog
            trigger={
              <div className="flex cursor-pointer items-center gap-4">
                <ExitIcon height={28} />
                <p>Logout</p>
              </div>
            }
            title="Do you want to logout?"
            description="Logging out will end your session."
            onClickContinue={() => {
              submit(null, { action: "/logout", method: "POST" });
            }}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
