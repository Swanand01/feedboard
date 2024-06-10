import { ActionFunctionArgs } from "@remix-run/node";
import { createProjectAdmin } from "~/lib/project/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { userId, projectId } = Object.fromEntries(await request.formData());
  const { success, message } = await createProjectAdmin(
    request,
    String(userId),
    String(projectId),
  );
  return { success, message };
}
