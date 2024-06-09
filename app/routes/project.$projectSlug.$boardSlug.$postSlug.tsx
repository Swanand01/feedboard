import { getPost } from "~/lib/post/data";
import {
  isProjectAdmin,
  isProjectOwner,
  isSuperuser,
} from "~/lib/permissions.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getComments } from "~/lib/post/comment/data";
import { BreadcrumbItem, BreadcrumbLink } from "~/components/ui/breadcrumb";

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
      createdAt: comment.createdAt.toString(),
      content: comment.text,
      replyCount: comment._count.replies || 0,
      replyToId: comment.replyToId,
    };
  });

  const hasPostPermissions =
    user &&
    ((await isSuperuser(user)) ||
      (await isProjectOwner(user, post.category.projectId)) ||
      (await isProjectAdmin(user, post.category.projectId)) ||
      post.userId === user.id);

  return {
    post: mappedPost,
    comments: mappedComments,
    hasPostPermissions: Boolean(hasPostPermissions),
  };
}

export type postLoader = Awaited<ReturnType<typeof loader>>;

export default function Page() {
  const data = useLoaderData();
  return <Outlet context={data} />;
}

export const handle = {
  breadcrumb: ({ pathname }) => (
    <BreadcrumbItem>
      <BreadcrumbLink href={pathname}>Post</BreadcrumbLink>
    </BreadcrumbItem>
  ),
};
