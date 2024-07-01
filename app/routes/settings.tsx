import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  NodeOnDiskFile,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { isSuperuser } from "~/lib/permissions.server";
import { getSiteOption, setSiteOption } from "~/lib/utils.server";
import { parseSiteFormData } from "~/lib/site/actions";
import {
  SiteFormInputs,
  updateFormSchema as UpdateSite,
} from "~/lib/site/constants";
import EditSiteForm from "~/components/site/form";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const userIsSuperuser = await isSuperuser(user);
  if (!userIsSuperuser) {
    return redirect("/");
  }

  const title = (await getSiteOption("title")) || "";
  const logoURL = (await getSiteOption("logo")) || "";
  return { title, logoURL };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const userIsSuperuser = await isSuperuser(user);
  if (!userIsSuperuser) {
    return redirect("/");
  }

  const formData = await parseSiteFormData(request);
  const formInputs: SiteFormInputs = {
    title: formData.get("title") as string,
    logo: formData.get("file"),
  };

  const validatedFields = UpdateSite.safeParse(formInputs);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid payload.",
    };
  }

  const title = formData.get("title") as string;
  await setSiteOption("title", title);

  if (formData.get("file")) {
    const logo = formData.get("file") as NodeOnDiskFile;
    await setSiteOption("logo", `/uploads/${logo.name}`);
  }
  return redirect("/");
}

export default function Page() {
  const { title, logoURL } = useLoaderData<typeof loader>();
  return (
    <div className="w-full md:w-96 mx-auto">
      <EditSiteForm edit={true} siteOptions={{ title, logo: logoURL }} />
    </div>
  );
}
