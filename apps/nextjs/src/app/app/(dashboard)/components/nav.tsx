"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@monitall/ui";
import { Icons } from "@monitall/ui/icons";

import { SidebarNavItem } from "~/../types";

interface DashboardNavProps {
  items: SidebarNavItem[];
  slug?: string;
}

export function DashboardNav({ items, slug }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2 px-4">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];

        if ("separator" in item) {
          return (
            <h2
              key={"i" + index}
              className="mb-2 mt-6 px-6 text-lg font-semibold tracking-tight"
            >
              {item.title}
            </h2>
          );
        }
        const dashbboardHref = slug ? "/" + slug + item.href : item.href;
        return (
          item.href && (
            <Link key={"i" + index} href={item.disabled ? "/" : dashbboardHref}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:opacity-75",
                  path === dashbboardHref
                    ? "bg-primary text-primary-foreground opacity-75"
                    : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
