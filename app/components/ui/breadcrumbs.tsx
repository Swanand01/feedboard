import { Params, UIMatch, useMatches } from "@remix-run/react";
import { Fragment, HTMLAttributes } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "./breadcrumb";

type BreadcrumbMatch = UIMatch<
  Record<string, unknown>,
  {
    breadcrumb: (data: {
      data?: unknown;
      params?: Params<string>;
      pathname: string;
      id: string;
    }) => JSX.Element;
  }
>;

export const Breadcrumbs = ({ ...props }: HTMLAttributes<HTMLElement>) => {
  const matches = (useMatches() as unknown as BreadcrumbMatch[]).filter(
    ({ handle }) => handle?.breadcrumb,
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {matches.map(({ handle, data, params, pathname, id }, i) => (
          <Fragment key={id}>
            {i > 0 && <BreadcrumbSeparator />}
            {handle.breadcrumb({ data, params, pathname, id })}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
