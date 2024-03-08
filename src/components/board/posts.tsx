import { getFilteredPosts } from "@/lib/post/data";
import PostCard from "../project/post-card";
import PaginationWrapper from "../ui/pagination-wrapper";
import { POSTS_PER_PAGE } from "@/lib/post/constants";

export default async function Posts({
    categoryId,
    query,
    currentPage,
    status,
}: {
    categoryId: string;
    query: string;
    currentPage: number;
    status: string;
}) {
    const { posts, postsCount } = await getFilteredPosts(
        categoryId,
        status,
        query,
        currentPage
    );

    return (
        <div className="flex flex-col gap-4">
            {posts.length === 0 ? (
                <div className="text-sm">No posts found.</div>
            ) : (
                posts.map((post) => (
                    <PostCard key={post.id} post={post} showStatus />
                ))
            )}
            <PaginationWrapper
                totalCount={postsCount}
                pageSize={POSTS_PER_PAGE}
            />
        </div>
    );
}
