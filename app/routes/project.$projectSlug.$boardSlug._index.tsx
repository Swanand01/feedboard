import { useOutletContext } from "@remix-run/react";
import Search from "~/components/ui/search";
import Posts from "~/components/board/posts";
import CreatePostForm from "~/components/post/form";
import FilterByStatus from "~/components/board/filter-by-status";
import { categoryLoader } from "./project.$projectSlug.$boardSlug";

export default function Page() {
  const { category, posts, postsCount, status, boardBaseLink } =
    useOutletContext<categoryLoader>();
  return (
    <div className="flex flex-col flex-wrap gap-8 mt-8 lg:flex-row">
      <div className="order-2 flex w-full flex-1 flex-col gap-8 lg:order-1">
        <div className="flex gap-4 items-end">
          <Search placeholder="Search by title..." className="w-2/3 lg:w-3/4" />
          <FilterByStatus
            statuses={category.statuses}
            selectedStatus={status}
            className="flex-1"
          />
        </div>
        <Posts posts={posts} postsCount={postsCount} baseLink={boardBaseLink} />
      </div>
      <CreatePostForm
        categoryId={category.id}
        className="flex-1 order-1 lg:sticky lg:top-8"
        boardUrl={boardBaseLink}
      />
    </div>
  );
}
