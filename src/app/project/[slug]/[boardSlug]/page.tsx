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
    params: { boardSlug: string };
    searchParams?: {
        query?: string;
        page?: string;
        status?: string;
    };
}) {
    const slug = params.boardSlug;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const status = searchParams?.status || "all";
    const category = await getCategory(slug);

    if (!category) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-center">
                <Link href="">
                    <ArrowLeftIcon width={28} height={28} />
                </Link>
                <h3 className="text-2xl">{category.title}</h3>
                <Link href={`/project/${slug}/edit/`}>
                    <GearIcon width={24} height={24} />
                </Link>
            </div>
            <div className="flex gap-8 flex-wrap">
                <div className="flex flex-col gap-8 flex-1 order-2 lg:order-1">
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
