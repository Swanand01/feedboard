import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/home/project-card";
import { getProjects } from "@/lib/home/data";
import { getUserSession } from "@/auth";

export default async function Page() {
    const session = await getUserSession();
    const projects = await getProjects();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between">
                <h3 className="text-2xl">Projects</h3>
                {session?.user?.isSuperuser && (
                    <Button>
                        <Link href={"/project/create/"}>New Project</Link>
                    </Button>
                )}
            </div>
            <div className="flex gap-8 flex-wrap">
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
