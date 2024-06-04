import { Link, json, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import ProjectCard from "~/components/home/project-card";
import { getProjects } from "~/lib/home/data";
import { isSuperuser } from "~/lib/permissions.server";
import { Project } from "@prisma/client";
import { authenticator } from "~/services/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const projects: Project[] = await getProjects();
  const user = await authenticator.isAuthenticated(request);
  const userIsSuperuser = user && (await isSuperuser(user));
  return json({ projects, isSuperuser: userIsSuperuser });
}

export default function Page() {
  const { projects, isSuperuser } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <h3 className="text-2xl">Projects</h3>
        {isSuperuser && (
          <Button>
            <Link to={"/project/create/"}>New Project</Link>
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-8">
        {projects.length === 0
          ? "No projects found."
          : projects.map((project) => {
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