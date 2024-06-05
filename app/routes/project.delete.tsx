import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteProject } from "~/lib/project/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { projectId } = await request.json();
  const { success, message } = await deleteProject(request, projectId);

  if (success) {
    return redirect("/");
  }
  return { success, message };
}
