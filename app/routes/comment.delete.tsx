import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteComment } from "~/lib/post/comment/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { commentId } = await request.json();
  const { success, message } = await deleteComment(request, commentId);
  if (success) {
    return redirect(request.headers.get("Referer") || "/");
  }
  return { success, message };
}
