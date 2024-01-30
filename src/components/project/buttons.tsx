"use client";

import { MinusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

export function RemoveProjectAdminButton({ onClick }: { onClick?: Function }) {
    return (
        <Button
            type="button"
            variant={"destructive"}
            onClick={() => {
                onClick && onClick();
            }}
        >
            <MinusCircledIcon width={16} height={16} />
        </Button>
    );
}

export function AddProjectAdminButton({
    disabled = false,
    onClick,
}: {
    disabled?: boolean;
    onClick?: Function;
}) {
    return (
        <Button
            type="submit"
            disabled={disabled}
            onClick={() => {
                onClick && onClick();
            }}
        >
            Add Project Admin
        </Button>
    );
}
