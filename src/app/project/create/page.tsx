import CreateProjectForm from "@/components/project/form";

export default function Page() {
    // Protect this route
    return (
        <div className="w-full md:w-96 mx-auto">
            <CreateProjectForm />
        </div>
    );
}
