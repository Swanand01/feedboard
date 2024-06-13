import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getProject } from "~/lib/project/data";
import { isProjectOwner, isSuperuser } from "~/lib/permissions.server";
import { authenticator } from "~/services/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { BreadcrumbItem, BreadcrumbLink } from "~/components/ui/breadcrumb";
import { GearIcon } from "@radix-ui/react-icons";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { projectSlug } = params;
  if (!projectSlug) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const project = await getProject(projectSlug);
  if (!project) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const user = await authenticator.isAuthenticated(request);
  const userIsSuperuser = user && (await isSuperuser(user));
  const userIsProjectOwner = user && (await isProjectOwner(user, project.id));
  const hasEditPermissions = user && (userIsSuperuser || userIsProjectOwner);

  const { title, description, slug, categories: projectCategories } = project;

  const categories = projectCategories.map((category) => {
    const optimizedCategory = {
      ...category,
      slug: String(category.slug),
      statuses: category.statuses.map((status) => {
        const posts = status.posts.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          upvotes: post._count.upvotes,
          slug: String(post.slug),
          hasUpvoted: user
            ? post.upvotes.some((obj) => obj.userId === user.id)
            : false,
          creator: post.creator.username,
          createdAt: post.createdAt.toString(),
          status: {
            title: status.title,
            colour: status.colour,
          },
        }));

        return {
          ...status,
          posts,
        };
      }),
    };

    return optimizedCategory;
  });

  return {
    title,
    description,
    slug: String(slug),
    hasEditPermissions,
    categories,
  };
}

export type projectLoader = Awaited<ReturnType<typeof loader>>;

export default function Page() {
  const data = useLoaderData();
  return <Outlet context={data} />;
}

export const handle = {
  breadcrumb: ({ data, pathname }) => (
    <BreadcrumbItem>
      <BreadcrumbLink href={pathname}>{data.title}</BreadcrumbLink>
      {data.hasEditPermissions && (
        <Link to={`${pathname}/settings/`}>
          <GearIcon width={24} height={24} />
        </Link>
      )}
    </BreadcrumbItem>
  ),
};
