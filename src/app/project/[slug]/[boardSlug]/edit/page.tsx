import { getCategory } from "@/lib/board/data";
import { notFound } from "next/navigation";
import EditBoardForm from "@/components/board/form";
import DefaultStatusForm from "@/components/board/edit/default-status-form";
import DeleteBoardForm from "@/components/board/edit/delete-board-form";

export default async function Page({
    params,
}: {
    params: { boardSlug: string };
}) {
    const { boardSlug } = params;
    const category = await getCategory(boardSlug);
    if (!category) {
        notFound();
    }

    const statuses = category.statuses.map((status) => {
        return { ...status, statusId: status.id };
    });

    return (
        <div className="flex flex-wrap gap-8">
            <EditBoardForm
                edit={true}
                category={category}
                initialStatuses={statuses}
            />
            <div className="flex w-full flex-1 flex-col gap-8 md:w-96">
                <DefaultStatusForm statuses={statuses} />
                <DeleteBoardForm
                    categoryId={category.id}
                    projectSlug={category.project?.slug || ""}
                />
            </div>
        </div>
    );
}
