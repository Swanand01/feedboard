import { ActionFunctionArgs } from "@remix-run/node";
import { changeDefaultStatus } from "~/lib/board/status/actions";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const statusId = formData.get("statusId") as string;
  const { success, message } = await changeDefaultStatus(request, statusId);
  return { success, message };
}
