import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteCategory } from "~/lib/board/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { categoryId } = await request.json();

  const { success, message, category } = await deleteCategory(
    request,
    categoryId,
  );
  if (success) {
    return redirect(`/project/${category?.project.slug}`);
  }
  return { success, message };
}
