import { Link } from "@remix-run/react";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { UpvotePostButton } from "./upvote-post-button";

export interface Post {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  slug: string;
  hasUpvoted: boolean;
  status: {
    title: string;
    colour: string;
  };
}

interface PostCardProps {
  post: Post;
  clampContent?: boolean;
  baseLink?: string;
  showStatus?: boolean;
  linkInTitle?: boolean;
}

export function PostCard({
  post,
  clampContent,
  baseLink,
  showStatus,
  linkInTitle = true,
}: PostCardProps) {
  return (
    <Card key={post.id} className="flex w-full items-center">
      <UpvotePostButton
        postId={post.id}
        upvotes={post.upvotes || 0}
        hasUpvoted={post.hasUpvoted}
      />
      <div>
        <CardHeader className="p-4">
          <div className="flex flex-col gap-4">
            {linkInTitle ? (
              <Link
                to={`${baseLink}/${post.slug}`}
                className="flex items-center"
              >
                <CardTitle className="line-clamp-1 font-semibold hover:opacity-70">
                  {post.title}
                </CardTitle>
              </Link>
            ) : (
              <CardTitle className="line-clamp-1 font-semibold">
                {post.title}
              </CardTitle>
            )}

            {showStatus && (
              <Badge
                variant="outline"
                className="w-fit text-sm"
                style={{
                  color: `${post.status.colour}`,
                  borderColor: `${post.status.colour}`,
                }}
              >
                {post.status.title}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {clampContent ? (
            <p className="line-clamp-1 text-sm">{post.content}</p>
          ) : (
            <p>{post.content}</p>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

export default PostCard;