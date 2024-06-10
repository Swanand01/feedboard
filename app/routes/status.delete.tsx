import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteStatus } from "~/lib/board/status/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { statusId } = await request.json();
  const { success, message, status } = await deleteStatus(request, statusId);

  if (success) {
    return redirect(
      `/project/${status?.category.project.slug}/${status?.category.slug}/settings`,
    );
  }
  return { success, message };
}
