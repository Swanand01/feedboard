import { ActionFunctionArgs } from "react-router";
import { votePost } from "~/lib/post/actions";

export async function action({ request }: ActionFunctionArgs) {
  const postId = (await request.formData()).get("postId") as string;
  const { success, message } = await votePost(request, postId);
  return { success, message };
}
