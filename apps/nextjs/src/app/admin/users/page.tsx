import { db } from "@monitall/db";
import { Avatar, AvatarFallback } from "@monitall/ui/avatar";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const users = await db.user.findMany({});

  return (
    <>
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      <div className="mt-8 space-y-8">
        {users.map((u) => {
          return (
            <div key={u.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
                <AvatarFallback>{getInitials(u.name || "")}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{u.name}</p>
                <p className="text-sm text-muted-foreground">{u.email}</p>
              </div>
              <div className="ml-auto font-medium">{u.role}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function getInitials(name: string) {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

  const initialsR = [...name.matchAll(rgx)] || [];

  const initials = (
    (initialsR.shift()?.[1] || "") + (initialsR.pop()?.[1] || "")
  ).toUpperCase();

  return initials;
}
