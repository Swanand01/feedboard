import { useState } from "react";
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
  const [vote, setVote] = useState<{ isUpvoted: boolean; voteCount: number }>({
    isUpvoted: hasUpvoted,
    voteCount: upvotes,
  });

  async function handleUpvote() {
    setVote((vote) => {
      if (vote.isUpvoted) {
        return {
          isUpvoted: !vote.isUpvoted,
          voteCount: vote.voteCount - 1,
        };
      }
      return {
        isUpvoted: !vote.isUpvoted,
        voteCount: vote.voteCount + 1,
      };
    });
  }

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
        onClick={handleUpvote}
        variant="ghost"
        className="px-2"
      >
        {vote.isUpvoted ? (
          <TriangleUpIcon width={28} height={28} />
        ) : (
          <CaretUpIcon width={28} height={28} />
        )}
      </Button>
      <p>{vote.voteCount.toString()}</p>
    </fetcher.Form>
  );
}
