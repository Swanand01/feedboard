import { LoaderFunctionArgs } from "@remix-run/node";
import { getComments } from "~/lib/post/comment/data";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId") || "";
  const replyToId = searchParams.get("replyToId") || "";
  const replies = await getComments(postId, replyToId);
  return replies;
}
