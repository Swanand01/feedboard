import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { getFilteredPosts } from "~/lib/post/data";
import { getCategory } from "~/lib/board/data";
import {
  isProjectAdmin,
  isProjectOwner,
  isSuperuser,
} from "~/lib/permissions.server";
import { BreadcrumbItem, BreadcrumbLink } from "~/components/ui/breadcrumb";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { GearIcon } from "@radix-ui/react-icons";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { projectSlug, boardSlug } = params;
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "all";
  const category = await getCategory(String(boardSlug));
  const user = await authenticator.isAuthenticated(request);

  if (!category) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { posts: filteredPosts, postsCount } = await getFilteredPosts(
    category.id,
    status,
    query,
    currentPage,
  );
  const posts = filteredPosts.map((post) => {
    return {
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
  });

  const userIsSuperuser = user && (await isSuperuser(user));
  const userIsProjectOwner =
    user && (await isProjectOwner(user, category.projectId));
  const userIsProjectAdmin =
    user && (await isProjectAdmin(user, category.projectId));

  const hasEditPermissions =
    userIsSuperuser || userIsProjectOwner || userIsProjectAdmin;

  return {
    category: {
      id: category.id,
      title: category.title,
      slug: category.slug,
      statuses: category.statuses,
    },
    posts,
    postsCount,
    status,
    boardBaseLink: `/project/${projectSlug}/${boardSlug}`,
    hasEditPermissions,
  };
}

export type categoryLoader = Awaited<ReturnType<typeof loader>>;

export default function Page() {
  const data = useLoaderData();
  return <Outlet context={data} />;
}

export const handle = {
  breadcrumb: ({ data, pathname }) => (
    <BreadcrumbItem>
      <BreadcrumbLink href={pathname}>{data.category.title}</BreadcrumbLink>
      {data.hasEditPermissions && (
        <Link to={`${pathname}/settings`}>
          <GearIcon width={24} height={24} />
        </Link>
      )}
    </BreadcrumbItem>
  ),
};
