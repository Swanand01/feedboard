import { getComments } from "@/lib/post/comment/data";
import PostComment from "./comment";
import CommentForm from "./form";

export default async function Comments({ postId }: { postId: string }) {
    const comments = await getComments(postId);
    return (
        <div className="mt-4 flex w-full flex-col gap-y-4">
            <h3 className="text-xl">Comments</h3>
            <CommentForm postId={postId} />
            <div className="flex flex-col gap-y-3">
                {comments
                    .filter((comment) => !comment.replyToId)
                    .map((comment) => (
                        <PostComment
                            key={comment.id}
                            commentId={comment.id}
                            username={comment.creator?.username || "none"}
                            createdAt={comment.createdAt}
                            text={comment.text}
                            replyCount={comment._count.replies}
                        />
                    ))}
            </div>
        </div>
    );
}
