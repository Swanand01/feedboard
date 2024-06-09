import { Link } from "@remix-run/react";
// import { ModeToggle } from "./mode-toggle";
import { Button } from "./button";
import { cn } from "~/lib/utils";
import { ProfileDropdown } from "./profile-dropdown";
import { User } from "~/lib/types";

interface HeaderProps {
  user: User | null;
  title?: string;
  className?: string;
}

export default function Header({ className, user, title }: HeaderProps) {
  return (
    <nav
      className={cn("flex justify-between border-b align-middle", className)}
    >
      <Link to="/" className="prose">
        <h2>{title || "Feedboard"}</h2>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <ProfileDropdown
            trigger={<Button variant={"outline"}>{user.username}</Button>}
          />
        ) : (
          <Button>
            <Link to="/login">Login</Link>
          </Button>
        )}
        {/* <ModeToggle /> */}
      </div>
    </nav>
  );
}
