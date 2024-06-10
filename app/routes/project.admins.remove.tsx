import { ActionFunctionArgs } from "@remix-run/node";
import { deleteProjectAdmin } from "~/lib/project/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { projectAdminId } = await request.json();
  const { success, message } = await deleteProjectAdmin(
    request,
    projectAdminId,
  );
  return { success, message };
}
