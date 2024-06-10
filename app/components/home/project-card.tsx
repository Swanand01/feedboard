import { Link } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type ProjectCardProps = {
  title: string;
  slug: string;
  description: string;
};

function ProjectCard({ title, slug, description }: ProjectCardProps) {
  return (
    <Card>
      <Link to={`project/${slug}/`}>
        <CardHeader className="prose dark:prose-invert">
          <CardTitle className="hover:opacity-70">{title}</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <p className="line-clamp-4">{description}</p>
        </CardContent>
      </Link>
    </Card>
  );
}

export default ProjectCard;
