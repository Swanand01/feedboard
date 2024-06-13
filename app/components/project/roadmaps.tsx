import PostsByStatus, { Status } from "./posts-by-status";

interface RoadmapsProps {
  categories: {
    id: string;
    title: string;
    slug: string;
    statuses: Status[];
  }[];
  projectSlug: string;
}

export default function Roadmaps({ categories, projectSlug }: RoadmapsProps) {
  return (
    <div className="flex flex-col gap-8">
      {categories.map((category) => {
        return (
          <div key={category.id} className="flex flex-col gap-4">
            <div className="prose dark:prose-invert">
              <h3>{category.title} Roadmap</h3>
            </div>
            <div className="flex flex-wrap justify-between gap-y-4">
              {category.statuses.map((status) => {
                return (
                  <PostsByStatus
                    key={status.id}
                    status={status}
                    baseLink={`/project/${projectSlug}/${category.slug}`}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
