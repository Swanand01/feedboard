import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function Error() {
  return (
    <div className="flex flex-col space-y-2 justify-center items-center w-screen h-screen">
      <h4 className="text-lg font-bold">Something went wrong</h4>
      <Link to={".."} className="!mt-8">
        <Button className="flex space-x-2 items-center">
          <ArrowLeftIcon />
          <span>Go Back</span>
        </Button>
      </Link>
    </div>
  );
}
