import { useState } from "react";
import { getReadableTime } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Replies from "./replies";
import { Button } from "~/components/ui/button";
import ReplyForm from "./form";
import CommentActions from "./comment-actions";

export type Comment = {
  id: string;
  creator: string;
  createdAt: string;
  content: string;
  replyCount: number;
  replyToId: string | null;
};

export default function Comment({
  postId,
  comment,
  className,
  hasCommentPermissions,
}: {
  postId: string;
  comment: Comment;
  className?: string;
  hasCommentPermissions: boolean;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const replyCount = comment.replyCount;

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  return (
    <div className={className}>
      <Card className="mt-3">
        <CardHeader className="p-4 pb-3">
          <div className="flex justify-between">
            <div className="space-y-2">
              <CardTitle>{comment.creator}</CardTitle>
              <CardDescription>
                {getReadableTime(new Date(comment.createdAt))}
              </CardDescription>
            </div>
            {hasCommentPermissions && <CommentActions commentId={comment.id} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0 prose dark:prose-invert">
          <p>{comment.content}</p>
          <div className="flex gap-3">
            <Button variant={"secondary"} onClick={toggleReplyForm}>
              Reply
            </Button>
            {replyCount !== 0 && (
              <Button variant={"secondary"} onClick={toggleReplies}>
                {showReplies ? "Hide Replies" : `Show ${replyCount} Replies`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {showReplyForm && (
        <ReplyForm postId={postId} replyToId={comment.id} className="mt-3" />
      )}
      {showReplies && (
        <Replies
          commentId={comment.id}
          postId={postId}
          hasCommentPermissions={hasCommentPermissions}
        />
      )}
    </div>
  );
}
