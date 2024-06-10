import { Post, PostCard } from "./post-card";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";

export interface Status {
  id: string;
  colour: string;
  title: string;
  posts: Post[];
}

export default function PostsByStatus({
  status,
  baseLink,
}: {
  status: Status;
  baseLink: string;
}) {
  return (
    <div className="flex max-h-96 w-full flex-col items-center gap-4 lg:w-[31%]">
      <Badge
        variant="outline"
        className="text-md px-3 py-1"
        style={{
          color: `${status.colour}`,
          borderColor: `${status.colour}`,
        }}
      >
        {status.title}
      </Badge>
      <ScrollArea className="max-h-96 w-full">
        <div className="flex w-full flex-col gap-4">
          {status.posts.map((post) => {
            return (
              <PostCard
                key={post.id}
                post={post}
                baseLink={baseLink}
                lineClampClass="line-clamp-1"
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
