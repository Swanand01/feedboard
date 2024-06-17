import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createPost } from "~/lib/post/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { categoryId, values, boardUrl } = await request.json();
  const { success, message, post } = await createPost(
    request,
    categoryId,
    values,
  );
  if (success) {
    return redirect(`${boardUrl}/${post?.slug}`);
  }
  return { success, message };
}
