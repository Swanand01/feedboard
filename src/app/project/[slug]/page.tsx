import Link from "next/link";
import { getProject } from "@/lib/project/data";
import { ArrowLeftIcon, GearIcon } from "@radix-ui/react-icons";
import Boards from "@/components/project/boards";
import Roadmaps from "@/components/project/roadmaps";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    const categories = project.categories;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-8">
                <div className="flex gap-4 items-center">
                    <Link href="/">
                        <ArrowLeftIcon width={28} height={28} />
                    </Link>
                    <h3 className="text-2xl">{project.title}</h3>
                    <Link href={`/project/${slug}/edit/`}>
                        <GearIcon width={24} height={24} />
                    </Link>
                </div>
                <p>{project.description}</p>
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="text-xl">Boards</h3>
                <Boards categories={categories} />
            </div>
            <div className="flex flex-col gap-4">
                <Roadmaps categories={categories} />
            </div>
        </div>
    );
}
