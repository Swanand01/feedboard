import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createComment } from "~/lib/post/comment/actions";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const postId = formData.get("postId") as string;
  const replyToId = (formData.get("replyToId") as string) || undefined;
  const text = formData.get("text") as string;

  const { success, message } = await createComment(request, {
    postId,
    replyToId,
    text,
  });

  if (success) {
    return redirect(request.headers.get("Referer") || "/");
  }
  return { success, message };
}
