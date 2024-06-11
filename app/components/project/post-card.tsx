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
import { cn, getReadableTime } from "~/lib/utils";
import PostActions from "../post/post-actions";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

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
  lineClampClass?: string;
  showStatus?: boolean;
  baseLink?: string;
  linkInTitle?: boolean;
  showActions?: boolean;
}

export function PostCard({
  post,
  lineClampClass,
  showStatus,
  baseLink,
  linkInTitle = true,
  showActions = false,
}: PostCardProps) {
  const editor = useEditor({
    editable: false,
    editorProps: {
      attributes: {
        class: `${lineClampClass}  [&_p]:mb-0 [&_p]:mt-0`,
      },
    },
    content: post.content,
    extensions: [StarterKit],
  });

  return (
    <Card key={post.id} className="flex w-full items-center">
      <UpvotePostButton
        postId={post.id}
        upvotes={post.upvotes || 0}
        hasUpvoted={post.hasUpvoted}
      />
      <div className="w-full relative">
        <CardHeader className="p-4">
          <div className="flex flex-col gap-2">
            {linkInTitle && baseLink ? (
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
        <CardContent className="p-4 pt-0 prose dark:prose-invert">
          <EditorContent editor={editor} />
        </CardContent>
        {showActions && (
          <div className="absolute top-4 right-4">
            <PostActions postId={post.id} />
          </div>
        )}
      </div>
    </Card>
  );
}

export default PostCard;
