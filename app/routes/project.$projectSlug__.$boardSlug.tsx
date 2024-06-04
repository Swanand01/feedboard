import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import Search from "~/components/ui/search";
import { ArrowLeftIcon, GearIcon } from "@radix-ui/react-icons";
import Posts from "~/components/board/posts";
import CreatePostForm from "~/components/post/form";
import FilterByStatus from "~/components/board/filter-by-status";
import { authenticator } from "~/services/auth.server";
import { getFilteredPosts } from "~/lib/post/data";
import { getCategory } from "~/lib/board/data";

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
    };
  });

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
  };
}

export default function Page() {
  const { category, posts, postsCount, status, boardBaseLink } =
    useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link to={"settings"}>
          <ArrowLeftIcon width={28} height={28} />
        </Link>
        <h3 className="text-2xl">{category.title}</h3>
        <Link to={"settings"}>
          <GearIcon width={24} height={24} />
        </Link>
      </div>
      <div className="flex flex-wrap gap-8">
        <div className="order-2 flex w-full flex-1 flex-col gap-8 lg:order-1">
          <div className="flex gap-4">
            <Search
              placeholder="Search by title..."
              className="w-2/3 lg:w-3/4"
            />
            <FilterByStatus
              statuses={category.statuses}
              selectedStatus={status}
              className="flex-1"
            />
          </div>
          <Posts
            posts={posts}
            postsCount={postsCount}
            baseLink={boardBaseLink}
          />
        </div>
        <CreatePostForm
          categoryId={category.id}
          className="order-1 lg:sticky lg:top-8"
          boardUrl={boardBaseLink}
        />
      </div>
    </div>
  );
}
