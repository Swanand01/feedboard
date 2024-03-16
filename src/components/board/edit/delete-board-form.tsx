import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteBoardDialog from "./delete-board-dialog";
import { cn } from "@/lib/utils";

export default function DeleteBoardForm({
    categoryId,
    projectSlug,
    className,
}: {
    categoryId: string;
    projectSlug: string;
    className?: string;
}) {
    return (
        <Card className={cn("h-fit", className)}>
            <CardHeader>
                <CardTitle>Delete Board</CardTitle>
            </CardHeader>
            <CardContent>
                <DeleteBoardDialog
                    categoryId={categoryId}
                    projectSlug={projectSlug}
                />
            </CardContent>
        </Card>
    );
}
