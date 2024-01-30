import { notFound } from "next/navigation";
import { getProject } from "@/lib/project/data";
import EditProjectForm from "@/components/project/form";
import ProjectAdminsForm from "@/components/project/edit/project-admins-form";

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
        <div className="flex gap-8 flex-wrap">
            <EditProjectForm
                edit={true}
                project={project}
                initialCategories={categories}
                className="w-full md:w-96"
            />
            <ProjectAdminsForm
                projectId={project.id}
                className="w-full md:w-96"
            />
        </div>
    );
}
