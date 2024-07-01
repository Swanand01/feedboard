import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import EditPostForm from "~/components/post/form";
import { getPost } from "~/lib/post/data";
import { authenticator } from "~/services/auth.server";
import {
  isProjectAdmin,
  isProjectOwner,
  isSuperuser,
} from "~/lib/permissions.server";
import { BreadcrumbItem, BreadcrumbLink } from "~/components/ui/breadcrumb";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const { projectSlug, boardSlug, postSlug } = params;

  const post = await getPost(postSlug as string);
  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const userIsSuperuser = await isSuperuser(user);
  const userIsProjectOwner = await isProjectOwner(
    user,
    post.category.projectId,
  );
  const userIsProjectAdmin = await isProjectAdmin(
    user,
    post.category.projectId,
  );
  const userIsPostAuthor = post.userId === user.id;

  const hasStatusChangePermissions =
    userIsSuperuser || userIsProjectOwner || userIsProjectAdmin;

  const hasPagePermissions = hasStatusChangePermissions || userIsPostAuthor;

  if (!hasPagePermissions) {
    throw new Response(null, {
      status: 403,
      statusText: "Unauthorised",
    });
  }

  const statuses = post.category.statuses.map((status) => {
    return { ...status, statusId: status.id };
  });

  const mappedPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    slug: post.slug,
    status: {
      statusId: post.status.id,
      title: post.status.title,
    },
  };
  return {
    post: mappedPost,
    statuses,
    hasStatusChangePermissions,
    boardUrl: `/project/${projectSlug}/${boardSlug}`,
  };
}

export default function Page() {
  const { post, statuses, boardUrl, hasStatusChangePermissions } =
    useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-8 mt-8">
      <EditPostForm
        edit={true}
        post={post}
        statuses={statuses}
        boardUrl={boardUrl}
        hasStatusChangePermissions={hasStatusChangePermissions}
        className="flex-1"
      />
    </div>
  );
}

export const handle = {
  breadcrumb: ({ pathname }) => (
    <BreadcrumbItem>
      <BreadcrumbLink href={pathname}>Edit</BreadcrumbLink>
    </BreadcrumbItem>
  ),
};
