import { Category } from "@/lib/types";
import Roadmap from "./roadmap";

export default function Roadmaps({
    categories,
}: {
    categories: Array<Category>;
}) {
    return (
        <div className="flex flex-col gap-8">
            {categories.map((category: Category) => {
                return <Roadmap key={category.id} category={category} />;
            })}
        </div>
    );
}
