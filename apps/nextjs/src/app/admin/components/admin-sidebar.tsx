import Link from "next/link";
import { cn } from "@monitall/ui";
import { Button } from "@monitall/ui/button";
import { BookTemplate, Factory, Users } from "lucide-react";

interface AdminSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: AdminSidebarProps) {
  return (
    <div
      className={cn("pb-12", className)}
      style={{ height: "calc(100vh - 4rem - 2px)" }}
    >
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Admin
          </h2>
          <div className="space-y-1">
            <Link href="/admin/users">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <BookTemplate className="mr-2 h-4 w-4" />
              Templates
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Factory className="mr-2 h-4 w-4" />
              Funds
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
