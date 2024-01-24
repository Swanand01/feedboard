import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getUserSession } from "@/auth";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./button";

export default async function Header() {
    const session = await getUserSession();

    return (
        <div>
            <nav className="flex justify-between align-middle px-8 py-4">
                <Link href={"/home"} className="text-2xl">
                    Feedboard
                </Link>
                <div className="flex gap-4 items-center">
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
            <Separator />
        </div>
    );
}
