import { Status } from "@prisma/client";
import PostCard from "./post-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPostsByStatus } from "@/lib/post/data";

async function PostsByStatus({ status }: { status: Status }) {
    const posts = await getPostsByStatus(status.id);

    return (
        <div className="flex flex-col gap-4 w-full md:w-96 items-center max-h-96 overflow-y-auto">
            <Badge
                variant="outline"
                className="px-3 py-1 text-md"
                style={{
                    color: `${status.colour}`,
                    borderColor: `${status.colour}`,
                }}
            >
                {status.title}
            </Badge>
            <ScrollArea className="max-h-96 w-full">
                <div className="flex flex-col gap-4 w-full">
                    {posts.map((post) => {
                        return (
                            <PostCard key={post.id} post={post} clampContent />
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}

export default PostsByStatus;
