import { notFound } from "next/navigation";
import { getProject } from "@/lib/project/data";
import EditProjectForm from "@/components/project/form";
import ProjectAdminsForm from "@/components/project/edit/project-admins-form";
import DeleteProjectForm from "@/components/project/edit/delete-project-form";

export default async function Page({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    const categories = project.categories?.map((category) => {
        return { categoryId: category.id, title: category.title };
    });
    return (
        <div className="flex flex-wrap gap-8">
            <EditProjectForm
                edit={true}
                project={project}
                initialCategories={categories}
                className="lg:w-1/2"
            />
            <div className="flex w-full flex-1 flex-col gap-8 md:w-96">
                <ProjectAdminsForm projectId={project.id} />
                <DeleteProjectForm projectId={project.id} />
            </div>
        </div>
    );
}
