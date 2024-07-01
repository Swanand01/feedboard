import { getProject, getProjectAdmins } from "~/lib/project/data";
import EditProjectForm from "~/components/project/form";
import ProjectAdminsForm from "~/components/project/edit/project-admins-form";
import DeleteProjectForm from "~/components/project/edit/delete-project-form";
import { isProjectOwner, isSuperuser } from "~/lib/permissions.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { useLoaderData } from "@remix-run/react";
import { BreadcrumbItem, BreadcrumbLink } from "~/components/ui/breadcrumb";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { projectSlug } = params;
  if (!projectSlug) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const project = await getProject(projectSlug);
  if (!project) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const userIsSuperuser = await isSuperuser(user);
  const userIsProjectOwner = await isProjectOwner(user, project.id);
  const hasPagePermissions = userIsSuperuser || userIsProjectOwner;

  if (!hasPagePermissions) {
    throw new Response(null, {
      status: 403,
      statusText: "Unauthorised",
    });
  }

  const categories = project.categories.map((category) => {
    return { categoryId: category.id, title: category.title };
  });

  const projectAdmins = await getProjectAdmins(project.id);

  return {
    project: {
      id: project.id,
      title: project.title,
      description: project.description,
      slug: String(project.slug),
    },
    categories,
    projectAdmins,
  };
}

export default function Page() {
  const { project, categories, projectAdmins } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-wrap gap-8 mt-8">
      <EditProjectForm
        edit={true}
        project={project}
        initialCategories={categories}
        className="lg:w-1/2"
      />
      <div className="flex w-full flex-1 flex-col gap-8 md:w-96">
        <ProjectAdminsForm
          projectAdmins={projectAdmins}
          projectId={project.id}
        />
        <DeleteProjectForm projectId={project.id} />
      </div>
    </div>
  );
}

export const handle = {
  breadcrumb: ({ pathname }) => (
    <BreadcrumbItem>
      <BreadcrumbLink href={pathname}>Settings</BreadcrumbLink>
    </BreadcrumbItem>
  ),
};
