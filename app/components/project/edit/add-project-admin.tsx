import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useFetcher } from "@remix-run/react";
import { MinusCircledIcon } from "@radix-ui/react-icons";

interface User {
  id: string;
  username: string;
}

export function AddProjectAdmin({ projectId }: { projectId: string }) {
  const fetcher = useFetcher();
  const users = useFetcher<{ results: User[] }>();
  const [selectedUser, setSelectedUser] = useState<User>({
    id: "",
    username: "",
  });

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { success, message } = fetcher.data;
      closeDialog();
    }
  }, [fetcher.state, fetcher.data]);

  function closeDialog() {
    document.getElementById("closeDialog")?.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Project Admin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project Admin</DialogTitle>
          <DialogDescription>
            Search for users to add as Project Admins.
          </DialogDescription>
        </DialogHeader>
        <users.Form
          method="get"
          action="/users"
          className="flex flex-col gap-4 prose"
        >
          {selectedUser.id === "" && (
            <>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                onChange={(event) => {
                  if (event.target.value) users.submit(event.target.form);
                }}
                className="col-span-3"
              />
            </>
          )}
          {selectedUser.id === "" ? (
            <div className="flex flex-col gap-4">
              {users.data &&
                users.data.results.length > 0 &&
                users.data.results.map((user: User) => (
                  <Button
                    variant={"secondary"}
                    className="rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                  >
                    {user.username}
                  </Button>
                ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Label>Selected user</Label>
              <div className="flex gap-4">
                <div className="flex items-center w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                  {selectedUser.username}
                </div>
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => {
                    setSelectedUser({
                      id: "",
                      username: "",
                    });
                    users.data = { results: [] };
                  }}
                >
                  <MinusCircledIcon width={16} height={16} />
                </Button>
              </div>
            </div>
          )}
        </users.Form>
        <DialogFooter>
          <fetcher.Form
            action="/project/admins/add"
            method="POST"
            className="prose"
          >
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="userId" value={selectedUser.id} />
            <Button type="submit" disabled={selectedUser.id === ""}>
              Add Project Admin
            </Button>
          </fetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
