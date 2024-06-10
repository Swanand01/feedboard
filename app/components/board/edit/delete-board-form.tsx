import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import DeleteBoardDialog from "./delete-board-dialog";
import { cn } from "~/lib/utils";

export default function DeleteBoardForm({
  categoryId,
  className,
}: {
  categoryId: string;
  className?: string;
}) {
  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader className="prose dark:prose-invert">
        <CardTitle>Delete Board</CardTitle>
      </CardHeader>
      <CardContent>
        <DeleteBoardDialog categoryId={categoryId} />
      </CardContent>
    </Card>
  );
}
