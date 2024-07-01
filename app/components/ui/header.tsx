import { Link } from "@remix-run/react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./button";
import { cn } from "~/lib/utils";
import { ProfileDropdown } from "./profile-dropdown";
import { User } from "~/lib/types";

interface HeaderProps {
  user: User | null;
  title: string;
  logoURL: string | null;
  className?: string;
}

export default function Header({
  className,
  user,
  title,
  logoURL,
}: HeaderProps) {
  return (
    <nav
      className={cn("flex justify-between border-b items-center", className)}
    >
      <Link to="/" className="prose dark:prose-invert flex gap-x-4">
        {logoURL && (
          <img
            src={logoURL}
            alt="Logo"
            width={32}
            height={32}
            className="m-0 justify-center items-center"
          />
        )}
        <h2 className="mt-0">{title}</h2>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <ProfileDropdown initials={user.username.slice(0, 2)} />
        ) : (
          <Button>
            <Link to="/login">Login</Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}
