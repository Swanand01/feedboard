import { ErrorResponse, Link } from "@remix-run/react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

export default function RouteError({ error }: { error: ErrorResponse }) {
  const { status, statusText } = error;
  return (
    <div className="flex flex-col space-y-2 justify-center items-center prose dark:prose-invert">
      <h2>
        {status} | {statusText}
      </h2>
      <p className="text-lg text-center">{getErrorMessage(status)}</p>
      <Link to={".."} className="!mt-8 not-prose">
        <Button className="flex space-x-2 items-center">
          <ArrowLeftIcon />
          <span>Go Back</span>
        </Button>
      </Link>
    </div>
  );
}

function getErrorMessage(status: number) {
  switch (status) {
    case 400:
      return "Oops, there seems to be an issue with your request";
    case 401:
      return "Oops, it appears you don't have the necessary authorization to access this resource.";
    case 403:
      return "We apologize, but it seems you don't have permission to access this resource.";
    case 404:
      return "Sorry! We could not find you the page you are looking for.";
    case 504:
      return "Uh-oh! We're experiencing a temporary issue, and your request couldn't be completed.";
    default:
      return "We're sorry, but something went wrong on our end.";
  }
}
