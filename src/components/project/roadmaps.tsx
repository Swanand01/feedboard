import { Category } from "@/lib/types";
import Roadmap from "./roadmap";

export default function Roadmaps({
    projectSlug,
    categories,
}: {
    projectSlug: string;
    categories: Array<Category>;
}) {
    return (
        <div className="flex flex-col gap-8">
            {categories.map((category: Category) => {
                return (
                    <Roadmap
                        key={category.id}
                        projectSlug={projectSlug}
                        category={category}
                    />
                );
            })}
        </div>
    );
}
