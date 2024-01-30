import { getProjectAdmins } from "@/lib/project/data";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../ui/card";
import { AddProjectAdmin } from "./add-project-admin";
import DeleteProjectAdminDialog from "./delete-project-admin-dialog";

export default async function ProjectAdminsForm({
    projectId,
    className,
}: {
    projectId: string;
    className?: string;
}) {
    const projectAdmins = await getProjectAdmins(projectId);

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Edit Project Admins</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {projectAdmins.length === 0 ? (
                    <div className="text-sm">No Project Admins.</div>
                ) : (
                    projectAdmins.map((admin) => (
                        <div className="flex gap-4" key={admin.id}>
                            <div className="flex items-center w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                                <p>{admin.user.username}</p>
                            </div>
                            <DeleteProjectAdminDialog
                                projectAdminId={admin.id}
                            />
                        </div>
                    ))
                )}
            </CardContent>
            <CardFooter>
                <AddProjectAdmin projectId={projectId} />
            </CardFooter>
        </Card>
    );
}
