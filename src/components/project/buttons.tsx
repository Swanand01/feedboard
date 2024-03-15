"use client";

import {
    CaretUpIcon,
    MinusCircledIcon,
    TriangleUpIcon,
} from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { votePost } from "@/lib/post/actions";
import { useForm } from "react-hook-form";
import { useState } from "react";

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

export function UpvotePostButton({
    postId,
    upvotes,
    hasUpvoted,
}: {
    postId: string;
    upvotes: number;
    hasUpvoted: boolean;
}) {
    const form = useForm();
    const { toast } = useToast();
    const [vote, setVote] = useState<{ isUpvoted: boolean; voteCount: number }>(
        {
            isUpvoted: hasUpvoted,
            voteCount: upvotes,
        },
    );

    const handleUpvote = async () => {
        setVote((vote) => {
            if (vote.isUpvoted) {
                return {
                    isUpvoted: !vote.isUpvoted,
                    voteCount: vote.voteCount - 1,
                };
            }
            return {
                isUpvoted: !vote.isUpvoted,
                voteCount: vote.voteCount + 1,
            };
        });
        const res = await votePost(postId);
        if (res?.success === false) {
            toast({ title: res.message });
        }
    };

    return (
        <form
            className={
                "bg-tertiary ml-4 flex h-full flex-none flex-col items-center justify-center rounded-l-md"
            }
        >
            {vote.isUpvoted ? (
                <TriangleUpIcon
                    width={28}
                    height={28}
                    onClick={form.handleSubmit(handleUpvote)}
                />
            ) : (
                <CaretUpIcon
                    width={28}
                    height={28}
                    onClick={form.handleSubmit(handleUpvote)}
                />
            )}
            <p>{vote.voteCount.toString()}</p>
        </form>
    );
}
