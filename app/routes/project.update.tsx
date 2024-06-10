import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { updateProject } from "~/lib/project/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { projectId, values } = await request.json();
  const { success, message, project } = await updateProject(
    request,
    projectId,
    values,
  );

  if (success) {
    return redirect(`/project/${project?.slug}/settings/`);
  }
  return { success, message };
}
