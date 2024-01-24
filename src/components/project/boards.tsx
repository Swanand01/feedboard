import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@prisma/client";

function Boards({ categories }: { categories: Array<Category> }) {
    return (
        <div className="flex flex-wrap gap-x-16 gap-y-4">
            {categories.map((category: Category) => {
                return (
                    <Card key={category.id} className="w-full md:w-96">
                        <Link href={``}>
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
