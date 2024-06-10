import { PostCard } from "~/components/project/post-card";
import { useOutletContext } from "@remix-run/react";
import Comments from "~/components/post/comment/comments";
import { postLoader } from "./project.$projectSlug.$boardSlug.$postSlug";

export default function Page() {
  const { post, comments, hasPostPermissions } = useOutletContext<postLoader>();
  return (
    <div className="flex flex-col gap-8 mt-8">
      <div className="flex flex-wrap gap-8">
        <PostCard post={post} linkInTitle={false} showStatus showActions />
        <Comments
          comments={comments}
          postId={post.id}
          hasCommentPermissions={hasPostPermissions}
        />
      </div>
    </div>
  );
}
