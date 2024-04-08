"use client";

import { useState, useEffect } from "react";
import { getReplies } from "@/lib/post/comment/data";
import PostComment from "./comment";

export default function Replies({
    commentId,
    postId,
    hasPostPermissions,
}: {
    commentId: string;
    postId: string;
    hasPostPermissions: boolean;
}) {
    const [replies, setReplies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReplies = async () => {
            const fetchedReplies = await getReplies(commentId);
            setReplies(fetchedReplies);
            setLoading(false);
        };

        fetchReplies();
    }, [commentId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return replies.map((reply) => (
        <PostComment
            key={reply.id}
            postId={postId}
            comment={reply}
            hasPostPermissions={hasPostPermissions}
            className="md:ml-10"
        />
    ));
}
