import Link from "next/link";
import { getUserSession } from "@/auth";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ProfileDropdown } from "./profile-dropdown";

export default async function Header({ className }: { className?: string }) {
    const session = await getUserSession();

    return (
        <nav
            className={cn(
                "flex justify-between border-b align-middle",
                className,
            )}
        >
            <Link href={"/home"} className="text-2xl">
                {process.env.INSTANCE_TITLE || "Feedboard"}
            </Link>
            <div className="flex items-center gap-4">
                {session?.user ? (
                    <ProfileDropdown
                        trigger={
                            <Button variant={"outline"}>
                                {session.user.username}
                            </Button>
                        }
                    />
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
