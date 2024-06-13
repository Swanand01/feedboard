import { useOutletContext } from "@remix-run/react";
import { postLoader } from "./project.$projectSlug.$boardSlug.$postSlug";
import Comments from "~/components/post/comment/comments";
import FullPostCard from "~/components/ui/post-cards/full-post-card";

export default function Page() {
  const { post, comments, hasPostPermissions } = useOutletContext<postLoader>();
  return (
    <div className="flex flex-col gap-8 mt-8">
      <div className="flex flex-wrap gap-8">
        <FullPostCard post={post} showActions={hasPostPermissions} />
        <Comments
          comments={comments}
          postId={post.id}
          hasCommentPermissions={hasPostPermissions}
        />
      </div>
    </div>
  );
}
