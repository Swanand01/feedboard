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
  return { projects, isSuperuser: userIsSuperuser };
}

export default function Page() {
  const { projects, isSuperuser } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-end gap-4">
        {isSuperuser && (
          <>
            <Link to="/settings/">
              <Button variant="secondary">Site Settings</Button>
            </Link>
            <Link to="/project/create/">
              <Button>New Project</Button>
            </Link>
          </>
        )}
      </div>
      <div className="grid-cols-1 grid gap-4 md:grid-cols-3">
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
