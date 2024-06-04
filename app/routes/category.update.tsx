import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { updateCategory } from "~/lib/board/actions";
import { createOrUpdateStatus } from "~/lib/board/status/actions";

export async function action({ request }: ActionFunctionArgs) {
  const { categoryId, title, statuses } = await request.json();
  const { success: categorySuccess, category } = await updateCategory(
    request,
    categoryId,
    title,
  );

  let statusSuccess = false;
  for (const status of statuses) {
    const { success } = await createOrUpdateStatus(request, status, categoryId);
    statusSuccess = success;
  }

  const updateSuccess = categorySuccess && statusSuccess;
  if (updateSuccess) {
    return redirect(
      `/project/${category?.project.slug}/${category?.slug}/settings`,
    );
  }

  return {
    success: updateSuccess,
    message: updateSuccess
      ? "Categories and statuses updated successfully."
      : "Failed to update categories and statuses.",
  };
}
