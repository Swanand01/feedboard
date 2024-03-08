import Link from "next/link";
import { Post } from "@/lib/types";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "../ui/badge";

function PostCard({
    post,
    clampContent,
    showStatus,
}: {
    post: Post;
    clampContent?: boolean;
    showStatus?: boolean;
}) {
    return (
        <Card key={post.id}>
            <Link href={""} className="flex items-center">
                <div
                    className={
                        "flex flex-col flex-none justify-center rounded-l-md items-center bg-tertiary h-full ml-4"
                    }
                >
                    <CaretUpIcon width={28} height={28} />
                    <p>{post._count?.upvotes || 0}</p>
                </div>
                <div>
                    <CardHeader className="p-4">
                        <div className="flex flex-col gap-4">
                            <CardTitle className="hover:opacity-70 line-clamp-1 font-semibold">
                                {post.title}
                            </CardTitle>
                            {showStatus && (
                                <Badge
                                    variant="outline"
                                    className="text-sm w-fit"
                                    style={{
                                        color: `${post?.status?.colour}`,
                                        borderColor: `${post?.status?.colour}`,
                                    }}
                                >
                                    {post?.status?.title}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        {clampContent ? (
                            <p className="line-clamp-1 text-sm">
                                {post.content}
                            </p>
                        ) : (
                            <p>{post.content}</p>
                        )}
                    </CardContent>
                </div>
            </Link>
        </Card>
    );
}

export default PostCard;
