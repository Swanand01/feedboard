"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { number } from "zod";

type PaginationWrapperProps = {
    totalCount: number;
    pageSize: number;
};

export default function PaginationWrapper({
    totalCount,
    pageSize,
}: PaginationWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    let currentPage = Number(searchParams.get("page")) || 1;
    const pageCount = Math.ceil(totalCount / pageSize);
    if (pageCount <= 1) return null;

    currentPage = Math.max(1, Math.min(currentPage, pageCount));

    const generatePaginationLinks = () => {
        const paginationLinks = [];
        const leftEllipsis = currentPage > 2;
        const rightEllipsis = currentPage < pageCount - 1;

        for (let i = 1; i <= pageCount; i++) {
            if (
                i === 1 ||
                i === pageCount ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                const href = generateHref(i);
                paginationLinks.push(
                    <PaginationLink
                        key={i}
                        href={href}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                );
            }
        }

        if (leftEllipsis) {
            paginationLinks.splice(1, 0, <PaginationEllipsis key="left" />);
        }
        if (rightEllipsis) {
            paginationLinks.splice(
                paginationLinks.length - 1,
                0,
                <PaginationEllipsis key="right" />
            );
        }

        return paginationLinks;
    };

    const generateHref = (pageNumber: number) => {
        let page = Math.max(1, Math.min(pageNumber, pageCount));
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());

        if (query !== "") {
            params.set("query", query);
        }
        return `${pathname}?${params.toString()}`;
    };

    const changePage = (pageNumber: number) => {
        router.push(generateHref(pageNumber));
    };
    return (
        <Pagination>
            <PaginationContent className=" *:cursor-pointer">
                <Button
                    variant="ghost"
                    disabled={currentPage <= 1}
                    onClick={() => changePage(currentPage - 1)}
                    className="group"
                >
                    <ChevronLeftIcon className="group-hover:-translate-x-1 transition-all duration-300 delay-150" />
                    Previous
                </Button>
                {generatePaginationLinks()}
                <Button
                    variant="ghost"
                    disabled={currentPage === pageCount}
                    onClick={() => changePage(currentPage + 1)}
                    className="group"
                >
                    Next
                    <ChevronRightIcon className="group-hover:translate-x-1 transition-all duration-300 delay-150" />
                </Button>
            </PaginationContent>
        </Pagination>
    );
}
