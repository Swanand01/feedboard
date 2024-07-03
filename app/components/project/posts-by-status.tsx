import { Post } from "../ui/post-cards/full-post-card";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import RoadmapPostCard from "../ui/post-cards/roadmap-post-card";

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
          {status.posts.length > 0 ? (
            status.posts.map((post) => {
              return (
                <RoadmapPostCard
                  key={post.id}
                  post={post}
                  baseLink={baseLink}
                />
              );
            })
          ) : (
            <p className="text-center">No posts yet.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
