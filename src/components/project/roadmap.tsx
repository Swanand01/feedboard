import { Category } from "@/lib/types";
import { Status } from "@prisma/client";
import PostsByStatus from "./posts-by-status";

export default function Roadmap({
    projectSlug,
    category,
}: {
    projectSlug: string;
    category: Category;
}) {
    const statuses = category.statuses;

    return (
        <div key={category.id} className="flex flex-col gap-8">
            <h3 className="text-xl">{category.title} Roadmap</h3>
            <div className="flex flex-wrap justify-between gap-y-8">
                {statuses?.map((status: Status) => {
                    return (
                        <PostsByStatus
                            key={status.id}
                            status={status}
                            baseLink={`/project/${projectSlug}/${category.slug}`}
                        />
                    );
                })}
            </div>
        </div>
    );
}
