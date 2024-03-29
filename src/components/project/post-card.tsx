import Link from "next/link";
import { Post } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { UpvotePostButton } from "./buttons";
import { getUserSession } from "@/auth";

async function PostCard({
    post,
    clampContent,
    baseLink,
    showStatus,
    linkInTitle = true,
}: {
    post: Post;
    clampContent?: boolean;
    baseLink?: string;
    showStatus?: boolean;
    linkInTitle?: boolean;
}) {
    let hasUpvoted = false;
    const session = await getUserSession();

    if (
        session?.user &&
        post.upvotes?.map((obj) => obj.userId).includes(session.user.id)
    ) {
        hasUpvoted = true;
    }

    return (
        <Card key={post.id} className="flex w-full items-center">
            <UpvotePostButton
                postId={post.id}
                upvotes={post._count?.upvotes || 0}
                hasUpvoted={hasUpvoted}
            />
            <div>
                <CardHeader className="p-4">
                    <div className="flex flex-col gap-4">
                        {linkInTitle ? (
                            <Link
                                href={`${baseLink}/${post.slug}`}
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
