import { Status } from "@prisma/client";
import PostCard from "./post-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPostsByStatus } from "@/lib/post/data";

async function PostsByStatus({
    status,
    baseLink,
}: {
    status: Status;
    baseLink: string;
}) {
    const posts = await getPostsByStatus(status.id);

    return (
        <div className="flex max-h-96 w-full flex-col items-center gap-4 lg:w-[32%]">
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
                    {posts.map((post) => {
                        return (
                            <PostCard
                                key={post.id}
                                post={post}
                                baseLink={baseLink}
                                clampContent
                            />
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}

export default PostsByStatus;
