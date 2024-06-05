import { Post, PostCard } from "../project/post-card";
import PaginationWrapper from "../ui/pagination-wrapper";
import { POSTS_PER_PAGE } from "~/lib/post/constants";

interface PostsProps {
  posts: Post[];
  postsCount: number;
}

export default function Posts({ posts, postsCount }: PostsProps) {
  return (
    <div className="flex flex-col gap-4">
      {posts.length === 0 ? (
        <div className="text-sm">No posts found.</div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} showStatus />)
      )}
      <PaginationWrapper totalCount={postsCount} pageSize={POSTS_PER_PAGE} />
    </div>
  );
}
