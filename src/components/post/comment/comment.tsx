"use client";

import { useState } from "react";
import { getReadableTime } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Replies from "./replies";
import { Button } from "@/components/ui/button";

export default function Comment({
    commentId,
    username,
    createdAt,
    text,
    className,
    replyCount,
}: {
    commentId: string;
    username: string;
    createdAt: Date;
    text: string;
    className?: string;
    replyCount: number;
}) {
    const [showReplies, setShowReplies] = useState(false);

    const toggleReplies = () => {
        setShowReplies(!showReplies);
    };

    return (
        <div className={className}>
            <Card className="mt-3">
                <CardHeader className="p-4 pb-3">
                    <CardTitle>{username}</CardTitle>
                    <CardDescription>
                        {getReadableTime(createdAt)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-4 pt-0">
                    <p>{text}</p>
                    {replyCount !== 0 && (
                        <Button
                            variant={"secondary"}
                            onClick={toggleReplies}
                            className=""
                        >
                            {showReplies
                                ? "Hide Replies"
                                : `Show ${replyCount} Replies`}
                        </Button>
                    )}
                </CardContent>
            </Card>
            {showReplies && <Replies commentId={commentId} />}
        </div>
    );
}
