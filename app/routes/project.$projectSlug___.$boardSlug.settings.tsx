import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import EditBoardForm from "~/components/board/form";
import { useLoaderData } from "@remix-run/react";
import { getCategory } from "~/lib/board/data";
import {
  isProjectAdmin,
  isProjectOwner,
  isSuperuser,
} from "~/lib/permissions.server";
import { authenticator } from "~/services/auth.server";
import DefaultStatusForm from "~/components/board/edit/default-status-form";
import DeleteBoardForm from "~/components/board/edit/delete-board-form";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const { boardSlug } = params;
  const category = await getCategory(String(boardSlug));
  if (!category) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const userIsSuperuser = await isSuperuser(user);
  const userIsProjectOwner = await isProjectOwner(user, category.projectId);
  const userIsProjectAdmin = await isProjectAdmin(user, category.projectId);

  const hasPagePermissions =
    userIsSuperuser || userIsProjectOwner || userIsProjectAdmin;
  if (!hasPagePermissions) {
    return redirect("/");
  }

  const hasDeletePermissions = userIsSuperuser || userIsProjectOwner;

  const statuses = category.statuses.map((status) => {
    return { ...status, statusId: status.id };
  });

  return { category, statuses, hasDeletePermissions };
}

export default function Page() {
  const { category, statuses, hasDeletePermissions } =
    useLoaderData<typeof loader>();
  return (
    <div className="flex flex-wrap gap-8">
      <EditBoardForm
        edit={true}
        category={category}
        initialStatuses={statuses}
      />
      <div className="flex w-full flex-1 flex-col gap-8 md:w-96">
        <DefaultStatusForm statuses={statuses} />
        {hasDeletePermissions && <DeleteBoardForm categoryId={category.id} />}
      </div>
    </div>
  );
}
