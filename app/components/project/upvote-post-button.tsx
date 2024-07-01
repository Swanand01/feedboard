import { useFetcher } from "@remix-run/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CaretUpIcon, TriangleUpIcon } from "@radix-ui/react-icons";

export function UpvotePostButton({
  postId,
  upvotes,
  hasUpvoted,
}: {
  postId: string;
  upvotes: number;
  hasUpvoted: boolean;
}) {
  const fetcher = useFetcher();
  const upvoted = fetcher.formData
    ? fetcher.formData.get("upvoted") === "1"
    : hasUpvoted;

  return (
    <fetcher.Form
      className={
        "bg-tertiary ml-4 flex h-full flex-none flex-col items-center justify-center rounded-l-md not-prose"
      }
      action="/post/vote/"
      method="POST"
    >
      <Input type="hidden" name="postId" value={postId} />
      <Button
        type="submit"
        name="upvoted"
        variant="ghost"
        size="icon"
        value={upvoted ? "0" : "1"}
      >
        {upvoted ? (
          <TriangleUpIcon className="h-7 w-7" />
        ) : (
          <CaretUpIcon className="h-7 w-7" />
        )}
      </Button>
      <p>{upvotes.toString()}</p>
    </fetcher.Form>
  );
}
