import { useOutletContext } from "@remix-run/react";
import Boards from "~/components/project/boards";
import Roadmaps from "~/components/project/roadmaps";
import { projectLoader } from "./project.$projectSlug";

export default function Page() {
  const { slug, description, categories } = useOutletContext<projectLoader>();
  return (
    <div className="flex flex-col gap-8 mt-8">
      <p>{description}</p>
      <div className="flex flex-col gap-4">
        <h3 className="text-lg">Boards</h3>
        <Boards categories={categories} />
      </div>
      <div className="flex flex-col gap-4">
        <Roadmaps categories={categories} projectSlug={slug} />
      </div>
    </div>
  );
}
