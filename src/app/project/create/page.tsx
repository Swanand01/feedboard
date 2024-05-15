import CreateProjectForm from "@/components/project/form";
import { isSuperuser } from "@/lib/permissions";
import { notFound } from "next/navigation";

export default async function Page() {
    const userIsSuperuser = await isSuperuser();
    if (!userIsSuperuser) {
        notFound();
    }

    return (
        <div className="w-full md:w-96 mx-auto">
            <CreateProjectForm />
        </div>
    );
}
