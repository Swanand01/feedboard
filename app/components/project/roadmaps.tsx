import PostsByStatus, { Status } from "./posts-by-status";

interface RoadmapsProps {
  categories: {
    id: string;
    title: string;
    slug: string;
    statuses: Status[];
  }[];
}

export default function Roadmaps({ categories }: RoadmapsProps) {
  return (
    <div className="flex flex-col gap-8">
      {categories.map((category) => {
        return (
          <div key={category.id} className="flex flex-col gap-8">
            <h3 className="text-xl">{category.title} Roadmap</h3>
            <div className="flex flex-wrap justify-between gap-y-8">
              {category.statuses.map((status) => {
                return (
                  <PostsByStatus
                    key={status.id}
                    status={status}
                    baseLink={category.slug}
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
