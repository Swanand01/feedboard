import PostComment, { Comment } from "./comment";
import CommentForm from "./form";

interface CommentsProps {
  comments: Comment[];
  postId: string;
  hasCommentPermissions: boolean;
}

export default function Comments({
  comments,
  postId,
  hasCommentPermissions,
}: CommentsProps) {
  return (
    <div className="mt-4 flex w-full flex-col gap-y-4">
      <h3 className="text-lg">Comments</h3>
      <CommentForm postId={postId} />
      <div className="flex flex-col gap-y-3">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((comment) => (
            <PostComment
              key={comment.id}
              postId={postId}
              comment={comment}
              hasCommentPermissions={hasCommentPermissions}
            />
          ))}
      </div>
    </div>
  );
}
