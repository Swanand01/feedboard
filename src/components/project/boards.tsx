import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@prisma/client";

function Boards({
    projectSlug,
    categories,
}: {
    projectSlug: string;
    categories: Array<Category>;
}) {
    return (
        <div className="flex flex-wrap justify-between gap-y-4">
            {categories.map((category: Category) => {
                return (
                    <Card key={category.id} className="w-full lg:w-[32%]">
                        <Link href={`${projectSlug}/${category.slug}`}>
                            <CardHeader>
                                <CardTitle className="text-xl hover:opacity-70">
                                    {category.title}
                                </CardTitle>
                            </CardHeader>
                        </Link>
                    </Card>
                );
            })}
        </div>
    );
}

export default Boards;
