import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { UpvotePostButton } from "../../project/upvote-post-button";
import { Post } from "./full-post-card";
import { getReadableTime } from "~/lib/utils";
import { Badge } from "../badge";

interface BoardPostCardProps {
  post: Post;
  baseLink: string;
}

export default function BoardPostCard({ post, baseLink }: BoardPostCardProps) {
  const editor = useEditor({
    editable: false,
    editorProps: {
      attributes: {
        class: "line-clamp-3 [&_p]:mb-0 [&_p]:mt-0",
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
      <div>
        <CardHeader className="p-4">
          <div className="flex flex-col gap-2">
            <Link
              to={`${baseLink}/${post.slug}`}
              className="flex items-center prose dark:prose-invert"
            >
              <CardTitle className="line-clamp-2 font-semibold hover:opacity-70">
                {post.title}
              </CardTitle>
            </Link>
            <p className="max-w-72 text-ellipsis whitespace-nowrap overflow-hidden">
              {post.creator}
            </p>
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
      </div>
    </Card>
  );
}
