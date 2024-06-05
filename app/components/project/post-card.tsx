import { Link } from "@remix-run/react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { UpvotePostButton } from "./upvote-post-button";
import { getReadableTime } from "~/lib/utils";

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
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  clampContent?: boolean;
  showStatus?: boolean;
  linkInTitle?: boolean;
}

export function PostCard({
  post,
  clampContent,
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
          <div className="flex flex-col gap-2">
            {linkInTitle ? (
              <Link to={post.slug} className="flex items-center">
                <CardTitle className="line-clamp-1 font-semibold hover:opacity-70">
                  {post.title}
                </CardTitle>
              </Link>
            ) : (
              <CardTitle className="line-clamp-1 font-semibold">
                {post.title}
              </CardTitle>
            )}
            <CardDescription>
              {getReadableTime(new Date(post.createdAt))}
            </CardDescription>
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
