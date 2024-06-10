import { useSearchParams, useNavigation } from "@remix-run/react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "~/lib/utils";

export default function Search({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    setSearchParams(params);
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
      {navigation.state === "submitting" && <div>Loading...</div>}
    </div>
  );
}
