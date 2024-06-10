import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deletePost } from "~/lib/post/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { postId } = await request.json();
  const { success, message, post } = await deletePost(request, postId);
  if (success && post) {
    return redirect(
      `/project/${post.category.project.slug}/${post.category.slug}/`,
    );
  }
  return { success, message };
}
