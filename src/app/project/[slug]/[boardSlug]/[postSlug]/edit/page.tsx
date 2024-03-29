import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/post/data";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import EditPostForm from "@/components/post/form";

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

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Link href={`/project/${projectSlug}/${boardSlug}/`}>
                    <ArrowLeftIcon width={28} height={28} />
                </Link>
                <h3 className="text-2xl">Edit Post</h3>
            </div>
            <div className="flex flex-wrap gap-8">
                <EditPostForm
                    categoryId={post.status.categoryId}
                    edit={true}
                    post={post}
                    boardUrl={`/project/${projectSlug}/${boardSlug}/`}
                />
            </div>
        </div>
    );
}
