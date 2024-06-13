import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { UpvotePostButton } from "../../project/upvote-post-button";
import { getReadableTime } from "~/lib/utils";
import { Badge } from "../badge";
import PostActions from "~/components/post/post-actions";

export interface Post {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  slug: string;
  hasUpvoted: boolean;
  creator: string;
  status: {
    title: string;
    colour: string;
  };
  createdAt: string;
}

interface FullPostCardProps {
  post: Post;
  showActions: boolean;
}

export default function FullPostCard({
  post,
  showActions = false,
}: FullPostCardProps) {
  const editor = useEditor({
    editable: false,
    editorProps: {
      attributes: {
        class: "[&_p]:mb-0 [&_p]:mt-0",
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
            <div className="prose dark:prose-invert">
              <CardTitle className="line-clamp-2 font-semibold">
                {post.title}
              </CardTitle>
            </div>
            {post.creator}
            <CardDescription>
              {getReadableTime(new Date(post.createdAt))}
            </CardDescription>
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
