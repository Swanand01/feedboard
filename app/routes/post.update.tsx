import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { updatePost } from "~/lib/post/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { postId, values } = await request.json();
  const { success, message, post } = await updatePost(request, postId, values);
  if (success && post) {
    return redirect(
      `/project/${post.category.project.slug}/${post.category.slug}/${post.slug}`,
    );
  }
  return { success, message };
}
