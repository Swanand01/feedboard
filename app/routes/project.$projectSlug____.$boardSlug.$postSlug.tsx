// import Comments from "@/components/post/comment/comments";
import { PostCard } from "~/components/project/post-card";
import { getPost } from "~/lib/post/data";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
// import PostActions from "~/components/post/post-actions";
import {
  isProjectAdmin,
  isProjectOwner,
  isSuperuser,
} from "~/lib/permissions.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { Link, useLoaderData } from "@remix-run/react";
import Comments from "~/components/post/comment/comments";
import { getComments } from "~/lib/post/comment/data";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { postSlug } = params;

  const user = await authenticator.isAuthenticated(request);
  const post = await getPost(postSlug as string);

  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const mappedPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    upvotes: post._count.upvotes,
    slug: String(post.slug),
    hasUpvoted: user
      ? post.upvotes.some((obj) => obj.userId === user.id)
      : false,
    status: {
      title: post.status.title,
      colour: post.status.colour,
    },
    createdAt: post.createdAt.toString(),
  };

  const comments = await getComments(post.id);
  const mappedComments = comments.map((comment) => {
    return {
      id: comment.id,
      creator: comment.creator.username,
      createdAt: comment.createdAt,
      content: comment.text,
      replyCount: comment._count.replies || 0,
      replyToId: comment.replyToId,
    };
  });

  const hasPostPermissions =
    user &&
    ((await isSuperuser(user)) ||
      (await isProjectOwner(user, post.status.category.projectId)) ||
      (await isProjectAdmin(user, post.status.category.projectId)) ||
      post.userId === user.id);

  return {
    post: mappedPost,
    comments: mappedComments,
    hasPostPermissions: Boolean(hasPostPermissions),
  };
}

export default function Page() {
  const { post, comments, hasPostPermissions } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Link to="..">
            <ArrowLeftIcon width={28} height={28} />
          </Link>
          <h3 className="text-2xl">View Post</h3>
        </div>
        {/* {hasPostPermissions && (
          <PostActions postId={post.id} postUrl={postUrl} boardUrl={boardUrl} />
        )} */}
      </div>
      <div className="flex flex-wrap gap-8">
        <PostCard post={post} linkInTitle={false} showStatus />
        <Comments
          comments={comments}
          postId={post.id}
          hasCommentPermissions={hasPostPermissions}
        />
      </div>
    </div>
  );
}
