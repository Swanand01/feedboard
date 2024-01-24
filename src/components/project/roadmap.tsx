import { Category } from "@/lib/types";
import { Status } from "@prisma/client";
import PostsByStatus from "./posts-by-status";

export default function Roadmap({ category }: { category: Category }) {
    const statuses = category.statuses;

    return (
        <div key={category.id} className="flex flex-col gap-8">
            <h3 className="text-xl">{category.title} Roadmap</h3>
            <div className="flex gap-x-16 gap-y-8 flex-wrap">
                {statuses?.map((status: Status) => {
                    return <PostsByStatus key={status.id} status={status} />;
                })}
            </div>
        </div>
    );
}
