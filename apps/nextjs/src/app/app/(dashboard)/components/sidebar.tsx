import { cn } from "@monitall/ui";
import { SidebarNavItem } from "types";

import { DashboardNav } from "./nav";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  slug?: string;
  items: SidebarNavItem[];
}

export function Sidebar({ className, slug, items }: SidebarProps) {
  return (
    <aside className="col-span-1 hidden flex-col lg:flex">
      <div
        className={cn("pb-12", className)}
        style={{ height: "calc(100vh - 4rem - 2px)" }}
      >
        <div className="space-y-4 py-4">
          <DashboardNav items={items} slug={slug} />
        </div>
      </div>
    </aside>
  );
}
