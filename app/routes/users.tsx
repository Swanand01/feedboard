import { LoaderFunctionArgs } from "@remix-run/node";
import { getUsersLikeUsername } from "~/lib/users/data";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  let results: { username: string; id: string }[] = [];
  if (username) {
    results = await getUsersLikeUsername(username);
  }
  return { results };
}
