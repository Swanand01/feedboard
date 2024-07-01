import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  NodeOnDiskFile,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import CreateSiteForm from "~/components/site/form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { isSuperuser } from "~/lib/permissions.server";
import { parseSiteFormData } from "~/lib/site/actions";
import {
  createFormSchema as CreateSite,
  SiteFormInputs,
} from "~/lib/site/constants";
import { getSiteOption, setSiteOption } from "~/lib/utils.server";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const userIsSuperuser = await isSuperuser(user);
  if (!userIsSuperuser) {
    return redirect("/");
  }

  const onboardingCompleted = await getSiteOption("onboardingCompleted");
  return { onboardingCompleted: JSON.parse(`${onboardingCompleted}`) };
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

  const validatedFields = CreateSite.safeParse(formInputs);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid payload.",
    };
  }

  const title = formData.get("title") as string;
  setSiteOption("title", title);

  if (formData.get("file")) {
    const logo = formData.get("file") as NodeOnDiskFile;
    setSiteOption("logo", `/uploads/${logo.name}`);
  }

  setSiteOption("onboardingCompleted", "true");

  return redirect("/project/create/");
}

export default function Page() {
  const { onboardingCompleted } = useLoaderData<typeof loader>();
  return (
    <div className="w-full md:w-96 mx-auto">
      {onboardingCompleted ? (
        <Card>
          <CardHeader className="prose dark:prose-invert">
            <CardTitle>Onboarding completed.</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button>Home</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <CreateSiteForm />
      )}
    </div>
  );
}
