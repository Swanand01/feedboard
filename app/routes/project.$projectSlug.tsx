import { Link, useLoaderData } from "@remix-run/react";
import { getProject } from "~/lib/project/data";
import { ArrowLeftIcon, GearIcon } from "@radix-ui/react-icons";
import Boards from "~/components/project/boards";
import { isProjectOwner, isSuperuser } from "~/lib/permissions.server";
import { authenticator } from "~/services/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import Roadmaps from "~/components/project/roadmaps";

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

export default function Page() {
  const { title, description, slug, hasEditPermissions, categories } =
    useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <ArrowLeftIcon width={28} height={28} />
          </Link>
          <h3 className="text-2xl">{title}</h3>
          {hasEditPermissions && (
            <Link to={`/project/${slug}/settings/`}>
              <GearIcon width={24} height={24} />
            </Link>
          )}
        </div>
        <p>{description}</p>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-xl">Boards</h3>
        <Boards categories={categories} />
      </div>
      <div className="flex flex-col gap-4">
        <Roadmaps categories={categories} />
      </div>
    </div>
  );
}
