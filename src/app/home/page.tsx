import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/home/project-card";
import { getProjects } from "@/lib/home/data";
import { isSuperuser } from "@/lib/permissions";

export default async function Page() {
    const projects = await getProjects();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between">
                <h3 className="text-2xl">Projects</h3>
                {(await isSuperuser()) && (
                    <Button>
                        <Link href={"/project/create/"}>New Project</Link>
                    </Button>
                )}
            </div>
            <div className="flex flex-wrap gap-8">
                {projects.map((project) => {
                    return (
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            slug={project?.slug || ""}
                            description={project.description}
                        />
                    );
                })}
            </div>
        </div>
    );
}
