import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/board/data";
import Search from "@/components/ui/search";
import Posts from "@/components/board/posts";
import { ArrowLeftIcon, GearIcon } from "@radix-ui/react-icons";
import CreatePostForm from "@/components/post/form";
import FilterByStatus from "@/components/board/filter-by-status";

export default async function Page({
    params,
    searchParams,
}: {
    params: { slug: string; boardSlug: string };
    searchParams?: {
        query?: string;
        page?: string;
        status?: string;
    };
}) {
    const { slug: projectSlug, boardSlug } = params;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const status = searchParams?.status || "all";
    const category = await getCategory(boardSlug);

    if (!category) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Link href={`/project/${projectSlug}/`}>
                    <ArrowLeftIcon width={28} height={28} />
                </Link>
                <h3 className="text-2xl">{category.title}</h3>
                <Link href={`/project/${projectSlug}/${boardSlug}/edit/`}>
                    <GearIcon width={24} height={24} />
                </Link>
            </div>
            <div className="flex flex-wrap gap-8">
                <div className="order-2 flex flex-1 flex-col gap-8 lg:order-1">
                    <div className="flex gap-4">
                        <Search
                            placeholder="Search by title..."
                            className="w-2/3 lg:w-3/4"
                        />
                        <FilterByStatus
                            statuses={category.statuses}
                            selectedStatus={status}
                            className="flex-1"
                        />
                    </div>
                    <Posts
                        categoryId={category.id}
                        query={query}
                        currentPage={currentPage}
                        status={status}
                    />
                </div>
                <CreatePostForm
                    categoryId={category.id}
                    className="order-1 lg:sticky lg:top-8"
                />
            </div>
        </div>
    );
}
