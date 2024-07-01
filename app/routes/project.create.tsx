import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { isSuperuser } from "~/lib/permissions.server";
import CreateProjectForm from "~/components/project/form";
import { authenticator } from "~/services/auth.server";
import { createProject } from "~/lib/project/actions";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const hasPermissions = isSuperuser(user);
  if (!hasPermissions) {
    throw new Response(null, {
      status: 403,
      statusText: "Unauthorised.",
    });
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const { success, project } = await createProject(request);

  if (success) {
    return redirect(`/project/${project?.slug}`);
  } else {
    return null;
  }
}

export default function Page() {
  return (
    <div className="w-full md:w-96 mx-auto">
      <CreateProjectForm />
    </div>
  );
}
