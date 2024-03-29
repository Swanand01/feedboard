import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "@/components/post/comment/comments";
import PostCard from "@/components/project/post-card";
import { getPost } from "@/lib/post/data";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import PostActions from "@/components/post/post-actions";

export default async function Page({
    params,
}: {
    params: { slug: string; boardSlug: string; postSlug: string };
}) {
    const { slug: projectSlug, boardSlug, postSlug } = params;
    const post = await getPost(postSlug);

    if (!post) {
        notFound();
    }

    const boardUrl = `/project/${projectSlug}/${boardSlug}/`;
    const postUrl = `/project/${projectSlug}/${boardSlug}/${postSlug}`;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between">
                <div className="flex items-center gap-4">
                    <Link href={boardUrl}>
                        <ArrowLeftIcon width={28} height={28} />
                    </Link>
                    <h3 className="text-2xl">View Post</h3>
                </div>
                <PostActions
                    postId={post.id}
                    postUrl={postUrl}
                    boardUrl={boardUrl}
                />
            </div>
            <div className="flex flex-wrap gap-8">
                <PostCard post={post} baseLink="" linkInTitle={false} />
                <Comments postId={post.id} />
            </div>
        </div>
    );
}
