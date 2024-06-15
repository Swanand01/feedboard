import { Avatar, AvatarFallback } from "./avatar";

export default function UserAvatar({ initials }: { initials: string }) {
  return (
    <Avatar>
      <AvatarFallback className="uppercase">{initials}</AvatarFallback>
    </Avatar>
  );
}
