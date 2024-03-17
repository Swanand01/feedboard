import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getUserSession } from "@/auth";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export default async function Header({ className }: { className?: string }) {
    const session = await getUserSession();

    return (
        <nav
            className={cn(
                "flex justify-between border-b-[1px] align-middle",
                className,
            )}
        >
            <Link href={"/home"} className="text-2xl">
                Feedboard
            </Link>
            <div className="flex items-center gap-4">
                {session?.user ? (
                    <h3>{session.user.username}</h3>
                ) : (
                    <Button>
                        <Link href="/users/login">Login</Link>
                    </Button>
                )}
                <ModeToggle />
            </div>
        </nav>
    );
}
