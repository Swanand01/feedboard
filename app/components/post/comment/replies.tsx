import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import PostComment from "./comment";
import { Comment } from "~/lib/types";

export default function Replies({
  commentId,
  postId,
  hasCommentPermissions,
}: {
  commentId: string;
  postId: string;
  hasCommentPermissions: boolean;
}) {
  const fetcher = useFetcher<Comment[]>();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(`/replies?postId=${postId}&replyToId=${commentId}`);
    }
  }, [fetcher, commentId, postId]);

  if (fetcher.data) {
    return fetcher.data.map((reply) => (
      <PostComment
        key={reply.id}
        postId={postId}
        comment={{
          id: reply.id,
          content: reply.text,
          createdAt: reply.createdAt,
          creator: reply.creator?.username || "",
          replyCount: reply._count?.replies || 0,
          replyToId: reply.replyToId,
        }}
        hasCommentPermissions={hasCommentPermissions}
        className="md:ml-10"
      />
    ));
  }
  return <></>;
}
