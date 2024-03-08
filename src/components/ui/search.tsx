"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

export default function Search({
    placeholder,
    className,
}: {
    placeholder: string;
    className?: string;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className={cn("", className)}>
            <Label htmlFor="title">Search</Label>
            <Input
                name="title"
                type="search"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get("query")?.toString()}
                className="mt-2"
            />
        </div>
    );
}
