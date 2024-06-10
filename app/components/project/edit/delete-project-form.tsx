import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import DeleteProjectDialog from "./delete-project-dialog";
import { cn } from "~/lib/utils";

export default function DeleteProjectForm({
  projectId,
  className,
}: {
  projectId: string;
  className?: string;
}) {
  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader className="prose dark:prose-invert">
        <CardTitle>Delete Project</CardTitle>
      </CardHeader>
      <CardContent>
        <DeleteProjectDialog projectId={projectId} />
      </CardContent>
    </Card>
  );
}
