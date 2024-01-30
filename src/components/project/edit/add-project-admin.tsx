"use client";

import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUsersLikeUsername } from "@/lib/users/data";
import { AddProjectAdminButton, RemoveProjectAdminButton } from "../buttons";
import { createProjectAdmin } from "@/lib/project/actions";

interface User {
    id: string;
    username: string;
}

export function AddProjectAdmin({ projectId }: { projectId: string }) {
    const { toast } = useToast();
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>({
        id: "",
        username: "",
    });

    const debouncedFetchData = useDebouncedCallback(async (input: string) => {
        const results = await getUsersLikeUsername(input);
        setUsers(results);
    }, 300);

    useEffect(() => {
        debouncedFetchData(username);
        return () => debouncedFetchData.cancel();
    }, [username, debouncedFetchData]);

    async function addProjectAdmin() {
        const { success, message } = await createProjectAdmin(
            selectedUser.id,
            projectId
        );

        if (success) {
            toast({
                title: "Project Admin added successfully.",
            });
            closeDialog();
            setSelectedUser({
                id: "",
                username: "",
            });
        } else {
            toast({
                title: message,
            });
        }
    }

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
                <div className="flex flex-col gap-8">
                    {selectedUser.id === "" && (
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                                className="col-span-3"
                            />
                        </div>
                    )}
                    {selectedUser.id === "" ? (
                        <div className="flex flex-col gap-4">
                            <Label>Results</Label>
                            {users.length === 0 ? (
                                <div className="text-sm">No users found.</div>
                            ) : (
                                <div>
                                    {users.map((user) => (
                                        <div
                                            className="rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                                            key={user.id}
                                            onClick={() => {
                                                setSelectedUser(user);
                                            }}
                                        >
                                            {user.username}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Label>Selected user</Label>
                            <div className="flex gap-4">
                                <div className="flex items-center w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                                    {selectedUser.username}
                                </div>
                                <RemoveProjectAdminButton
                                    onClick={() => {
                                        setSelectedUser({
                                            id: "",
                                            username: "",
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <AddProjectAdminButton
                        disabled={selectedUser.id === ""}
                        onClick={addProjectAdmin}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
