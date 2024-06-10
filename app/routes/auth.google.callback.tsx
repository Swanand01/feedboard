import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "../services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}
